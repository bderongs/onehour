import { Routes, Route, useLocation } from 'react-router-dom';
import { LandingClients } from './pages/LandingClients';
import LandingConsultants from './pages/LandingConsultants';
import ConsultantProfilePage from './pages/ConsultantProfilePage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { PricingPage } from './pages/PricingPage';
import { BrandPage } from './pages/BrandPage';
import { SparkProductPage } from './pages/SparkProductPage';
import { SparkManagementPage } from './pages/SparkManagementPage';
import { SparkCreatePage } from './pages/SparkCreatePage';
import { SparkEditPage } from './pages/SparkEditPage';
import AuthCallback from './pages/AuthCallback';
import { useEffect } from 'react';
import { initializeGoatCounter } from './utils/analytics';

function App() {
  const location = useLocation();

  // Reset scroll position when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Set manual scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    return () => {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
  }, []);

  useEffect(() => {
    initializeGoatCounter();
  }, []);

  try {
    return (
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/" element={
            <>
              <Header />
              <main className="flex-grow pt-16">
                <LandingClients />
              </main>
              <Footer />
            </>
          } />
          <Route path="/consultants" element={
            <>
              <Header />
              <main className="flex-grow pt-16">
                <LandingConsultants />
              </main>
              <Footer />
            </>
          } />
          <Route path="/pricing" element={
            <>
              <Header />
              <main className="flex-grow pt-16">
                <PricingPage />
              </main>
              <Footer />
            </>
          } />
          <Route path="/profile" element={
            <>
              <main className="flex-grow">
                <ConsultantProfilePage />
              </main>
              <Footer />
            </>
          } />
          <Route path="/demospark" element={
            <>
              <Header />
              <main className="flex-grow pt-16">
                <SparkProductPage />
              </main>
              <Footer />
            </>
          } />
          <Route path="/terms" element={
            <>
              <Header />
              <main className="flex-grow pt-16">
                <Terms />
              </main>
              <Footer />
            </>
          } />
          <Route path="/privacy" element={
            <>
              <Header />
              <main className="flex-grow pt-16">
                <Privacy />
              </main>
              <Footer />
            </>
          } />
          <Route path="/brand" element={
            <>
              <Header />
              <main className="flex-grow">
                <BrandPage />
              </main>
              <Footer />
            </>
          } />
          <Route path="/sparks/:sparkUrl" element={
            <>
              <Header />
              <main className="flex-grow pt-16">
                <SparkProductPage />
              </main>
              <Footer />
            </>
          } />
          <Route path="/sparks/manage" element={
            <>
              <Header />
              <main className="flex-grow pt-16">
                <SparkManagementPage />
              </main>
              <Footer />
            </>
          } />
          <Route path="/sparks/create" element={
            <>
              <Header />
              <main className="flex-grow pt-16">
                <SparkCreatePage />
              </main>
              <Footer />
            </>
          } />
          <Route path="/sparks/edit/:sparkUrl" element={
            <>
              <Header />
              <main className="flex-grow pt-16">
                <SparkEditPage />
              </main>
              <Footer />
            </>
          } />
          <Route path="*" element={
            <>
              <Header />
              <main className="flex-grow pt-16">
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold">Page not found</h2>
                  <p>The page you're looking for doesn't exist.</p>
                </div>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    );
  } catch (error) {
    console.error('App Error:', error);
    return <div>Something went wrong. Please try refreshing the page.</div>;
  }
}

export default App;