import React, { useState, useEffect } from 'react';
import insforge from '../../lib/insforge';
import { Users, Shield, User as UserIcon, Mail, Phone, Calendar } from 'lucide-react';

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data, error } = await insforge.database
                    .from('users')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (error) throw error;
                setUsers(data || []);
            } catch (err) {
                console.error('User Fetch Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <div className="text-secondary italic animate-pulse">Loading user directory...</div>;

    return (
        <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
            <div className="px-8 py-8 border-b border-black/5 flex items-center justify-between bg-brand-bg/10">
                <div>
                    <h2 className="text-xl font-800 tracking-tight text-brand-text">User Directory</h2>
                    <p className="text-sm text-gray-400 font-500">Manage registered medical practitioners and system staff</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-black/5 shadow-sm">
                    <Users size={18} className="text-brand-green" />
                    <span className="text-sm font-800 text-brand-text">{users.length} Registered</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-brand-bg/50 border-b border-black/5">
                            <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Practitioner</th>
                            <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Contact Info</th>
                            <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">System Role</th>
                            <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Registration Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                        {users.map(u => (
                            <tr key={u.id} className="hover:bg-brand-bg/30 transition-colors">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green border border-brand-green/20 font-800">
                                            {u.full_name?.[0]?.toUpperCase() || <UserIcon size={18} />}
                                        </div>
                                        <span className="font-700 text-brand-text text-sm">{u.full_name || 'Unspecified Name'}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex flex-col gap-0.5">
                                        <div className="flex items-center gap-1.5 text-secondary text-sm">
                                            <Mail size={13} className="text-gray-300" />
                                            {u.email}
                                        </div>
                                        {u.phone && (
                                            <div className="flex items-center gap-1.5 text-gray-400 text-[0.75rem]">
                                                <Phone size={13} className="text-gray-300" />
                                                {u.phone}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.65rem] font-800 uppercase tracking-widest border ${u.role === 'admin' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : 'bg-brand-green/10 text-brand-green border-brand-green/20'}`}>
                                        {u.role === 'admin' && <Shield size={12} />}
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-gray-400 text-sm font-500">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-gray-300" />
                                        {new Date(u.created_at).toLocaleDateString()}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {users.length === 0 && (
                <div className="p-20 text-center text-gray-400 italic">No users registered in the system.</div>
            )}
        </div>
    );
};

export default AdminUsers;
