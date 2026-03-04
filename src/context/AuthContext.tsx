import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import insforge from '../lib/insforge';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    session: any;
    loading: boolean;
    login: (email: string, password: string) => Promise<any>;
    register: (userData: any) => Promise<any>;
    logout: () => Promise<void>;
    verifyEmail: (email: string, otp: string, userData: any) => Promise<void>;
    resendVerification: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Helper: Build user object from InsForge session + our DB profile
    const buildUser = async (authUser: any): Promise<User | null> => {
        if (!authUser) return null;
        try {
            // 1. Try finding by Auth ID (Primary)
            let { data: profile } = await insforge.database
                .from('users')
                .select('*')
                .eq('id', authUser.id)
                .single();

            // 2. Fallback: Try finding by Email (handles ID mismatches during migration)
            if (!profile && authUser.email) {
                const { data: emailProfile } = await insforge.database
                    .from('users')
                    .select('*')
                    .eq('email', authUser.email)
                    .single();

                if (emailProfile) {
                    console.log('Synchronizing Auth ID for:', authUser.email);
                    // Update the row with the new Auth ID so it works by ID next time
                    await insforge.database
                        .from('users')
                        .update({ id: authUser.id })
                        .eq('email', authUser.email);
                    profile = { ...emailProfile, id: authUser.id };
                }
            }

            if (profile) {
                return { ...profile, email: authUser.email } as User;
            }
        } catch (e: any) {
            console.log('Profile lookup failed:', e.message);
        }
        return {
            id: authUser.id,
            email: authUser.email,
            full_name: authUser.profile?.name || 'Customer',
            role: 'customer',
        } as User;
    };

    useEffect(() => {
        let unsubscribe: (() => void) | null = null;

        // Restore session on mount
        const init = async () => {
            try {
                const result = await insforge.auth.getCurrentSession();
                const data = result?.data;
                if (data?.session?.user) {
                    setSession(data.session);
                    const u = await buildUser(data.session.user);
                    setUser(u);
                }
            } catch (err: any) {
                console.log('No active session:', err?.message || err);
            }

            // No active listener in this SDK version, using immediate check
            setLoading(false);
        };

        init();

        return () => { };
    }, []);

    const login = async (email: string, password: string) => {
        const { data, error } = await insforge.auth.signInWithPassword({ email, password });
        if (error) throw error;

        if (data?.user) {
            setSession(data);
            const u = await buildUser(data.user);
            setUser(u);
        }

        return data;
    };

    const register = async (userData: any) => {
        const { data, error } = await insforge.auth.signUp({
            email: userData.email,
            password: userData.password,
            name: userData.full_name,
        });
        if (error) throw error;

        if (data?.requireEmailVerification) {
            return { requireEmailVerification: true, email: userData.email, userData };
        }

        if (data?.user) {
            try {
                await insforge.database.from('users').insert([{
                    id: data.user.id,
                    full_name: userData.full_name,
                    email: userData.email,
                    phone: userData.phone || null,
                    role: 'customer',
                }]);
            } catch (e) {
                console.error('Failed to insert user profile:', e);
            }
        }

        return data;
    };

    const verifyEmailCode = async (email: string, otp: string, userData: any) => {
        const { data, error } = await insforge.auth.verifyEmail({ email, otp });
        if (error) throw error;

        if (data?.user) {
            try {
                await insforge.database.from('users').insert([{
                    id: data.user.id,
                    full_name: userData?.full_name || data.user.profile?.name || '',
                    email: data.user.email,
                    phone: userData?.phone || null,
                    role: 'customer',
                }]);
            } catch (e) {
                console.error('Failed to insert user profile:', e);
            }
        }
    };

    const resendVerification = async (email: string) => {
        const { error } = await insforge.auth.resendVerificationEmail({ email });
        if (error) throw error;
    };

    const logout = async () => {
        await insforge.auth.signOut();
        setSession(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            session,
            loading,
            login,
            register,
            logout,
            verifyEmail: verifyEmailCode,
            resendVerification
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
