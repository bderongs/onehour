import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BrandName } from './BrandName';
import { ArrowLeft } from 'lucide-react';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isConsultantPage = location.pathname === '/consultants';
  const isPricingPage = location.pathname === '/pricing';
  const isBrandPage = location.pathname === '/brand';
  const isLandingClientsPage = location.pathname === '/';
  const isPrivacyPage = location.pathname === '/privacy';
  const isTermsPage = location.pathname === '/terms';

  const handleBackClick = () => {
    const referrer = document.referrer;
    if (referrer && referrer.includes('sparkier.io')) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const navigation = [
    { name: 'Le Spark', href: '#spark' },
    { name: 'Comment ça Marche', href: '#how-it-works' },
    { name: 'Pourquoi Sparkier', href: '#why-sparkier' },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.substring(1));
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={isConsultantPage || isPricingPage ? "/consultants" : "/"} className="flex items-center">
              <BrandName color="indigo-900" />
            </Link>
          </div>

          {!isBrandPage && (
            <div className="flex items-center space-x-8">
              {isLandingClientsPage && (
                <div className="hidden md:flex space-x-8">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => scrollToSection(item.href)}
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center space-x-4">
                {(isPrivacyPage || isTermsPage) && (
                  <button
                    onClick={handleBackClick}
                    className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Retour
                  </button>
                )}
                {isConsultantPage && (
                  <Link
                    to="/pricing"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    Tarifs
                  </Link>
                )}
                {isPricingPage && (
                  <Link
                    to="/consultants"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    Pourquoi Sparkier ?
                  </Link>
                )}
                {(isConsultantPage || isPricingPage) && (
                  <Link
                    to="/profile"
                    className="text-indigo-600 hover:text-indigo-900 px-3 py-2 text-sm font-medium"
                  >
                    Voir un exemple de profil
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}