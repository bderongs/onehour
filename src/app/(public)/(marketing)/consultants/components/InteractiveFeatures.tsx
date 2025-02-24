'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const InteractiveFeatures: React.FC = () => {
    useEffect(() => {
        // Handle hash-based navigation
        if (window.location.hash === '#signup-form') {
            const element = document.getElementById('signup-form');
            if (element) {
                const headerOffset = 120;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }, []); // Run only once when component mounts

    const handleScrollToSignup = () => {
        document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
                onClick={handleScrollToSignup}
                className="w-full sm:w-auto bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2 group opacity-0 translate-y-4 animate-[fadeInUp_0.5s_ease-out_0.1s_forwards]"
            >
                <span className="whitespace-nowrap">Créer mes premiers Sparks gratuitement</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <div className="w-full sm:w-auto opacity-0 translate-y-4 animate-[fadeInUp_0.5s_ease-out_0.2s_forwards]">
                <Link
                    href="/profile"
                    className="w-full sm:w-auto bg-white text-blue-600 border-2 border-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center gap-2 group"
                >
                    <span className="whitespace-nowrap">Voir un profil exemple</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
        </div>
    );
}; 