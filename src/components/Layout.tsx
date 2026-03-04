import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-brand-bg text-brand-text">
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
