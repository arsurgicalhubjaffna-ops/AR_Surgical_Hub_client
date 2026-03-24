import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartSuccessModal from './CartSuccessModal';
import WhatsAppFAB from './WhatsAppFAB';

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-brand-bg text-brand-text font-primary">
            <Header />
            <main className="flex-grow w-full max-w-[1400px] mx-auto px-5 md:px-10 py-6 md:py-10">
                {children}
            </main>
            <Footer />
            <CartSuccessModal />
            <WhatsAppFAB />
        </div>
    );
};

export default Layout;
