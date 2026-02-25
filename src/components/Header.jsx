import { ShoppingCart, User, Menu, X, Search, Phone, Mail, Heart } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import '../theme.css';
import './Header.css';

const Header = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

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
            {isMenuOpen && <div className="menu-backdrop" onClick={closeMenu} />}
            <div className="header-announcement">
                <div className="container">
                    <div className="header-top">
                        <div className="contact-info">
                            <span><Phone size={14} /> +1 (555) 123-4567</span>
                            <span><Mail size={14} /> support@arsurgical.com</span>
                        </div>
                        <div className="user-links">
                            {user ? (
                                <div className="user-profile">
                                    <span>Welcome, {user.full_name}</span>
                                    <button onClick={logout} className="toggle-btn">Logout</button>
                                </div>
                            ) : (
                                <Link to="/login"><User size={18} /> Login / Register</Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <header className="header bg-glass">
                <div className="container">
                    <nav className="header-main">
                        <Link to="/" className="logo">
                            <img src="/ar.svg" alt="AR Surgical Hub" className="logo-img" />
                            <span className="logo-text">Surgical Hub</span>
                        </Link>
                        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                            <Link to="/" onClick={closeMenu}>Home</Link>
                            <Link to="/shop" onClick={closeMenu}>Products</Link>
                            <Link to="/categories" onClick={closeMenu}>Categories</Link>
                            <Link to="/careers" onClick={closeMenu}>Careers</Link>
                            <Link to="/quotes" onClick={closeMenu}>Get a Quote</Link>
                            <div className="mobile-only mobile-user-links">
                                {user ? (
                                    <button onClick={() => { logout(); closeMenu(); }} className="mobile-logout-link">Logout</button>
                                ) : (
                                    <Link to="/login" onClick={closeMenu}><User size={18} /> Login / Register</Link>
                                )}
                            </div>
                        </div>
                        <div className="header-actions">
                            <button className="mobile-only header-action-btn" onClick={toggleSearch}>
                                {isSearchOpen ? <X size={22} /> : <Search size={22} />}
                            </button>
                            <div className={`search-bar bg-glass ${isSearchOpen ? 'mobile-show' : ''}`}>
                                <input type="text" placeholder="Search instruments..." />
                                <Search size={18} className="desktop-search-icon" />
                            </div>
                            <Link to="/cart" className="header-action-btn">
                                <ShoppingCart size={22} />
                                <span className="cart-count">{cartCount}</span>
                            </Link>
                            <Link to="/wishlist" className="header-action-btn">
                                <Heart size={22} />
                            </Link>
                            <button className="header-action-btn menu-toggle" onClick={toggleMenu}>
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </nav>
                </div>
            </header>
        </>
    );
};

export default Header;
