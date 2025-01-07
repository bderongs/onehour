import React from 'react';
import { Flame } from 'lucide-react';

export function HeaderSimple() {
  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <Flame className="h-8 w-8 text-gray-900" />
              <div className="ml-2 text-xl font-bold text-gray-900">
                <span>Brain</span>
                <span>Sparks</span>
              </div>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}