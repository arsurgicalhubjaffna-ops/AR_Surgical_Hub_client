import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist: React.FC = () => {
    const { wishlist } = useWishlist();

    if (wishlist.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-5">
                <div className="w-24 h-24 rounded-full bg-brand-green-light flex items-center justify-center text-brand-green mb-6 animate-pulse">
                    <Heart size={48} />
                </div>
                <h2 className="text-2xl md:text-3xl font-800 tracking-tighter text-brand-text mb-3">Your wishlist is empty</h2>
                <p className="text-secondary mb-8 max-w-md">Save items you're interested in for later evaluation. Start exploring our high-precision surgical catalog.</p>
                <Link to="/shop" className="inline-flex items-center gap-2 bg-brand-green text-white px-8 py-3.5 rounded-xl font-700 no-underline transition-all hover:bg-brand-green-dark hover:-translate-y-0.5 shadow-lg shadow-brand-green/20">
                    Explore Products
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-bg pb-20">
            {/* Header */}
            <div className="bg-white border-b border-black/8 py-10 md:py-14 mb-10">
                <div className="max-w-[1400px] mx-auto px-5 md:px-10">
                    <h1 className="text-3xl md:text-4xl font-800 tracking-tighter text-brand-text">
                        Your <span className="text-brand-green">Wishlist</span>
                    </h1>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-5 md:px-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {wishlist.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="mt-12 flex justify-center">
                    <Link to="/shop" className="inline-flex items-center gap-2 text-brand-green font-700 hover:gap-3 transition-all no-underline">
                        Continue Shopping <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
