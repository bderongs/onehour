import React from 'react';
import { Menu, X, Clock } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false); // Close mobile menu after clicking
  };

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
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
            <button onClick={() => scrollToSection('why-choose')}
              className="text-gray-700 hover:text-indigo-600">
              Pourquoi Nous Choisir
            </button>
            <button onClick={() => scrollToSection('experts')}
              className="text-gray-700 hover:text-indigo-600">
              Nos Experts
            </button>
            <button onClick={() => scrollToSection('how-it-works')}
              className="text-gray-700 hover:text-indigo-600">
              Comment ça Marche
            </button>
            <button onClick={() => scrollToSection('pricing')}
              className="text-gray-700 hover:text-indigo-600">
              Tarifs
            </button>
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
              <button onClick={() => scrollToSection('why-choose')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-indigo-600">
                Pourquoi Nous Choisir
              </button>
              <button onClick={() => scrollToSection('experts')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-indigo-600">
                Nos Experts
              </button>
              <button onClick={() => scrollToSection('how-it-works')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-indigo-600">
                Comment ça Marche
              </button>
              <button onClick={() => scrollToSection('pricing')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-indigo-600">
                Tarifs
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}