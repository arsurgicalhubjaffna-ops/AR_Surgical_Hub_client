import React, { useState, useEffect } from 'react';
import insforge from '../lib/insforge';
import { Link } from 'react-router-dom';
import { Category } from '../types';

const Categories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data, error } = await insforge.database
                    .from('categories')
                    .select('*')
                    .order('name', { ascending: true });
                if (error) throw error;
                setCategories(data || []);
            } catch (err) {
                console.error('Error fetching categories:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="min-h-screen bg-brand-bg pb-20">
            {/* Header Area */}
            <div className="bg-white border-b border-black/8 py-12 md:py-16 mb-12">
                <div className="max-w-[1400px] mx-auto px-5 md:px-10 text-center">
                    <h1 className="text-3xl md:text-5xl font-800 tracking-tighter text-brand-text mb-3">
                        Instrument <span className="text-brand-green">Categories</span>
                    </h1>
                    <p className="text-secondary text-base md:text-lg max-w-2xl mx-auto">
                        Explore our specialized range of precision surgical equipment organized by medical specialty.
                    </p>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-5 md:px-10">
                {loading ? (
                    <div className="text-center py-20 text-gray-400 italic">Loading categories...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {categories.map((cat) => (
                            <Link
                                to={`/shop?category=${cat.id}`}
                                key={cat.id}
                                className="bg-white/70 backdrop-blur-md border border-black/8 p-8 md:p-10 rounded-[32px] flex flex-col items-center text-center gap-6 no-underline transition-all duration-500 hover:-translate-y-2 hover:border-brand-green hover:shadow-2xl group overflow-hidden"
                            >
                                <div className="w-24 h-24 rounded-[24px] bg-brand-bg flex items-center justify-center border border-black/5 overflow-hidden shadow-inner group-hover:scale-110 transition-transform duration-500 p-4">
                                    {cat.image_url ? (
                                        <img src={cat.image_url} alt={cat.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="text-brand-green/20 font-900 text-4xl select-none">{cat.name.charAt(0)}</div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-3">
                                    <h3 className="text-brand-text text-xl md:text-2xl font-800 tracking-tight transition-colors group-hover:text-brand-green">
                                        {cat.name}
                                    </h3>
                                    <p className="text-secondary text-sm md:text-base leading-relaxed line-clamp-2">
                                        {cat.description || 'Quality surgical instruments designed for precision and reliability.'}
                                    </p>
                                </div>
                                <span className="text-brand-green font-700 text-sm md:text-[0.9rem] flex items-center justify-center gap-2 group-hover:gap-3 transition-all">
                                    Browse Specialized Collection <span>→</span>
                                </span>
                            </Link>
                        ))}
                    </div>
                )}

                {!loading && categories.length === 0 && (
                    <div className="text-center py-24 bg-white border border-black/8 rounded-3xl px-6">
                        <h3 className="text-lg font-700 text-brand-text mb-2">No categories found</h3>
                        <p className="text-secondary">Please check back later as we update our catalog.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Categories;
