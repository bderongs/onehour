import React from 'react';
import { Link } from 'react-router-dom';

export function LightFooter() {
    return (
        <footer className="bg-white py-12 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <p className="text-gray-600 text-sm">
                        &copy; {new Date().getFullYear()} OneHour. Tous droits réservés.
                    </p>
                    <div className="flex space-x-4">
                        <Link to="/privacy" className="text-gray-600 text-sm hover:text-blue-600">
                            Politique de Confidentialité
                        </Link>
                        <Link to="/terms" className="text-gray-600 text-sm hover:text-blue-600">
                            Termes et Conditions
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
