import { Routes, Route, useLocation } from 'react-router-dom';
import { LandingClients } from './pages/LandingClients';
import LandingConsultants from './pages/LandingConsultants';
import ConsultantProfilePage from './pages/ConsultantProfilePage';
import ConsultantProfileEditPage from './pages/ConsultantProfileEditPage';
import DemoConsultantProfilePage from './pages/DemoConsultantProfilePage';
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
import { SparkAIEditPage } from './pages/SparkAIEditPage';
import { SparkAICreatePage } from './pages/SparkAICreatePage';
import AuthCallback from './pages/AuthCallback';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { useEffect } from 'react';
import { initializeGoatCounter } from './utils/analytics';
import { AdminDashboard } from './pages/AdminDashboard';
import { ClientDashboard } from './pages/ClientDashboard';

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
          <Route path="/signin" element={
            <>
              <Header />
              <main className="flex-grow pt-16">
                <SignInPage />
              </main>
              <Footer />
            </>
          } />
          <Route path="/signup" element={
            <>
              <Header />
              <main className="flex-grow pt-16">
                <SignUpPage />
              </main>
              <Footer />
            </>
          } />
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
                <DemoConsultantProfilePage />
              </main>
              <Footer />
            </>
          } />
          <Route path="/consultants/:id" element={
            <>
              <main className="flex-grow">
                <ConsultantProfilePage />
              </main>
              <Footer />
            </>
          } />
          <Route path="/consultants/:id/edit" element={
            <>
              <Header />
              <main className="flex-grow pt-16">
                <ConsultantProfileEditPage />
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
          <Route path="/sparks/ai-edit/:sparkUrl" element={
            <>
              <Header />
              <main className="flex-grow pt-16">
                <SparkAIEditPage />
              </main>
              <Footer />
            </>
          } />
          <Route path="/sparks/ai-create" element={
            <>
              <Header />
              <main className="flex-grow pt-16">
                <SparkAICreatePage />
              </main>
              <Footer />
            </>
          } />
          <Route path="/consultant/profile" element={
            <>
              <Header />
              <main className="flex-grow pt-16">
                <div>Profile page coming soon</div>
              </main>
              <Footer />
            </>
          } />
          <Route path="/admin/dashboard" element={
            <>
              <Header />
              <main className="flex-grow pt-16">
                <AdminDashboard />
              </main>
              <Footer />
            </>
          } />
          <Route path="/admin/consultants" element={
            <>
              <Header />
              <main className="flex-grow pt-16">
                <div>Consultant management coming soon</div>
              </main>
              <Footer />
            </>
          } />
          <Route path="/admin/clients" element={
            <>
              <Header />
              <main className="flex-grow pt-16">
                <div>Client management coming soon</div>
              </main>
              <Footer />
            </>
          } />
          <Route path="/admin/settings" element={
            <>
              <Header />
              <main className="flex-grow pt-16">
                <div>Settings coming soon</div>
              </main>
              <Footer />
            </>
          } />
          <Route path="/client/dashboard" element={
            <>
              <Header />
              <main className="flex-grow pt-16">
                <ClientDashboard />
              </main>
              <Footer />
            </>
          } />
          <Route path="/client/conversations" element={
            <>
              <Header />
              <main className="flex-grow pt-16">
                <div>Conversations coming soon</div>
              </main>
              <Footer />
            </>
          } />
          <Route path="/client/documents" element={
            <>
              <Header />
              <main className="flex-grow pt-16">
                <div>Documents coming soon</div>
              </main>
              <Footer />
            </>
          } />
          <Route path="/sparks/explore" element={
            <>
              <Header />
              <main className="flex-grow pt-16">
                <div>Spark exploration coming soon</div>
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