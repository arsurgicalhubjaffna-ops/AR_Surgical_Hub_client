import React, { useState, useEffect } from 'react';
import insforge from '../../lib/insforge';
import { ClipboardList, ChevronDown, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            const { data, error } = await insforge.database
                .from('orders')
                .select('*, users(full_name, email)')
                .order('created_at', { ascending: false });
            if (error) throw error;
            const mapped = (data || []).map(o => ({
                ...o,
                full_name: o.users?.full_name || null,
                email: o.users?.email || null,
            }));
            setOrders(mapped);
        } catch (err) {
            console.error('Order Load Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            const { error } = await insforge.database
                .from('orders')
                .update({ status })
                .eq('id', id);
            if (error) throw error;
            load();
        } catch (err) {
            alert('Failed to update order status');
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-brand-green/10 text-brand-green border-brand-green/20';
            case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'cancelled': return 'bg-brand-red/10 text-brand-red border-brand-red/20';
            case 'shipped': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'processing': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            default: return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    };

    if (loading) return <div className="text-secondary italic animate-pulse">Retrieving order ledger...</div>;

    return (
        <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
            <div className="px-8 py-8 border-b border-black/5 flex items-center justify-between bg-brand-bg/10">
                <div>
                    <h2 className="text-xl font-800 tracking-tight text-brand-text">Order Management</h2>
                    <p className="text-sm text-gray-400 font-500">Monitor and process customer procurement requests</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-black/5 shadow-sm">
                    <ClipboardList size={18} className="text-brand-green" />
                    <span className="text-sm font-800 text-brand-text">{orders.length} Total</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-brand-bg/50 border-b border-black/5">
                            <th className="px-6 py-4 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Tracking ID</th>
                            <th className="px-6 py-4 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Practitioner / Facility</th>
                            <th className="px-6 py-4 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Procurement Total</th>
                            <th className="px-6 py-4 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Payment</th>
                            <th className="px-6 py-4 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Flow Status</th>
                            <th className="px-6 py-4 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                        {orders.map(o => (
                            <tr key={o.id} className="hover:bg-brand-bg/30 transition-colors">
                                <td className="px-6 py-5 font-mono text-[0.75rem] text-gray-500">#{o.id.slice(0, 12)}</td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="font-700 text-brand-text text-sm">{o.full_name || 'Anonymous Practitioner'}</span>
                                        <span className="text-[0.7rem] text-gray-400">{o.email || 'no-email@arsurgical.com'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 font-800 text-brand-text text-sm font-header">${Number(o.total_amount).toFixed(2)}</td>
                                <td className="px-6 py-5">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[0.65rem] font-800 uppercase tracking-widest border ${o.payment_status === 'paid' ? 'bg-brand-green/10 text-brand-green border-brand-green/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                        {o.payment_status}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="relative inline-block">
                                        <select
                                            className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-[0.7rem] font-800 uppercase tracking-widest border transition-all cursor-pointer outline-none focus:ring-2 focus:ring-brand-green/20 ${getStatusStyles(o.status)}`}
                                            value={o.status}
                                            onChange={e => updateStatus(o.id, e.target.value)}
                                        >
                                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-gray-400 text-sm font-500">{new Date(o.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {orders.length === 0 && (
                <div className="p-20 text-center text-gray-400 italic">No procurement records found in the ledger.</div>
            )}
        </div>
    );
};

export default AdminOrders;
