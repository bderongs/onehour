/**
 * Header.tsx
 * This component renders the header for the marketing pages, including navigation links
 * and authentication buttons. It handles responsive design for both desktop and mobile views.
 */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandName } from '@/components/BrandName';
import { Menu, X } from 'lucide-react';
import { ProfileMenu } from '@/components/ProfileMenu';
import { useAuth } from '@/contexts/AuthContext';
import logger from '@/utils/logger';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const pathname = usePathname();
  const isConsultantPage = pathname === '/consultants';
  const isPricingPage = pathname === '/pricing';
  const isLandingClientsPage = pathname === '/';
  const isAuthPage = pathname === '/auth/signin' || pathname === '/auth/signup';

  // Debug log to help diagnose auth state issues
  useEffect(() => {
    logger.info('Auth state in Header:', { 
      hasUser: !!user, 
      userObject: user ? { 
        id: user.id,
        email: user.email,
        roles: user.roles 
      } : null,
      authLoading, 
      pathname,
      isAuthPage,
      isConsultantPage,
      isPricingPage,
      isLandingClientsPage
    });
  }, [user, authLoading, pathname, isAuthPage, isConsultantPage, isPricingPage, isLandingClientsPage]);

  const navigation = [
    { name: 'Le Spark', href: '#spark' },
    { name: 'Comment ça Marche', href: '#how-it-works' },
    { name: 'Pourquoi Sparkier', href: '#why-sparkier' },
  ];

  useEffect(() => {
    // Handle initial hash navigation when page loads
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        scrollToSection(hash);
      }, 500);
    }
  }, []);

  const scrollToSection = (sectionId: string) => {
    // Close menu first to prevent visual glitches
    setIsMenuOpen(false);
    
    logger.info('Attempting to scroll to section:', sectionId);
    
    // Ensure we have a proper ID (remove # if present)
    const targetId = sectionId.startsWith('#') ? sectionId.substring(1) : sectionId;
    
    // Try to find the element multiple times with increasing delays
    const findElementWithRetry = (attempt = 1) => {
      const element = document.getElementById(targetId);
      
      if (element) {
        logger.info('Found element:', targetId);
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else if (attempt < 3) {
        logger.info(`Element not found, retrying... (attempt ${attempt})`);
        setTimeout(() => findElementWithRetry(attempt + 1), 200 * attempt);
      } else {
        logger.warn(`Could not find element with id: ${targetId}`);
      }
    };

    // Start the retry process
    setTimeout(() => findElementWithRetry(), 100);
  };

  const handleSignUpClick = () => {
    setIsMenuOpen(false);
    
    logger.info('Attempting to scroll to signup form');
    
    const findSignupForm = (attempt = 1) => {
      const element = document.getElementById('signup-form');
      
      if (element) {
        logger.info('Found signup form');
        const headerOffset = 120;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else if (attempt < 3) {
        logger.info(`Signup form not found, retrying... (attempt ${attempt})`);
        setTimeout(() => findSignupForm(attempt + 1), 200 * attempt);
      } else {
        logger.warn('Could not find signup form');
      }
    };

    // Start the retry process
    setTimeout(() => findSignupForm(), 100);
  };

  const showSignUpButton = isLandingClientsPage || isConsultantPage;
  
  // Determine if auth buttons should be shown - don't check authLoading
  // Show auth buttons by default when not on auth page, until we know user is logged in
  const shouldShowAuthButtons = !isAuthPage && (user === null || !user);

  // Log the conditions for auth buttons visibility
  useEffect(() => {
    logger.info('Auth buttons visibility conditions:', {
      shouldShowAuthButtons,
      showSignUpButton,
      user: !!user,
      isAuthPage,
      authLoading
    });
  }, [shouldShowAuthButtons, showSignUpButton, user, isAuthPage, authLoading]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-sm bg-white">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={isConsultantPage || isPricingPage ? "/consultants" : "/"} className="flex items-center">
              <BrandName color="blue-900" />
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isLandingClientsPage && navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.href);
                }}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                {item.name}
              </Link>
            ))}

            {isConsultantPage && (
              <Link
                href="/pricing"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Tarifs
              </Link>
            )}

            {isPricingPage && (
              <Link
                href="/consultants"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Pourquoi Sparkier ?
              </Link>
            )}
            
            {(isConsultantPage || isPricingPage) && !user && (
              <Link
                href="/profile"
                className="text-blue-600 hover:text-blue-900 px-3 py-2 text-sm font-medium"
              >
                Voir un exemple de profil
              </Link>
            )}

            <div className="flex items-center space-x-4">
              {/* Debug info */}
              {process.env.NODE_ENV === 'development' && (
                <span className="text-xs text-gray-500">
                  {authLoading ? 'Loading...' : (user ? 'User: Yes' : 'User: No')}
                </span>
              )}
              
              {/* Auth buttons - show when not on auth page and no user is detected */}
              {shouldShowAuthButtons && (
                <>
                  <Link
                    href="/auth/signin"
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
              
              {/* User profile menu */}
              {user && (
                <ProfileMenu />
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            {/* Debug info */}
            {process.env.NODE_ENV === 'development' && (
              <span className="text-xs text-gray-500 mr-2">
                {authLoading ? 'Loading...' : (user ? 'User: Yes' : 'User: No')}
              </span>
            )}
            
            {/* Auth buttons - show when not on auth page and no user is detected */}
            {shouldShowAuthButtons && (
              <div className="flex items-center space-x-2 mr-2">
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center justify-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Se connecter
                </Link>
              </div>
            )}
            
            {/* User profile menu */}
            {user && (
              <ProfileMenu />
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
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isLandingClientsPage && navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.href);
                  }}
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 w-full text-left"
                >
                  {item.name}
                </Link>
              ))}

              {isConsultantPage && (
                <Link
                  href="/pricing"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  Tarifs
                </Link>
              )}

              {isPricingPage && (
                <Link
                  href="/consultants"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  Pourquoi Sparkier ?
                </Link>
              )}
              
              {(isConsultantPage || isPricingPage) && !user && (
                <Link
                  href="/profile"
                  className="block px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-900 hover:bg-gray-50"
                >
                  Voir un exemple de profil
                </Link>
              )}

              {/* Auth buttons - show when not on auth page and no user is detected */}
              {shouldShowAuthButtons && (
                <div className="pt-2 space-y-1 border-t border-gray-200">
                  <Link
                    href="/auth/signin"
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