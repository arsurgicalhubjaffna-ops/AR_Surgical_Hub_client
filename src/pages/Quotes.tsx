import React, { useState } from 'react';
import { Send, FileText, ClipboardList, ArrowRight } from 'lucide-react';
import insforge from '../lib/insforge';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../hooks/useSettings';

const Quotes: React.FC = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const { getSetting } = useSettings();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await insforge.database.from('quotes').insert([{
                message: formData.message,
                user_id: user ? user.id : null,
                status: 'new',
            }]);
            if (error) throw error;
            alert('Quote request sent successfully!');
            setFormData({ message: '' });
        } catch (err) {
            console.error('Quote error:', err);
            alert('Failed to send quote request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg pb-20">
            {/* Header */}
            <div className="bg-white border-b border-black/8 py-12 md:py-16 mb-12">
                <div className="max-w-[1400px] mx-auto px-5 md:px-10 text-center">
                    <h1 className="text-3xl md:text-5xl font-800 tracking-tighter text-brand-text mb-3">
                        {getSetting('quotes_hero_title', 'Get a Quote')}
                    </h1>
                    <p className="text-secondary text-base md:text-lg max-w-2xl mx-auto">
                        {getSetting('quotes_hero_description', 'Expert medical procurement solutions tailored to your institution\'s specific surgical instrument needs.')}
                    </p>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-5 md:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 items-start">

                    {/* Info Cards */}
                    <div className="flex flex-col gap-6 order-2 lg:order-1">
                        <div className="bg-white border border-black/8 p-8 md:p-10 rounded-[28px] text-center shadow-sm transition-all hover:shadow-md group">
                            <ClipboardList className="w-12 h-12 text-brand-green mx-auto mb-6 transition-transform group-hover:scale-110" />
                            <h3 className="text-xl font-800 text-brand-text mb-3">{getSetting('quotes_bulk_title', 'Bulk Orders')}</h3>
                            <p className="text-secondary text-sm md:text-base leading-relaxed">
                                {getSetting('quotes_bulk_description', 'Special institution-level pricing available for hospitals, clinics, and medical centers ordering in professional quantities.')}
                            </p>
                        </div>
                        <div className="bg-white border border-black/8 p-8 md:p-10 rounded-[28px] text-center shadow-sm transition-all hover:shadow-md group">
                            <FileText className="w-12 h-12 text-brand-green mx-auto mb-6 transition-transform group-hover:scale-110" />
                            <h3 className="text-xl font-800 text-brand-text mb-3">{getSetting('quotes_custom_title', 'Custom Packages')}</h3>
                            <p className="text-secondary text-sm md:text-base leading-relaxed">
                                {getSetting('quotes_custom_description', 'Our engineering team can curate specialized surgical kits based on your procedural workflows and precision requirements.')}
                            </p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <form className="bg-white border border-black/8 p-8 md:p-12 rounded-[32px] shadow-sm order-1 lg:order-2" onSubmit={handleSubmit}>
                        <h3 className="text-2xl font-800 tracking-tight text-brand-green mb-8">Enquiry Details</h3>
                        <div className="mb-8">
                            <textarea
                                className="w-full bg-brand-bg border border-black/8 rounded-2xl p-6 text-brand-text text-sm md:text-base outline-none focus:border-brand-green transition-all resize-none min-h-[220px]"
                                placeholder="Tell us about your requirements (items, quantities, specific medical models, or custom kit needs)..."
                                required
                                value={formData.message}
                                onChange={(e) => setFormData({ message: e.target.value })}
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 bg-brand-green text-white w-full py-4.5 rounded-xl font-800 no-underline transition-all duration-200 hover:bg-brand-green-dark hover:-translate-y-0.5 shadow-lg shadow-brand-green/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Submitting...' : (<>Submit Quote Request <Send size={18} /></>)}
                        </button>

                        <div className="mt-8 pt-8 border-t border-black/8 text-center">
                            <p className="text-[0.8rem] text-gray-400 font-500">
                                Our procurement experts typically respond within 24 business hours.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Quotes;
