import React from 'react';
import { Link } from 'react-router-dom';

export function LightFooter() {
    return (
        <footer className="bg-white py-12 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Créer ma propre page</h2>
                    <p className="text-lg text-gray-600 mb-6">Rejoignez-nous et créez votre propre page de consultant pour offrir vos services.</p>
                    <Link
                        to="/consultants"
                        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                    >
                        Créer ma page
                    </Link>
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 pt-8">
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
