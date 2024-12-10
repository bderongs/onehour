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
              Solutions de conseil expert,
              <br />
              une heure à la fois.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white">Accueil</a></li>
              <li><a href="#how-it-works" className="text-gray-400 hover:text-white">Comment ça Marche</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Ressources</h3>
            <ul className="space-y-2">
              <li><a href="/blog" className="text-gray-400 hover:text-white">Blog</a></li>
              <li><a href="/case-studies" className="text-gray-400 hover:text-white">Études de Cas</a></li>
              <li><a href="/faq" className="text-gray-400 hover:text-white">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">support@onehouradvice.com</li>
              <li className="text-gray-400">01 23 45 67 89</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} OneHourAdvice. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}