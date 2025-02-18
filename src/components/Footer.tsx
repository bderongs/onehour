import { useLocation, useNavigate } from 'react-router-dom';
import { BrandName } from './BrandName';

const scrollToSection = (sectionId: string, navigate: any, currentPath: string) => {
  if (currentPath === '/') {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  } else {
    navigate(`/#${sectionId}`);
  }
};

export function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const isConsultantsPage = location.pathname === '/consultants';
  const isPricingPage = location.pathname === '/pricing';
  const isProfilePage = location.pathname === '/profile' || /^\/consultants\/[^/]+$/.test(location.pathname);
  const isConsultantSection = isConsultantsPage || isPricingPage;
  const isDevelopment = import.meta.env.MODE === 'development';
  const buildDate = import.meta.env.VITE_BUILD_DATE;

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
                    <button onClick={() => scrollToSection('why-choose', navigate, location.pathname)} className="text-gray-400 hover:text-white">
                      Pourquoi Nous Choisir
                    </button>
                  </li>
                  <li>
                    <button onClick={() => scrollToSection('experts', navigate, location.pathname)} className="text-gray-400 hover:text-white">
                      Nos Experts
                    </button>
                  </li>
                  <li>
                    <button onClick={() => scrollToSection('how-it-works', navigate, location.pathname)} className="text-gray-400 hover:text-white">
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
                {location.pathname === '/' && (
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
          {isDevelopment && buildDate && (
            <p className="text-xs mt-2 text-gray-500">
              Build date: {new Date(buildDate).toLocaleString('fr-FR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}