import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrandName } from './BrandName';
import { Menu, X } from 'lucide-react';
import { ProfileMenu } from './ProfileMenu';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const isConsultantPage = location.pathname === '/consultants';
  const isPricingPage = location.pathname === '/pricing';
  const isLandingClientsPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';

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
    setIsMenuOpen(false);
  };

  const handleSignUpClick = () => {
    const element = document.getElementById('signup-form');
    if (element) {
      const headerOffset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  const showSignUpButton = isLandingClientsPage || isConsultantPage;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-sm bg-white">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={isConsultantPage || isPricingPage ? "/consultants" : "/"} className="flex items-center">
              <BrandName color="blue-900" />
            </Link>
          </div>

          {/* Desktop navigation */}
          {!authLoading && (
            <>
              <div className="hidden md:flex md:items-center md:space-x-4">
                {isLandingClientsPage && navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    {item.name}
                  </button>
                ))}

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
                
                {(isConsultantPage || isPricingPage) && !user && (
                  <Link
                    to="/profile"
                    className="text-blue-600 hover:text-blue-900 px-3 py-2 text-sm font-medium"
                  >
                    Voir un exemple de profil
                  </Link>
                )}

                <div className="flex items-center space-x-4">
                  {user ? (
                    <ProfileMenu />
                  ) : !isAuthPage && (
                    <>
                      <Link
                        to="/signin"
                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Se connecter
                      </Link>
                      {showSignUpButton && (
                        <button
                          onClick={handleSignUpClick}
                          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Créer un compte
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                {user && <ProfileMenu />}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ml-2"
                >
                  <span className="sr-only">Open main menu</span>
                  {isMenuOpen ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile menu */}
        {isMenuOpen && !authLoading && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isLandingClientsPage && navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 w-full text-left"
                >
                  {item.name}
                </button>
              ))}

              {isConsultantPage && (
                <Link
                  to="/pricing"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  Tarifs
                </Link>
              )}

              {isPricingPage && (
                <Link
                  to="/consultants"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  Pourquoi Sparkier ?
                </Link>
              )}
              
              {(isConsultantPage || isPricingPage) && !user && (
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-900 hover:bg-gray-50"
                >
                  Voir un exemple de profil
                </Link>
              )}

              {!user && !isAuthPage && (
                <div className="pt-2 space-y-1 border-t border-gray-200">
                  <Link
                    to="/signin"
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Se connecter
                  </Link>
                  {showSignUpButton && (
                    <button
                      onClick={handleSignUpClick}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-900 hover:bg-gray-50"
                    >
                      Créer un compte
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}