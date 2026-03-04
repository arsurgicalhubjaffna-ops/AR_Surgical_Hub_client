import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        } else if (!loading && user && user.role !== 'admin') {
            navigate('/');
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-bg">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin"></div>
                    <span className="text-secondary font-700 tracking-tight">Authorizing Admin...</span>
                </div>
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        return null;
    }

    return <>{children}</>;
};

export default AdminRoute;
