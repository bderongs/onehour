'use client';

import { useRouter, usePathname } from 'next/navigation';
import { BrandName } from './BrandName';
import { usePageType } from '@/contexts/PageTypeContext';
import logger from '@/utils/logger';

const scrollToSection = (sectionId: string, router: any, currentPath: string) => {
  if (currentPath === '/') {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  } else {
    router.push(`/#${sectionId}`);
  }
};

export function Footer() {
  const router = useRouter();
  const pathname = usePathname() ?? '/';
  const { isProfilePage, isConsultantSection } = usePageType();

  return (
    <footer className="bg-gray-900 text-white">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isProfilePage ? 'py-6' : 'py-12'}`}>
        {!isProfilePage && (
          <div className={`grid grid-cols-1 ${isConsultantSection ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-8`}>
            <div className={isConsultantSection ? 'md:col-span-1' : ''}>
              <div className="flex items-center mb-4">
                <BrandName color="indigo-400" />
              </div>
              <p className="text-gray-400">
                Le concentré de conseil expert
              </p>
            </div>

            {!isConsultantSection && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
                <ul className="space-y-2">
                  <li>
                    <button onClick={() => scrollToSection('why-choose', router, pathname)} className="text-gray-400 hover:text-white">
                      Pourquoi Nous Choisir
                    </button>
                  </li>
                  <li>
                    <button onClick={() => scrollToSection('experts', router, pathname)} className="text-gray-400 hover:text-white">
                      Nos Experts
                    </button>
                  </li>
                  <li>
                    <button onClick={() => scrollToSection('how-it-works', router, pathname)} className="text-gray-400 hover:text-white">
                      Comment ça Marche
                    </button>
                  </li>
                </ul>
              </div>
            )}

            <div className={isConsultantSection ? 'md:col-start-2' : ''}>
              <h3 className="text-lg font-semibold mb-4">Ressources</h3>
              <ul className="space-y-2">
                <li><a href="/privacy" className="text-gray-400 hover:text-white">Politique de Confidentialité</a></li>
                <li><a href="/terms" className="text-gray-400 hover:text-white">Termes et Conditions</a></li>
              </ul>
            </div>

            <div className={isConsultantSection ? 'md:col-start-3' : ''}>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li><a href="mailto:contact@sparkier.io" className="text-gray-400 hover:text-white">contact@sparkier.io</a></li>
                {pathname === '/' && (
                  <li className="pt-2">
                    <a href="/consultants" className="text-indigo-400 hover:text-indigo-300 font-medium">
                      Sparkier pour les consultants
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        <div className={`${!isProfilePage ? 'border-t border-gray-800 mt-12 pt-8' : ''} text-center text-gray-400`}>
          <p>&copy; {new Date().getFullYear()} Sparkier. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}