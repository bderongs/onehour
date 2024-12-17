import React from 'react';
import { Menu, X, Clock } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isConsultantPage = window.location.pathname === '/consultants';

  const mainNavigation = [
    { name: 'Pourquoi Nous Choisir', id: 'why-choose' },
    { name: 'Nos Experts', id: 'experts' },
    { name: 'Comment ça Marche', id: 'how-it-works' },
  ];

  const consultantLink = { name: 'Devenir consultant', href: '/consultants' };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false); // Close mobile menu after clicking
  };

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <Clock className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">OneHourConsulting</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {mainNavigation.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-gray-700 hover:text-indigo-600"
              >
                {item.name}
              </button>
            ))}
            {!isConsultantPage && (
              <a
                href={consultantLink.href}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {consultantLink.name}
              </a>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {mainNavigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-indigo-600"
                >
                  {item.name}
                </button>
              ))}
              {!isConsultantPage && (
                <a
                  href={consultantLink.href}
                  className="block w-full text-left px-3 py-2 text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  {consultantLink.name}
                </a>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}