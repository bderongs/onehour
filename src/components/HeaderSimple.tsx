import React from 'react';
import { BrandName } from './BrandName';

export function HeaderSimple() {
  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <BrandName color="indigo-900" />
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}