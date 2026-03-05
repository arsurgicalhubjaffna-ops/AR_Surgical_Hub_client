import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard, ChevronRight, CheckCircle2, Clock, Truck, ShieldCheck } from 'lucide-react';
import insforge from '../lib/insforge';
import { Order, OrderItem } from '../types';
import ProductImage from '../components/ProductImage';

const OrderDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [items, setItems] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!id) return;
            try {
                // Fetch order
                const { data: orderData, error: orderError } = await insforge.database
                    .from('orders')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (orderError) throw orderError;
                setOrder(orderData);

                // Fetch items
                const { data: itemsData, error: itemsError } = await insforge.database
                    .from('order_items')
                    .select('*, products(name, image_url)')
                    .eq('order_id', id);

                if (itemsError) throw itemsError;
                setItems(itemsData || []);
            } catch (error) {
                console.error('Error fetching order details:', error);
                navigate('/my-orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [id, navigate]);

    const getStatusStep = (status: string) => {
        const steps = ['pending', 'processing', 'shipped', 'delivered'];
        return steps.indexOf(status);
    };

    if (loading) return (
        <div className="bg-brand-bg min-h-screen pt-28 pb-20">
            <div className="max-w-[800px] mx-auto px-5 animate-pulse">
                <div className="h-6 w-32 bg-gray-200 rounded mb-8"></div>
                <div className="h-40 bg-gray-200 rounded-3xl mb-8"></div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl"></div>)}
                </div>
            </div>
        </div>
    );

    if (!order) return null;

    return (
        <div className="bg-brand-bg min-h-screen pt-28 pb-20">
            <div className="max-w-[900px] mx-auto px-5">
                <Link to="/my-orders" className="inline-flex items-center gap-2 text-sm font-700 text-gray-500 hover:text-brand-green transition-colors mb-8">
                    <ArrowLeft size={16} /> Back to My Orders
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-brand-green/10 text-brand-green px-3 py-1 rounded-lg text-xs font-800 uppercase tracking-widest border border-brand-green/20">
                                {order.status}
                            </span>
                            <span className="text-xs font-700 text-gray-400 uppercase tracking-widest pl-3 border-l border-black/10">
                                Order #{order.id.slice(0, 8)}
                            </span>
                        </div>
                        <h1 className="text-3xl font-900 tracking-tighter text-brand-text">Order Details</h1>
                    </div>
                    <div className="text-left md:text-right">
                        <span className="block text-[0.65rem] font-700 text-gray-400 uppercase tracking-widest mb-1">Total Amount</span>
                        <span className="text-2xl font-900 text-brand-green">
                            {order.total_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </span>
                    </div>
                </div>

                {/* Progress Tracking */}
                <div className="bg-white rounded-[32px] border border-black/5 p-8 md:p-10 shadow-sm mb-8 overflow-x-auto">
                    <div className="min-w-[500px] flex justify-between relative">
                        <div className="absolute top-5 left-[30px] right-[30px] h-1 bg-gray-100 z-0">
                            <div
                                className="h-full bg-brand-green transition-all duration-700 ease-out"
                                style={{ width: `${(getStatusStep(order.status) / 3) * 100}%` }}
                            ></div>
                        </div>
                        {[
                            { label: 'Pending', icon: <Clock size={16} /> },
                            { label: 'Processing', icon: <Package size={16} /> },
                            { label: 'Shipped', icon: <Truck size={16} /> },
                            { label: 'Delivered', icon: <CheckCircle2 size={16} /> }
                        ].map((step, idx) => {
                            const active = getStatusStep(order.status) >= idx;
                            return (
                                <div key={idx} className="relative z-10 flex flex-col items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${active ? 'bg-brand-green text-white' : 'bg-white border-2 border-gray-100 text-gray-300'}`}>
                                        {step.icon}
                                    </div>
                                    <span className={`text-[0.7rem] font-800 uppercase tracking-widest ${active ? 'text-brand-text' : 'text-gray-300'}`}>{step.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
                    {/* Items List */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-[24px] border border-black/5 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 bg-brand-bg/50 border-b border-black/5">
                                <h3 className="text-xs font-900 uppercase tracking-widest text-brand-text">Ordered Instruments</h3>
                            </div>
                            <div className="divide-y divide-black/5">
                                {items.map((item) => (
                                    <div key={item.id} className="p-6 flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-black/5">
                                            <ProductImage src={item.products?.image_url} alt={item.products?.name || ''} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-800 text-brand-text mb-1">{item.products?.name}</h4>
                                            <div className="flex items-center gap-4 text-sm text-secondary font-500">
                                                <span>Qty: {item.quantity}</span>
                                                <span className="w-1 h-1 rounded-full bg-black/10"></span>
                                                <span>{item.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} / unit</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-900 text-brand-text">{(item.price * item.quantity).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 bg-brand-bg/30 flex justify-between items-center">
                                <span className="text-sm font-700 text-secondary">Summary Total</span>
                                <span className="text-xl font-900 text-brand-text">{order.total_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping & Payment Info */}
                    <aside className="space-y-8">
                        <div className="bg-white rounded-[24px] border border-black/5 p-6 shadow-sm">
                            <h3 className="text-xs font-900 uppercase tracking-widest text-brand-text mb-6 flex items-center gap-2">
                                <MapPin size={16} className="text-brand-green" /> Delivery Info
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <span className="block text-[0.6rem] font-800 text-gray-400 uppercase tracking-widest mb-1.5">Shipping Address</span>
                                    <p className="text-sm font-600 text-brand-text leading-relaxed">
                                        {order.shipping_address || 'Not specified'}
                                    </p>
                                </div>
                                <div className="pt-4 border-t border-black/5">
                                    <div className="flex items-center gap-2 text-brand-green text-xs font-800 mb-2">
                                        <ShieldCheck size={14} /> Global Logistics Verified
                                    </div>
                                    <p className="text-[0.75rem] text-secondary font-500">
                                        Handling with medical-grade precision and real-time tracking.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[24px] border border-black/5 p-6 shadow-sm">
                            <h3 className="text-xs font-900 uppercase tracking-widest text-brand-text mb-6 flex items-center gap-2">
                                <CreditCard size={16} className="text-brand-green" /> Payment Details
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <span className="block text-[0.6rem] font-800 text-gray-400 uppercase tracking-widest mb-1.5">Method</span>
                                    <span className="text-sm font-700 text-brand-text flex items-center gap-2 capitalize">
                                        {order.payment_method?.replace('_', ' ') || 'Credit Card'}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-[0.6rem] font-800 text-gray-400 uppercase tracking-widest mb-1.5">Status</span>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-800 uppercase tracking-tight ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        <CheckCircle2 size={12} /> {order.payment_status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
