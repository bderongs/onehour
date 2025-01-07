import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export function LightFooter() {
    return (
        <footer className="bg-white py-12 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center">
                        <Sparkles className="h-8 w-8 text-blue-600" />
                        <span className="ml-2 text-xl font-bold text-blue-600">
                            <span>Spark</span>
                            <span>ier</span>
                        </span>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                        <Link 
                            to="/consultants" 
                            className="text-gray-600 font-medium text-sm hover:text-blue-600 flex items-center gap-1.5 group border-b border-dashed border-gray-300 hover:border-blue-600 pb-0.5"
                        >
                            <Sparkles className="h-3.5 w-3.5 transition-transform group-hover:rotate-12" />
                            <span>Créer ma page consultant</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link to="/privacy" className="text-gray-600 text-sm hover:text-blue-600">
                                Politique de Confidentialité
                            </Link>
                            <Link to="/terms" className="text-gray-600 text-sm hover:text-blue-600">
                                Termes et Conditions
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
