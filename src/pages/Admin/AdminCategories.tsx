import React, { useState, useEffect } from 'react';
import insforge from '../../lib/insforge';
import { Plus, Pencil, Trash2, X, Image as ImageIcon, Search } from 'lucide-react';
import { Category } from '../../types';

const emptyForm = { name: '', description: '', image_url: '' };

const AdminCategories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editId, setEditId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const load = async () => {
        try {
            const { data, error } = await insforge.database
                .from('categories')
                .select('*')
                .order('name', { ascending: true });
            if (error) throw error;
            setCategories(data || []);
        } catch (err) {
            console.error('Category Load Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const openAdd = () => { setForm(emptyForm); setEditId(null); setModal(true); };
    const openEdit = (c: Category) => {
        setForm({ name: c.name, description: c.description || '', image_url: c.image_url || '' });
        setEditId(c.id);
        setModal(true);
    };

    const save = async () => {
        try {
            const payload = {
                name: form.name,
                description: form.description || null,
                image_url: form.image_url || null,
            };

            if (editId) {
                const { error } = await insforge.database
                    .from('categories')
                    .update(payload)
                    .eq('id', editId);
                if (error) throw error;
            } else {
                const { error } = await insforge.database
                    .from('categories')
                    .insert([payload]);
                if (error) throw error;
            }
            setModal(false);
            load();
        } catch (err) {
            alert('Failed to save category');
        }
    };

    const del = async (id: string) => {
        if (!confirm('Delete this classification? Associated products will remain but will lose this grouping.')) return;
        try {
            const { error } = await insforge.database.from('categories').delete().eq('id', id);
            if (error) throw error;
            load();
        } catch (err) {
            alert('Failed to delete category');
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-secondary italic animate-pulse">Syncing classifications...</div>;

    return (
        <div className="flex flex-col gap-6">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative flex-1 max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search classifications..."
                        className="w-full bg-white border border-black/5 rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:border-brand-green transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={openAdd}
                    className="inline-flex items-center gap-2 bg-brand-green text-white px-6 py-3 rounded-xl font-800 text-sm transition-all hover:bg-brand-green-dark shadow-lg shadow-brand-green/20"
                >
                    <Plus size={18} /> New Category
                </button>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-brand-bg/50 border-b border-black/5">
                                <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Icon</th>
                                <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Classification</th>
                                <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Definition</th>
                                <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            {filteredCategories.map(c => (
                                <tr key={c.id} className="hover:bg-brand-bg/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="w-10 h-10 bg-brand-bg rounded-lg flex items-center justify-center border border-black/5 text-brand-green shadow-inner overflow-hidden">
                                            {c.image_url ? <img src={c.image_url} className="w-full h-full object-contain p-1" /> : <ImageIcon size={18} />}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="font-800 text-brand-text text-sm hover:text-brand-green transition-colors cursor-default">{c.name}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-secondary text-sm line-clamp-1 max-w-md">{c.description || 'No definition provided.'}</p>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEdit(c)}
                                                className="p-2 text-gray-400 hover:text-brand-green hover:bg-brand-green/5 rounded-lg transition-all"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => del(c.id)}
                                                className="p-2 text-gray-400 hover:text-brand-red hover:bg-brand-red/5 rounded-lg transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredCategories.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <ImageIcon size={32} />
                        </div>
                        <p className="text-secondary font-600">No categories found in the system registry.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {modal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
                    <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-sm" onClick={() => setModal(false)}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="px-8 py-6 border-b border-black/5 flex justify-between items-center bg-brand-bg/50">
                            <h2 className="text-xl font-900 tracking-tighter text-brand-text">
                                {editId ? 'Refine Category' : 'New Classification'}
                            </h2>
                            <button onClick={() => setModal(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors text-gray-400">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 flex flex-col gap-6">
                            <div>
                                <label className="block text-xs font-800 text-gray-400 uppercase tracking-widest mb-2">Category Label</label>
                                <input
                                    type="text"
                                    className="w-full bg-brand-bg border border-black/5 rounded-xl px-4 py-3 outline-none focus:border-brand-green font-700 text-brand-text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder="e.g. Diagnostic Instruments"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-800 text-gray-400 uppercase tracking-widest mb-2">System Definition</label>
                                <textarea
                                    className="w-full bg-brand-bg border border-black/5 rounded-xl px-4 py-3 outline-none focus:border-brand-green font-500 text-brand-text min-h-[100px] resize-none"
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    placeholder="Describe the therapeutic or procedural scope..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-800 text-gray-400 uppercase tracking-widest mb-2">Icon Asset URL</label>
                                <div className="flex gap-4 items-center">
                                    <input
                                        type="text"
                                        className="flex-1 bg-brand-bg border border-black/5 rounded-xl px-4 py-3 outline-none focus:border-brand-green font-500 text-[0.85rem] text-secondary"
                                        placeholder="https://icons.arsurgical.com/..."
                                        value={form.image_url}
                                        onChange={e => setForm({ ...form, image_url: e.target.value })}
                                    />
                                    <div className="w-12 h-12 rounded-xl bg-brand-bg flex items-center justify-center border border-black/5 shrink-0 overflow-hidden">
                                        {form.image_url ? <img src={form.image_url} className="w-full h-full object-contain p-2" /> : <ImageIcon size={20} className="text-gray-300" />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-6 bg-brand-bg/30 border-t border-black/5 flex justify-end gap-3">
                            <button
                                onClick={() => setModal(false)}
                                className="px-6 py-3 rounded-xl font-700 text-gray-400 hover:text-brand-text transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={save}
                                disabled={!form.name}
                                className="bg-brand-green text-white px-8 py-3 rounded-xl font-800 transition-all hover:bg-brand-green-dark shadow-lg shadow-brand-green/20 disabled:opacity-50"
                            >
                                {editId ? 'Apply Refinements' : 'Register Category'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
