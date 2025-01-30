import { Routes, Route, useLocation } from 'react-router-dom';
import { LandingClients } from './pages/LandingClients';
import LandingConsultants from './pages/LandingConsultants';
import ConsultantProfilePage from './pages/ConsultantProfilePage';
import ConsultantProfileEditPage from './pages/ConsultantProfileEditPage';
import { DemoProfileWrapper } from './components/DemoProfileWrapper';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { PricingPage } from './pages/PricingPage';
import { BrandPage } from './pages/BrandPage';
import { SparkProductPage } from './pages/SparkProductPage';
import { SparkManagementPage } from './pages/SparkManagementPage';
import { SparkCreatePage } from './pages/SparkCreatePage';
import { SparkEditPage } from './pages/SparkEditPage';
import { SparkAIPage } from './pages/SparkAIPage';
import AuthCallback from './pages/AuthCallback';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { PasswordSetupPage } from './pages/PasswordSetupPage';
import { useEffect } from 'react';
import { initializeGoatCounter } from './utils/analytics';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminSparksPage } from './pages/AdminSparksPage';
import { AdminConsultantsPage } from './pages/AdminConsultantsPage';
import { ClientDashboard } from './pages/ClientDashboard';
import { MarketingLayout } from './layouts/MarketingLayout';
import { ConsultantProfileLayout } from './layouts/ConsultantProfileLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

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
          {/* Auth routes */}
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/reset-password" element={<MarketingLayout><ResetPasswordPage /></MarketingLayout>} />
          <Route path="/setup-password" element={<MarketingLayout><PasswordSetupPage /></MarketingLayout>} />
          
          {/* Marketing routes with standard header/footer */}
          <Route path="/" element={<MarketingLayout><LandingClients /></MarketingLayout>} />
          <Route path="/consultants" element={<MarketingLayout><LandingConsultants /></MarketingLayout>} />
          <Route path="/pricing" element={<MarketingLayout><PricingPage /></MarketingLayout>} />
          <Route path="/terms" element={<MarketingLayout><Terms /></MarketingLayout>} />
          <Route path="/privacy" element={<MarketingLayout><Privacy /></MarketingLayout>} />
          <Route path="/brand" element={<MarketingLayout withTopPadding={false}><BrandPage /></MarketingLayout>} />
          <Route path="/signin" element={<MarketingLayout><SignInPage /></MarketingLayout>} />
          <Route path="/signup" element={<MarketingLayout><SignUpPage /></MarketingLayout>} />
          <Route path="/sparks/:sparkUrl" element={<MarketingLayout><SparkProductPage /></MarketingLayout>} />
          
          {/* Consultant profile routes with no header */}
          <Route path="/profile" element={<ConsultantProfileLayout><DemoProfileWrapper /></ConsultantProfileLayout>} />
          <Route path="/:slug" element={<ConsultantProfileLayout><ConsultantProfilePage /></ConsultantProfileLayout>} />
          
          {/* Dashboard routes with dashboard header */}
          <Route path="/sparks/manage" element={<DashboardLayout><SparkManagementPage /></DashboardLayout>} />
          <Route path="/sparks/create" element={<DashboardLayout><SparkCreatePage /></DashboardLayout>} />
          <Route path="/sparks/edit/:sparkUrl" element={<DashboardLayout><SparkEditPage /></DashboardLayout>} />
          <Route path="/sparks/ai-edit/:sparkUrl" element={<DashboardLayout><SparkAIPage /></DashboardLayout>} />
          <Route path="/sparks/ai-create" element={<DashboardLayout><SparkAIPage /></DashboardLayout>} />
          <Route path="/consultants/:id/edit" element={<DashboardLayout><ConsultantProfileEditPage /></DashboardLayout>} />
          <Route path="/admin/dashboard" element={<DashboardLayout><AdminDashboard /></DashboardLayout>} />
          <Route path="/admin/sparks" element={<DashboardLayout><AdminSparksPage /></DashboardLayout>} />
          <Route path="/admin/consultants" element={<DashboardLayout><AdminConsultantsPage /></DashboardLayout>} />
          <Route path="/admin/clients" element={<DashboardLayout><div>Client management coming soon</div></DashboardLayout>} />
          <Route path="/admin/settings" element={<DashboardLayout><div>Settings coming soon</div></DashboardLayout>} />
          <Route path="/client/dashboard" element={<DashboardLayout><ClientDashboard /></DashboardLayout>} />
          <Route path="/client/conversations" element={<DashboardLayout><div>Conversations coming soon</div></DashboardLayout>} />
          <Route path="/client/documents" element={<DashboardLayout><div>Documents coming soon</div></DashboardLayout>} />
          <Route path="/sparks/explore" element={<DashboardLayout><div>Spark exploration coming soon</div></DashboardLayout>} />
          
          {/* 404 route */}
          <Route path="*" element={
            <MarketingLayout>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold">Page not found</h2>
                <p>The page you're looking for doesn't exist.</p>
              </div>
            </MarketingLayout>
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