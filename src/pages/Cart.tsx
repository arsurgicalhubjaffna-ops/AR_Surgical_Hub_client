import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart: React.FC = () => {
    const { cart, removeFromCart, cartTotal, clearCart } = useCart();

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-5">
                <div className="w-24 h-24 rounded-full bg-brand-green-light flex items-center justify-center text-brand-green mb-6 animate-bounce-slow">
                    <ShoppingBag size={48} />
                </div>
                <h2 className="text-2xl md:text-3xl font-800 tracking-tighter text-brand-text mb-3">Your cart is empty</h2>
                <p className="text-secondary mb-8 max-w-md">Looks like you haven't added any surgical instruments yet. Explore our catalog to find what you need.</p>
                <Link to="/shop" className="inline-flex items-center gap-2 bg-brand-green text-white px-8 py-3.5 rounded-xl font-700 no-underline transition-all hover:bg-brand-green-dark hover:-translate-y-0.5 shadow-lg shadow-brand-green/20">
                    Start Shopping
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
                        Shopping <span className="text-brand-green">Cart</span>
                    </h1>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-5 md:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 items-start">

                    {/* Cart Items */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4">
                            {cart.map((item) => (
                                <div key={item.id} className="bg-white border border-black/8 p-4 md:p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-5 md:gap-8 shadow-sm transition-all hover:shadow-md">
                                    <img
                                        src={item.image_url || 'https://via.placeholder.com/120x120/e8f8f6/00b5a4?text=Product'}
                                        alt={item.name}
                                        className="w-24 h-24 md:w-28 md:h-28 rounded-xl object-cover shadow-sm shrink-0"
                                    />
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="text-lg font-700 text-brand-text mb-1 leading-tight">{item.name}</h3>
                                        <p className="text-brand-green font-700 font-header">Rs. {typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price).toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-8 md:gap-12">
                                        <div className="text-center">
                                            <span className="block text-[0.7rem] uppercase font-700 text-gray-400 mb-1">Quantity</span>
                                            <span className="text-brand-text font-700">{item.quantity}</span>
                                        </div>
                                        <div className="text-center sm:text-right min-w-[80px]">
                                            <span className="block text-[0.7rem] uppercase font-700 text-gray-400 mb-1">Subtotal</span>
                                            <span className="text-brand-green font-800 font-header text-lg">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-brand-red opacity-60 transition-all hover:opacity-100 hover:scale-110 p-2"
                                            title="Remove item"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mt-4">
                            <Link to="/shop" className="text-brand-green font-600 text-sm flex items-center gap-1 hover:gap-2 transition-all">
                                ← Continue Shopping
                            </Link>
                            <button
                                onClick={clearCart}
                                className="text-gray-400 hover:text-brand-red text-sm font-600 border border-black/8 px-4 py-2 rounded-lg transition-colors"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <aside className="bg-white border border-black/8 p-8 rounded-[24px] shadow-sm sticky top-24">
                        <h3 className="text-xl font-800 tracking-tight text-brand-text mb-6">Order Summary</h3>

                        <div className="flex flex-col gap-4 mb-8">
                            <div className="flex justify-between text-secondary font-500">
                                <span>Subtotal</span>
                                <span className="text-brand-text font-700 font-header">Rs. {cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-secondary font-500">
                                <span>Shipping</span>
                                <span className="text-brand-green font-700 uppercase text-xs tracking-widest">Free</span>
                            </div>
                            <div className="h-px bg-black/8 my-2"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-800 text-brand-text">Total</span>
                                <span className="text-2xl font-800 text-brand-green font-header">Rs. {cartTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <Link
                            to="/checkout"
                            className="flex items-center justify-center gap-2 bg-brand-green text-white w-full py-4 rounded-xl font-700 no-underline transition-all duration-200 hover:bg-brand-green-dark hover:-translate-y-0.5 shadow-lg shadow-brand-green/20"
                        >
                            Proceed to Checkout <ArrowRight size={18} />
                        </Link>

                        <div className="mt-6 flex items-center justify-center gap-2 text-[0.75rem] text-gray-400 font-500">
                            Secure Payment Processing
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Cart;
