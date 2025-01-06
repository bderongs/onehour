import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export function Header() {
  const location = useLocation();
  const isConsultantPage = location.pathname === '/consultants';
  const isPricingPage = location.pathname === '/pricing';

  const navigation = [
    { name: 'Pourquoi Nous Choisir', href: '#why-choose' },
    { name: 'Nos Experts', href: '#experts' },
    { name: 'Comment ça Marche', href: '#how-it-works' },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.substring(1));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Sparkles className="h-8 w-8 text-indigo-600" />
              <div className="ml-2 text-xl font-bold">
                <span className="text-gray-900">Brain</span>
                <span className="text-indigo-600">Sparks</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            {!isConsultantPage && !isPricingPage && (
              <div className="hidden md:flex space-x-8">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
            
            {isConsultantPage ? (
              <Link
                to="/pricing"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Tarifs
              </Link>
            ) : !isConsultantPage && (
              <Link
                to="/consultants"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Devenir consultant
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}