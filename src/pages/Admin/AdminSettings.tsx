import React, { useState } from 'react';
import { Save, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

const AdminSettings: React.FC = () => {
    const { rawSettings, loading, error, updateSetting, refreshSettings } = useSettings();
    const [saving, setSaving] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [editValues, setEditValues] = useState<Record<string, string>>({});

    const handleSave = async (id: string, key: string) => {
        const newValue = editValues[id];
        if (newValue === undefined) return;

        setSaving(id);
        setMessage(null);
        
        const result = await updateSetting(id, newValue);
        
        if (result.success) {
            setMessage({ type: 'success', text: `Setting "${key}" updated successfully!` });
            setEditValues(prev => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
        } else {
            setMessage({ type: 'error', text: `Failed to update "${key}". Please try again.` });
        }
        
        setSaving(null);
        setTimeout(() => setMessage(null), 3000);
    };

    const handleChange = (id: string, value: string) => {
        setEditValues(prev => ({ ...prev, [id]: value }));
    };

    if (loading && rawSettings.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <RefreshCw size={40} className="text-brand-green animate-spin mb-4" />
                <p className="text-gray-500 font-500">Loading site settings...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-brand-red/5 border border-brand-red/20 rounded-2xl p-8 text-center">
                <AlertCircle size={48} className="text-brand-red mx-auto mb-4" />
                <h3 className="text-lg font-800 text-brand-text mb-2">Error Loading Settings</h3>
                <p className="text-gray-600 mb-6">{error.message || 'Something went wrong.'}</p>
                <button 
                    onClick={() => refreshSettings()}
                    className="bg-brand-green text-white px-6 py-2.5 rounded-xl font-700 hover:bg-brand-green-dark transition-all"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // Group settings
    const groups = rawSettings.reduce((acc, setting) => {
        if (!acc[setting.settings_group]) {
            acc[setting.settings_group] = [];
        }
        acc[setting.settings_group].push(setting);
        return acc;
    }, {} as Record<string, typeof rawSettings>);

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-800 tracking-tighter text-brand-text">Site Content Manager</h2>
                    <p className="text-gray-500 font-500">Update global headings, contact information, and specific site messages.</p>
                </div>
                <button 
                    onClick={() => refreshSettings()}
                    className="flex items-center gap-2 bg-white border border-black/5 px-4 py-2.5 rounded-xl font-700 text-brand-text hover:bg-brand-bg transition-all shadow-sm"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {message && (
                <div className={`flex items-center gap-3 p-4 rounded-xl border animate-in fade-in slide-in-from-top-4 duration-300 ${message.type === 'success' ? 'bg-brand-green/5 border-brand-green/20 text-brand-green' : 'bg-brand-red/5 border-brand-red/20 text-brand-red'}`}>
                    {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span className="font-600">{message.text}</span>
                </div>
            )}

            <div className="grid grid-cols-1 gap-8">
                {Object.entries(groups).map(([groupName, settings]) => (
                    <div key={groupName} className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm">
                        <div className="bg-brand-bg/50 px-8 py-4 border-b border-black/5">
                            <h3 className="text-sm font-800 uppercase tracking-widest text-gray-500">{groupName}</h3>
                        </div>
                        <div className="divide-y divide-black/5">
                            {settings.map((setting) => (
                                <div key={setting.id} className="p-8 group">
                                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                                        <div className="lg:w-1/3">
                                            <label className="block text-sm font-800 text-brand-text mb-1.5 capitalize">
                                                {setting.key.replace(/_/g, ' ')}
                                            </label>
                                            <p className="text-sm text-gray-400 font-500 leading-relaxed italic">
                                                {setting.description || 'No description provided.'}
                                            </p>
                                        </div>
                                        <div className="flex-1 flex flex-col gap-4">
                                            {setting.field_type === 'textarea' ? (
                                                <textarea
                                                    className="w-full bg-brand-bg border-none rounded-xl p-4 text-brand-text font-500 text-sm min-h-[100px] focus:ring-2 focus:ring-brand-green/20 transition-all resize-none"
                                                    value={editValues[setting.id] ?? setting.value}
                                                    onChange={(e) => handleChange(setting.id, e.target.value)}
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    className="w-full bg-brand-bg border-none rounded-xl px-4 py-3 text-brand-text font-500 text-sm focus:ring-2 focus:ring-brand-green/20 transition-all"
                                                    value={editValues[setting.id] ?? setting.value}
                                                    onChange={(e) => handleChange(setting.id, e.target.value)}
                                                />
                                            )}
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => handleSave(setting.id, setting.key)}
                                                    disabled={saving === setting.id || editValues[setting.id] === undefined || editValues[setting.id] === setting.value}
                                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-700 text-sm transition-all ${editValues[setting.id] !== undefined && editValues[setting.id] !== setting.value ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20 hover:bg-brand-green-dark' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                                >
                                                    {saving === setting.id ? (
                                                        <RefreshCw size={16} className="animate-spin" />
                                                    ) : (
                                                        <Save size={16} />
                                                    )}
                                                    Save Changes
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminSettings;
