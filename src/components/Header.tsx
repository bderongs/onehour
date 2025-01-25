import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrandName } from './BrandName';
import { Menu, X } from 'lucide-react';
import { ProfileMenu } from './ProfileMenu';
import { supabase } from '../lib/supabase';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const isConsultantPage = location.pathname === '/consultants';
  const isPricingPage = location.pathname === '/pricing';
  const isBrandPage = location.pathname === '/brand';
  const isLandingClientsPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/signin';

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-sm bg-white">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={isConsultantPage || isPricingPage ? "/consultants" : "/"} className="flex items-center">
              <BrandName color="blue-900" />
            </Link>
          </div>

          {!isBrandPage && (
            <>
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

                <div className="hidden md:flex items-center space-x-4">
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
                  {(isConsultantPage || isPricingPage) && !isAuthenticated && (
                    <Link
                      to="/profile"
                      className="text-blue-600 hover:text-blue-900 px-3 py-2 text-sm font-medium"
                    >
                      Voir un exemple de profil
                    </Link>
                  )}
                  {isAuthenticated ? (
                    <ProfileMenu />
                  ) : !isAuthPage && (
                    <Link
                      to="/signin"
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Se connecter
                    </Link>
                  )}
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                {isAuthenticated && <ProfileMenu />}
                {!isAuthenticated && !isAuthPage && (
                  <Link
                    to="/signin"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
                  >
                    Se connecter
                  </Link>
                )}
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
        {!isBrandPage && isMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {isLandingClientsPage && navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
              {(isConsultantPage || isPricingPage) && !isAuthenticated && (
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-900 hover:bg-gray-50"
                >
                  Voir un exemple de profil
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}