import React, { useState, useEffect } from 'react';
import { ShoppingCart, User as UserIcon, Menu, X, Search, Phone, Mail, Heart, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSettings } from '../hooks/useSettings';
import insforge from '../lib/insforge';
import { Product } from '../types';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const { getSetting } = useSettings();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim().length >= 2) {
                try {
                    const { data } = await insforge.database
                        .from('products')
                        .select('*, categories(name)')
                        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
                        .eq('is_active', true)
                        .limit(5);

                    setSuggestions(data || []);
                    setShowSuggestions(true);
                } catch (err) {
                    console.error('Error fetching suggestions:', err);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setShowSuggestions(false);
            if (isMenuOpen) setIsMenuOpen(false);
        }
    };

    // Lock scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMenuOpen]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        if (isSearchOpen) setIsSearchOpen(false);
    };
    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
        if (isMenuOpen) setIsMenuOpen(false);
    };
    const closeMenu = () => {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
    };

    return (
        <>
            <div className="bg-brand-green text-white text-center py-[7px] text-[0.8rem] font-500">
                <div className="max-w-[1400px] mx-auto px-5 md:px-10">
                    <div className="hidden md:flex justify-between items-center py-2 border-b border-white/10 text-[0.82rem] text-white/80">
                        <div className="flex gap-5.5">
                            <span className="flex items-center gap-1.25 text-white/90 font-primary"><Phone size={14} className="text-brand-blue" /> {getSetting('site_phone', '+94 77 0700 737')}</span>
                            <span className="flex items-center gap-1.25 text-white/90 font-primary"><Mail size={14} className="text-brand-blue" /> {getSetting('site_email', 'support@arsurgicalhub.com')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <Link to="/my-orders" className="text-white/90 hover:text-white transition-colors">My Orders</Link>
                                    <Link to="/my-warranty" className="text-white/90 hover:text-white transition-colors">Warranty</Link>
                                    <div className="flex items-center gap-2.5">
                                        <span>Welcome, {user.full_name}</span>
                                        <button onClick={logout} className="bg-transparent border border-white/30 text-white px-3.5 py-1.25 rounded-md cursor-pointer text-[0.8rem] font-600 transition-all duration-200 hover:bg-white hover:text-brand-green">Logout</button>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/login" className="flex items-center gap-1.25 text-white/90 transition-colors duration-200 hover:text-white"><UserIcon size={18} /> Login / Register</Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <header className="sticky top-0 z-[1000] bg-white/80 backdrop-blur-md border-b border-black/8 shadow-sm">
                <div className="max-w-[1400px] mx-auto px-5 md:px-10">
                    <nav className="flex justify-between items-center py-3.5">
                        <Link to="/" className="font-header font-800 flex items-center gap-2.5 text-brand-green-dark no-underline shadow-none transition-transform hover:scale-102">
                            <img src="/ar.svg" alt="AR SURGICAL HUB" className="h-[42px] w-auto object-contain shrink-0" />
                            <div className="flex flex-col leading-none">
                                <span className="hidden sm:inline text-[1.1rem] font-800 text-brand-green-dark tracking-tighter">AR</span>
                                <span className="hidden sm:inline text-[0.65rem] font-700 text-brand-green uppercase tracking-widest mt-0.5">SURGICAL HUB</span>
                            </div>
                        </Link>

                        <div className="hidden md:flex gap-8">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'Products', path: '/shop' },
                                { name: 'Categories', path: '/categories' },
                                { name: 'Knowledge Hub', path: '/blogs' },
                                { name: 'Careers', path: '/careers' },
                                { name: 'Get a Quote', path: '/quotes' }
                            ].map((link) => (
                                <Link key={link.name} to={link.path} className="text-secondary font-500 text-[0.9rem] relative pb-0.75 transition-colors duration-200 hover:text-brand-green after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:height-[2px] after:bg-brand-green after:rounded-sm after:transition-all after:duration-240 hover:after:width-full">
                                    {link.name}
                                </Link>
                            ))}
                            {user?.role === 'admin' && (
                                <Link to="/admin" className="text-brand-green font-bold text-[0.9rem] relative pb-0.75 transition-colors duration-200 hover:text-brand-green-dark">Admin Dashboard</Link>
                            )}
                        </div>

                        <div className="flex items-center gap-3.5 sm:gap-4 md:gap-3">
                            <button className="md:hidden relative text-secondary flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 border border-black/8 cursor-pointer transition-all duration-200 hover:text-brand-green hover:bg-brand-green-light hover:border-brand-green" onClick={toggleSearch}>
                                {isSearchOpen ? <X size={22} /> : <Search size={22} />}
                            </button>

                            <div className={`${isSearchOpen ? 'flex' : 'hidden'} md:flex items-center gap-2 px-3.5 py-2 rounded-lg border border-black/8 bg-gray-50 transition-all duration-200 focus-within:border-brand-green focus-within:ring-3 focus-within:ring-brand-green-light ${isSearchOpen ? 'absolute top-full left-0 w-full p-4.5 bg-white border-t border-black/8 shadow-md z-[1001] animate-in slide-in-from-top-2' : ''}`}>
                                <div className="flex items-center w-full bg-brand-green-light/50 md:bg-transparent rounded-full md:rounded-none px-4 md:px-0">
                                    <input
                                        type="text"
                                        placeholder="Search instruments..."
                                        className="bg-transparent border-none text-brand-text outline-none w-full md:w-[180px] text-[0.88rem] py-2 md:py-0"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        onFocus={() => searchQuery.trim().length >= 2 && setShowSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    />
                                    <Search
                                        size={18}
                                        className={`text-gray-400 shrink-0 ${isSearchOpen ? 'block' : 'hidden'} md:block cursor-pointer hover:text-brand-green transition-colors`}
                                        onClick={() => handleSearch()}
                                    />
                                </div>

                                {/* Suggestions Dropdown */}
                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="absolute top-full left-0 w-full mt-2 bg-white border border-black/8 rounded-xl shadow-xl z-[1002] overflow-hidden animate-in fade-in slide-in-from-top-2">
                                        <div className="p-2">
                                            {suggestions.map((product) => (
                                                <button
                                                    key={product.id}
                                                    onClick={() => {
                                                        navigate(`/product/${product.id}`);
                                                        setShowSuggestions(false);
                                                        setSearchQuery('');
                                                    }}
                                                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-brand-green-light/30 transition-colors text-left border-none bg-transparent cursor-pointer"
                                                >
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border border-black/5">
                                                        <img
                                                            src={product.image_url || '/placeholder.png'}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-[0.88rem] font-700 text-brand-text truncate">{product.name}</div>
                                                        <div className="text-[0.75rem] text-gray-400 flex items-center gap-2">
                                                            {product.categories?.name && <span className="bg-brand-green/10 text-brand-green px-1.5 py-0.5 rounded text-[0.65rem] font-700 uppercase">{product.categories.name}</span>}
                                                            <span className="font-600 text-brand-text">Rs. {product.price.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                            <div className="border-t border-black/5 mt-1 p-2">
                                                <button
                                                    onClick={() => handleSearch()}
                                                    className="w-full py-2 text-[0.78rem] font-700 text-brand-green text-center hover:bg-brand-green-light/30 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                                                >
                                                    View all results for "{searchQuery}"
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link to="/cart" className="relative text-secondary flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 border border-black/8 transition-all duration-200 hover:text-brand-green hover:bg-brand-green-light hover:border-brand-green">
                                <ShoppingCart size={22} />
                                <span className="absolute -top-1 -right-1 bg-brand-green text-white text-[0.65rem] font-700 min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white shadow-sm">{cartCount}</span>
                            </Link>
                            <Link to="/wishlist" className="relative text-secondary flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 border border-black/8 transition-all duration-200 hover:text-brand-green hover:bg-brand-green-light hover:border-brand-green">
                                <Heart size={22} />
                            </Link>
                            <button className="md:hidden relative text-secondary flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 border border-black/8 cursor-pointer transition-all duration-200 hover:text-brand-green hover:bg-brand-green-light hover:border-brand-green" onClick={toggleMenu}>
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Menu Backdrop */}
            <div className={`fixed top-0 left-0 w-full h-full bg-black/50 z-[1999] backdrop-blur-md transition-opacity duration-300 ${isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`} onClick={closeMenu} />

            {/* Side Drawer */}
            <div className={`fixed top-0 right-0 w-[85%] max-w-[320px] h-full bg-white shadow-2xl flex flex-col pt-20 px-6 pb-10 transition-transform duration-400 ease-in-out z-[2000] overflow-y-auto ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* Internal Close Button */}
                <button
                    onClick={closeMenu}
                    className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-brand-bg text-secondary hover:text-brand-green transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Mobile Search in Drawer */}
                <div className="relative mt-2 mb-6">
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-black/8 bg-brand-bg focus-within:border-brand-green transition-all">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="bg-transparent border-none text-brand-text outline-none w-full text-[0.95rem]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            onFocus={() => searchQuery.trim().length >= 2 && setShowSuggestions(true)}
                        />
                        <Search size={20} className="text-gray-400" onClick={() => handleSearch()} />
                    </div>
                    {/* Drawer Suggestion Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-black/8 rounded-xl shadow-xl z-[2001] overflow-hidden">
                            <div className="p-1">
                                {suggestions.map((product) => (
                                    <button
                                        key={product.id}
                                        onClick={() => {
                                            navigate(`/product/${product.id}`);
                                            setShowSuggestions(false);
                                            setSearchQuery('');
                                            closeMenu();
                                        }}
                                        className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-brand-green-light/30 transition-colors text-left border-none bg-transparent cursor-pointer"
                                    >
                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border border-black/5">
                                            <img
                                                src={product.image_url || '/placeholder.png'}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[0.85rem] font-700 text-brand-text truncate">{product.name}</div>
                                            <div className="text-[0.7rem] text-brand-green font-600">Rs. {product.price.toLocaleString()}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-1 mt-0">
                    {[
                        { name: 'Home', path: '/' },
                        { name: 'Products', path: '/shop' },
                        { name: 'Categories', path: '/categories' },
                        { name: 'Knowledge Hub', path: '/blogs' },
                        { name: 'Careers', path: '/careers' },
                        { name: 'Get a Quote', path: '/quotes' }
                    ].map((link) => (
                        <Link key={link.name} to={link.path} onClick={closeMenu} className="text-[1.rem] font-700 w-full py-4.5 border-b border-black/5 text-brand-text no-underline transition-colors duration-200 hover:text-brand-green flex items-center justify-between group">
                            {link.name}
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-green opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    ))}
                    {user && (
                        <Link to="/my-orders" onClick={closeMenu} className="text-[1.rem] font-700 w-full py-4.5 border-b border-black/5 text-brand-text no-underline transition-colors duration-200 hover:text-brand-green">My Orders</Link>
                    )}
                    {user && (
                        <Link to="/my-warranty" onClick={closeMenu} className="text-[1.rem] font-700 w-full py-4.5 border-b border-black/5 text-brand-text no-underline transition-colors duration-200 hover:text-brand-green">Warranty Claims</Link>
                    )}
                    {user?.role === 'admin' && (
                        <Link to="/admin" onClick={closeMenu} className="text-[1.rem] font-800 w-full py-4.5 border-b border-black/5 text-brand-green no-underline transition-colors duration-200">Admin Dashboard</Link>
                    )}
                </div>

                <div className="mt-auto">
                    {user ? (
                        <button onClick={() => { logout(); closeMenu(); }} className="bg-white border-2 border-brand-green text-brand-green text-base font-800 py-3.5 w-full rounded-2xl cursor-pointer text-center transition-all duration-200 flex items-center justify-center gap-2 hover:bg-brand-green-light hover:-translate-y-0.5 hover:shadow-sm">
                            <LogOut size={18} /> Logout
                        </button>
                    ) : (
                        <Link to="/login" onClick={closeMenu} className="bg-brand-green text-white text-base font-800 py-3.5 w-full rounded-2xl cursor-pointer text-center no-underline flex items-center justify-center gap-2 hover:bg-brand-green-dark hover:-translate-y-0.5 hover:shadow-lg shadow-brand-green/20">
                            <UserIcon size={18} /> Login / Register
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
};

export default Header;
