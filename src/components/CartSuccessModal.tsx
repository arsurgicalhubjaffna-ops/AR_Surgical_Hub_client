import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductImage from './ProductImage';

const CartSuccessModal: React.FC = () => {
    const { showSuccessModal, setShowSuccessModal, lastAddedProduct } = useCart();
    const navigate = useNavigate();

    if (!showSuccessModal || !lastAddedProduct) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-md animate-in fade-in duration-300" 
                onClick={() => setShowSuccessModal(false)}
            ></div>
            
            <div className="relative bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-400 border border-white/20">
                <div className="absolute top-4 right-4 z-10">
                    <button 
                        onClick={() => setShowSuccessModal(false)}
                        className="p-2 hover:bg-black/5 rounded-full transition-colors text-gray-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8">
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mb-4 animate-bounce-subtle">
                            <CheckCircle2 size={32} className="text-brand-green" />
                        </div>
                        <h3 className="text-xl font-900 tracking-tighter text-brand-text mb-1">Added to Cart!</h3>
                        <p className="text-gray-500 font-500 text-sm">Your selection has been successfully registered.</p>
                    </div>

                    <div className="bg-brand-bg/50 rounded-2xl p-4 flex items-center gap-4 mb-8 border border-black/5">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-black/5 shrink-0 shadow-sm">
                            <ProductImage 
                                src={lastAddedProduct.image_url} 
                                alt={lastAddedProduct.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 text-left">
                            <h4 className="font-800 text-brand-text text-sm line-clamp-1">{lastAddedProduct.name}</h4>
                            <p className="text-brand-green font-900 text-sm mt-1">Rs. {Number(lastAddedProduct.price).toFixed(2)}</p>
                            <span className="inline-block bg-white border border-black/5 px-2 py-0.5 rounded text-[0.65rem] font-800 text-gray-400 uppercase mt-2">Quantity: 1</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => {
                                setShowSuccessModal(false);
                                navigate('/checkout');
                            }}
                            className="w-full bg-brand-text text-white py-4 rounded-xl font-800 text-sm flex items-center justify-center gap-2 hover:bg-brand-text/90 transition-all shadow-lg active:scale-[0.98]"
                        >
                            Proceed to Pay <ArrowRight size={18} />
                        </button>
                        <button 
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full bg-white border border-brand-border py-4 rounded-xl font-800 text-sm text-brand-text-muted hover:bg-brand-bg transition-all flex items-center justify-center gap-2"
                        >
                            <ShoppingBag size={18} /> Continue Shopping
                        </button>
                    </div>
                </div>
                
                <div className="bg-brand-bg/30 px-8 py-4 border-t border-black/5 text-center">
                    <p className="text-[0.7rem] font-700 text-gray-400 uppercase tracking-widest">AR SURGICAL HUB SECURITY GATEWAY</p>
                </div>
            </div>
        </div>
    );
};

export default CartSuccessModal;
