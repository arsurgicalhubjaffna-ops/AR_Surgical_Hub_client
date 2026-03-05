import React, { useState, useEffect } from 'react';
import insforge from '../../lib/insforge';
import { Plus, Pencil, Trash2, X, Search, GitBranch } from 'lucide-react';
import { Category, Subcategory } from '../../types';

const emptyForm = { name: '', description: '', category_id: '' };

const AdminSubcategories: React.FC = () => {
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editId, setEditId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const load = async () => {
        try {
            const [subRes, catRes] = await Promise.all([
                insforge.database.from('subcategories').select('*, categories(name)').order('name', { ascending: true }),
                insforge.database.from('categories').select('*').order('name', { ascending: true })
            ]);

            const mapped = (subRes.data || []).map((s: any) => ({
                ...s,
                category_name: s.categories?.name || 'Unknown'
            }));

            setSubcategories(mapped);
            setCategories(catRes.data || []);
        } catch (err) {
            console.error('Subcategory Load Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const openAdd = () => { setForm(emptyForm); setEditId(null); setModal(true); };
    const openEdit = (s: any) => {
        setForm({ name: s.name, description: s.description || '', category_id: s.category_id });
        setEditId(s.id);
        setModal(true);
    };

    const save = async () => {
        try {
            const payload = {
                name: form.name,
                description: form.description || null,
                category_id: form.category_id,
            };

            if (editId) {
                const { error } = await insforge.database
                    .from('subcategories')
                    .update(payload)
                    .eq('id', editId);
                if (error) throw error;
            } else {
                const { error } = await insforge.database
                    .from('subcategories')
                    .insert([payload]);
                if (error) throw error;
            }
            setModal(false);
            load();
        } catch (err) {
            alert('Failed to save subcategory');
        }
    };

    const del = async (id: string) => {
        if (!confirm('Delete this sub-class? Associated products will remain but will lose this grouping.')) return;
        try {
            const { error } = await insforge.database.from('subcategories').delete().eq('id', id);
            if (error) throw error;
            load();
        } catch (err) {
            alert('Failed to delete subcategory');
        }
    };

    const filtered = subcategories.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s as any).category_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-secondary italic animate-pulse">Syncing sub-classes...</div>;

    return (
        <div className="flex flex-col gap-6">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative flex-1 max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search sub-classes..."
                        className="w-full bg-white border border-black/5 rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:border-brand-green transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={openAdd}
                    className="inline-flex items-center gap-2 bg-brand-green text-white px-6 py-3 rounded-xl font-800 text-sm transition-all hover:bg-brand-green-dark shadow-lg shadow-brand-green/20"
                >
                    <Plus size={18} /> New Sub-Class
                </button>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-brand-bg/50 border-b border-black/5">
                                <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Icon</th>
                                <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Sub-Class</th>
                                <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Parent Classification</th>
                                <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest">Definition</th>
                                <th className="px-8 py-5 text-[0.7rem] font-800 text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            {filtered.map((s: any) => (
                                <tr key={s.id} className="hover:bg-brand-bg/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="w-10 h-10 bg-brand-bg rounded-lg flex items-center justify-center border border-black/5 text-brand-green shadow-inner">
                                            <GitBranch size={18} />
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="font-800 text-brand-text text-sm hover:text-brand-green transition-colors cursor-default">{s.name}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="inline-block bg-brand-bg px-2.5 py-1 rounded-md text-[0.75rem] font-700 text-gray-500 border border-black/8">
                                            {s.category_name}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-secondary text-sm line-clamp-1 max-w-md">{s.description || 'No definition provided.'}</p>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEdit(s)}
                                                className="p-2 text-gray-400 hover:text-brand-green hover:bg-brand-green/5 rounded-lg transition-all"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => del(s.id)}
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
                {filtered.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <GitBranch size={32} />
                        </div>
                        <p className="text-secondary font-600">No sub-classes found in the system registry.</p>
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
                                {editId ? 'Refine Sub-Class' : 'New Sub-Class'}
                            </h2>
                            <button onClick={() => setModal(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors text-gray-400">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 flex flex-col gap-6">
                            <div>
                                <label className="block text-xs font-800 text-gray-400 uppercase tracking-widest mb-2">Parent Classification</label>
                                <select
                                    className="w-full bg-brand-bg border border-black/5 rounded-xl px-4 py-3 outline-none focus:border-brand-green font-700 text-brand-text appearance-none cursor-pointer"
                                    value={form.category_id}
                                    onChange={e => setForm({ ...form, category_id: e.target.value })}
                                >
                                    <option value="" disabled>Select Parent Category</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-800 text-gray-400 uppercase tracking-widest mb-2">Sub-Class Label</label>
                                <input
                                    type="text"
                                    className="w-full bg-brand-bg border border-black/5 rounded-xl px-4 py-3 outline-none focus:border-brand-green font-700 text-brand-text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder="e.g. Scalpels"
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
                                disabled={!form.name || !form.category_id}
                                className="bg-brand-green text-white px-8 py-3 rounded-xl font-800 transition-all hover:bg-brand-green-dark shadow-lg shadow-brand-green/20 disabled:opacity-50"
                            >
                                {editId ? 'Apply Refinements' : 'Register Sub-Class'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSubcategories;
