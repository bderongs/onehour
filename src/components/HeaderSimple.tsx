
import React from 'react';
import { Clock } from 'lucide-react';

export function HeaderSimple() {
  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <Clock className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">OneHourConsulting</span>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}