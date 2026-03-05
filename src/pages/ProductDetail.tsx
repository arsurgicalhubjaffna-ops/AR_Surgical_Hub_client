import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import insforge from '../lib/insforge';
import { ShoppingCart, Heart, Shield, CheckCircle, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Product, Review } from '../types';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [product, setProduct] = useState<(Product & { category_name?: string | null }) | null>(null);
    const [reviews, setReviews] = useState<(Review & { full_name?: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState<string | null>(null);
    const [newReviewRating, setNewReviewRating] = useState(5);
    const [newReviewComment, setNewReviewComment] = useState('');
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const fetchDetails = async () => {
        if (!id) return;
        try {
            const [productRes, reviewsRes] = await Promise.all([
                insforge.database.from('products').select('*, categories(name)').eq('id', id).single(),
                insforge.database.from('product_reviews').select('*, users(full_name)').eq('product_id', id).order('created_at', { ascending: false })
            ]);

            if (productRes.data) {
                setProduct({
                    ...productRes.data,
                    category_name: productRes.data.categories?.name || null,
                } as any);
            }

            // Map review data for compatibility
            const mappedReviews = (reviewsRes.data || []).map((r: any) => ({
                ...r,
                full_name: r.users?.full_name || 'Anonymous',
            })) as (Review & { full_name?: string })[];
            setReviews(mappedReviews);
        } catch (err) {
            console.error('Error fetching product details:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to leave a review.');
            return;
        }
        if (!id) return;

        setReviewLoading(true);
        try {
            const { error } = await insforge.database.from('product_reviews').insert([{
                product_id: id,
                user_id: user.id,
                rating: newReviewRating,
                comment: newReviewComment
            }]);
            if (error) throw error;
            setNewReviewComment('');
            setNewReviewRating(5);
            fetchDetails(); // Refresh reviews
        } catch (err) {
            setReviewError('Failed to submit review.');
        } finally {
            setReviewLoading(false);
        }
    };

    if (loading) return <div className="min-h-[50vh] flex items-center justify-center text-secondary italic">Loading details...</div>;
    if (!product) return <div className="min-h-[50vh] flex items-center justify-center text-brand-red font-700">Product not found.</div>;

    const inWishlist = isInWishlist(product.id);

    return (
        <div className="min-h-screen bg-brand-bg pb-20">
            <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Image Section */}
                    <div className="bg-white/70 backdrop-blur-md border border-black/8 p-10 md:p-14 rounded-[32px] overflow-hidden shadow-sm">
                        <img
                            src={product.image_url || 'https://via.placeholder.com/600x400'}
                            alt={product.name}
                            className="w-full rounded-2xl shadow-3xl transition-transform duration-500 hover:scale-105"
                        />
                    </div>

                    {/* Info Section */}
                    <div className="text-center lg:text-left">
                        <span className="inline-block bg-brand-green/12 text-brand-green border border-brand-green/25 rounded-full px-3.5 py-1 text-[0.74rem] font-700 uppercase tracking-widest mb-4">
                            {product.category_name || 'Precision Grade'}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-800 tracking-tighter text-brand-text mb-4">
                            {product.name}
                        </h1>
                        <p className="text-2xl md:text-3xl font-800 text-brand-green tracking-tight font-header mb-6">
                            Rs. {typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price).toFixed(2)}
                        </p>
                        <p className="text-secondary text-base md:text-[1.1rem] leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
                            {product.description}
                        </p>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-10">
                            <div className="flex items-center gap-2 text-secondary text-[0.9rem] font-500">
                                <Shield size={18} className="text-brand-green" /> 2 Year Warranty
                            </div>
                            <div className="flex items-center gap-2 text-secondary text-[0.9rem] font-500">
                                <CheckCircle size={18} className="text-brand-green" /> FDA Approved
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
                            <button
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-brand-green text-white px-8 py-4 rounded-xl font-700 no-underline transition-all duration-200 hover:bg-brand-green-dark hover:-translate-y-0.5 shadow-lg shadow-brand-green/20"
                                onClick={() => addToCart(product)}
                            >
                                <ShoppingCart size={20} /> Add to Cart
                            </button>
                            <button
                                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-700 transition-all duration-200 border-1.5 ${inWishlist ? 'bg-brand-green-light border-brand-green text-brand-green' : 'bg-white border-brand-green/25 text-brand-green hover:bg-brand-green-light'}`}
                                onClick={() => toggleWishlist(product)}
                            >
                                <Heart size={20} fill={inWishlist ? "currentColor" : "none"} />
                                {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                            </button>
                        </div>

                        <div className="text-sm text-gray-400 font-500">
                            Availability: <strong className="text-brand-text">{product.stock} units</strong> in stock
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-20 md:mt-32 pt-16 border-t border-black/8">
                    <h2 className="text-2xl md:text-3xl font-800 tracking-tighter mb-10 text-center lg:text-left">
                        Customer <span className="text-brand-green">Reviews</span>
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
                        {/* Reviews List */}
                        <div className="flex flex-col gap-5">
                            {reviews.length > 0 ? (
                                reviews.map(review => (
                                    <div key={review.id} className="bg-white/60 backdrop-blur-sm border border-black/8 p-6 md:p-8 rounded-2xl shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <strong className="text-brand-text font-700">{review.full_name}</strong>
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={14} className={i < (review.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-secondary text-[0.95rem] leading-relaxed mb-4">{review.comment}</p>
                                        <time className="text-gray-400 text-[0.8rem] font-500">{new Date(review.created_at).toLocaleDateString()}</time>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white/40 border border-dashed border-black/15 rounded-2xl text-gray-400 italic">
                                    No reviews yet. Be the first to review!
                                </div>
                            )}
                        </div>

                        {/* Add Review Form */}
                        <div className="bg-white border border-black/8 p-8 rounded-3xl shadow-sm sticky top-24">
                            <h3 className="text-xl font-800 tracking-tight mb-6">Write a Review</h3>
                            {user ? (
                                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-6">
                                    <div>
                                        <label className="block text-sm font-700 text-brand-text mb-2.5">Your Rating</label>
                                        <div className="flex gap-2 text-2xl">
                                            {[1, 2, 3, 4, 5].map(num => (
                                                <button
                                                    key={num}
                                                    type="button"
                                                    className={`transition-transform duration-200 hover:scale-125 ${num <= newReviewRating ? 'text-amber-400' : 'text-gray-300'}`}
                                                    onClick={() => setNewReviewRating(num)}
                                                >
                                                    <Star size={32} className={num <= newReviewRating ? 'fill-current' : ''} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-700 text-brand-text mb-2.5">Review Comment</label>
                                        <textarea
                                            className="w-full bg-brand-bg border border-black/8 rounded-xl p-4 text-brand-text text-sm md:text-base outline-none focus:border-brand-green transition-colors resize-none"
                                            placeholder="Share your experience with this instrument..."
                                            value={newReviewComment}
                                            onChange={(e) => setNewReviewComment(e.target.value)}
                                            rows={4}
                                            required
                                        ></textarea>
                                    </div>
                                    {reviewError && <p className="text-brand-red text-sm font-600">{reviewError}</p>}
                                    <button
                                        type="submit"
                                        className="bg-brand-green text-white px-7 py-3.5 rounded-xl font-700 tracking-tight transition-all duration-200 hover:bg-brand-green-dark disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={reviewLoading}
                                    >
                                        {reviewLoading ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center py-6 bg-brand-bg/50 rounded-xl">
                                    <p className="text-secondary text-sm mb-4">Please login to write a review of this product.</p>
                                    <Link to="/login" className="inline-block bg-brand-green text-white px-6 py-2 rounded-lg font-700 text-sm no-underline hover:bg-brand-green-dark transition-colors">Login Now</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
