import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Link } from 'react-router-dom';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <nav className="flex space-x-4">
                <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
                <Link to="/pricing" className="text-gray-700 hover:text-blue-600">Pricing</Link>
                <Link to="/faq" className="text-gray-700 hover:text-blue-600">FAQ</Link>
            </nav>
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}