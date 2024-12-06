import React from 'react';
import { Clock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Clock className="h-8 w-8 text-indigo-400" />
              <span className="ml-2 text-xl font-bold">OneHourAdvice</span>
            </div>
            <p className="text-gray-400">
              Expert consulting solutions,
              <br />
              one hour at a time.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white">Home</a></li>
              <li><a href="/find-expert" className="text-gray-400 hover:text-white">Find an Expert</a></li>
              <li><a href="/become-consultant" className="text-gray-400 hover:text-white">Become a Consultant</a></li>
              <li><a href="/how-it-works" className="text-gray-400 hover:text-white">How it Works</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="/blog" className="text-gray-400 hover:text-white">Blog</a></li>
              <li><a href="/case-studies" className="text-gray-400 hover:text-white">Case Studies</a></li>
              <li><a href="/faq" className="text-gray-400 hover:text-white">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">support@OneHourAdvice.com</li>
              <li className="text-gray-400">1-800-MICRO-CONSULT</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} MicroConsult. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}