import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, ChevronRight, Clock, AlertCircle, ShoppingBag } from 'lucide-react';
import insforge from '../lib/insforge';
import { Order } from '../types';
import { useAuth } from '../context/AuthContext';

const MyOrders: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            try {
                const { data, error } = await insforge.database
                    .from('orders')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setOrders(data || []);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
            case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'processing': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="bg-brand-bg min-h-screen pt-28 pb-20">
                <div className="max-w-[1000px] mx-auto px-5">
                    <div className="h-10 w-48 bg-gray-200 animate-pulse rounded mb-8"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-2xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-brand-bg min-h-screen pt-28 pb-20">
            <div className="max-w-[1000px] mx-auto px-5">
                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-900 tracking-tighter text-brand-text mb-2">My Orders</h1>
                        <p className="text-secondary font-500">Track and manage your previous surgical equipment purchases.</p>
                    </div>
                </header>

                {orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div
                                key={order.id}
                                className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                                onClick={() => navigate(`/order/${order.id}`)}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-brand-bg rounded-xl flex items-center justify-center text-brand-green border border-black/5">
                                            <Package size={24} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-800 text-brand-text uppercase tracking-tight">Order #{order.id.slice(0, 8)}</span>
                                                <span className={`px-2.5 py-0.75 rounded-full text-[0.65rem] font-800 uppercase tracking-wider border ${getStatusStyle(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs font-600 text-gray-400">
                                                <span className="flex items-center gap-1"><Clock size={14} /> {new Date(order.created_at).toLocaleDateString()}</span>
                                                <span>{order.total_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-4 md:pt-0">
                                        <div className="flex flex-col items-end hidden md:flex">
                                            <span className="text-[0.65rem] font-700 text-gray-400 uppercase tracking-widest mb-1">Payment Status</span>
                                            <span className={`text-xs font-800 uppercase ${order.payment_status === 'paid' ? 'text-brand-green' : 'text-yellow-600'}`}>
                                                {order.payment_status}
                                            </span>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-brand-bg flex items-center justify-center text-brand-text group-hover:bg-brand-green group-hover:text-white transition-colors">
                                            <ChevronRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[32px] border border-black/5 p-16 text-center shadow-sm">
                        <div className="w-20 h-20 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <ShoppingBag size={40} />
                        </div>
                        <h2 className="text-2xl font-900 tracking-tight text-brand-text mb-2">No orders yet</h2>
                        <p className="text-secondary max-w-md mx-auto mb-8">
                            Looks like you haven't placed any orders yet. Explore our premium surgical instruments to get started.
                        </p>
                        <Link to="/shop" className="inline-flex items-center gap-2 bg-brand-green text-white px-8 py-3.5 rounded-xl font-800 transition-all hover:bg-brand-green-dark shadow-lg shadow-brand-green/20">
                            Start Shopping
                        </Link>
                    </div>
                )}

                <div className="mt-12 p-6 bg-brand-green/5 border border-brand-green/10 rounded-2xl flex items-start gap-4">
                    <AlertCircle className="text-brand-green shrink-0" size={20} />
                    <p className="text-sm font-500 text-brand-text/80 leading-relaxed">
                        Need assistance with an existing order? Feel free to contact our medical support specialists available 24/7 for critical instrument inquiries.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MyOrders;
