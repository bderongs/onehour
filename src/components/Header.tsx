import React from 'react';
import { Menu, X, Clock, Users, Briefcase } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">OneHourAdvice</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-indigo-600">Home</a>
            <a href="/find-expert" className="text-gray-700 hover:text-indigo-600">Find an Expert</a>
            <a href="/become-consultant" className="text-gray-700 hover:text-indigo-600">Become a Consultant</a>
            <a href="/how-it-works" className="text-gray-700 hover:text-indigo-600">How it Works</a>
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
              <a href="/" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">Home</a>
              <a href="/find-expert" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">Find an Expert</a>
              <a href="/become-consultant" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">Become a Consultant</a>
              <a href="/how-it-works" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">How it Works</a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}