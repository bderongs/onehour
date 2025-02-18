import { Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
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
import SparkRequestHandler from './pages/client/SparkRequestHandler';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { PasswordSetupPage } from './pages/PasswordSetupPage';
import { useEffect } from 'react';
import { initializeGoatCounter } from './utils/analytics';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminSparksPage } from './pages/AdminSparksPage';
import { AdminConsultantsPage } from './pages/AdminConsultantsPage';
import { AdminClientsPage } from './pages/AdminClientsPage';
import { AdminRolesPage } from './pages/AdminRolesPage';
import { ClientDashboard } from './pages/ClientDashboard';
import { MarketingLayout } from './layouts/MarketingLayout';
import { ConsultantProfileLayout } from './layouts/ConsultantProfileLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { ClientRequestPage } from './pages/ClientRequestPage';
import { ClientSignUpProvider } from './contexts/ClientSignUpContext';
import { SparkSignUpPage } from './pages/SparkSignUpPage';
import { EmailConfirmationPage } from './pages/EmailConfirmationPage';
import { NotificationProvider } from './contexts/NotificationContext';
import { Metadata } from './components/Metadata';

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
      <HelmetProvider>
        <NotificationProvider>
          <AuthProvider>
            <ClientSignUpProvider>
              <div className="min-h-screen flex flex-col">
                <Metadata />
                <Routes>
                  {/* Public routes */}
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/reset-password" element={<MarketingLayout><ResetPasswordPage /></MarketingLayout>} />
                  <Route path="/setup-password" element={<MarketingLayout><PasswordSetupPage /></MarketingLayout>} />
                  <Route path="/email-confirmation" element={<MarketingLayout><EmailConfirmationPage /></MarketingLayout>} />
                  <Route path="/" element={<MarketingLayout><LandingClients /></MarketingLayout>} />
                  <Route path="/consultants" element={<MarketingLayout><LandingConsultants /></MarketingLayout>} />
                  <Route path="/pricing" element={<MarketingLayout><PricingPage /></MarketingLayout>} />
                  <Route path="/terms" element={<MarketingLayout><Terms /></MarketingLayout>} />
                  <Route path="/privacy" element={<MarketingLayout><Privacy /></MarketingLayout>} />
                  <Route path="/brand" element={<MarketingLayout withTopPadding={false}><BrandPage /></MarketingLayout>} />
                  <Route path="/signin" element={<MarketingLayout><SignInPage /></MarketingLayout>} />
                  <Route path="/signup" element={<MarketingLayout><SignUpPage /></MarketingLayout>} />
                  <Route path="/spark-signup" element={<MarketingLayout><SparkSignUpPage /></MarketingLayout>} />
                  <Route path="/sparks/:sparkUrl" element={<MarketingLayout><SparkProductPage /></MarketingLayout>} />
                  <Route path="/profile" element={<ConsultantProfileLayout><DemoProfileWrapper /></ConsultantProfileLayout>} />
                  <Route path="/:slug" element={<ConsultantProfileLayout><ConsultantProfilePage /></ConsultantProfileLayout>} />

                  {/* Protected consultant routes */}
                  <Route path="/sparks/manage" element={
                    <DashboardLayout>
                      <ProtectedRoute requiredRoles={['consultant', 'admin']}>
                        <SparkManagementPage />
                      </ProtectedRoute>
                    </DashboardLayout>
                  } />
                  <Route path="/sparks/create" element={
                    <DashboardLayout>
                      <ProtectedRoute requiredRoles={['consultant', 'admin']}>
                        <SparkCreatePage />
                      </ProtectedRoute>
                    </DashboardLayout>
                  } />
                  <Route path="/sparks/edit/:sparkUrl" element={
                    <DashboardLayout>
                      <ProtectedRoute requiredRoles={['consultant', 'admin']}>
                        <SparkEditPage />
                      </ProtectedRoute>
                    </DashboardLayout>
                  } />
                  <Route path="/sparks/ai-edit/:sparkUrl" element={
                    <DashboardLayout>
                      <ProtectedRoute requiredRoles={['consultant', 'admin']}>
                        <SparkAIPage />
                      </ProtectedRoute>
                    </DashboardLayout>
                  } />
                  <Route path="/sparks/ai-create" element={
                    <DashboardLayout>
                      <ProtectedRoute requiredRoles={['consultant', 'admin']}>
                        <SparkAIPage />
                      </ProtectedRoute>
                    </DashboardLayout>
                  } />
                  <Route path="/consultants/:id/edit" element={
                    <DashboardLayout>
                      <ProtectedRoute requiredRoles={['consultant', 'admin']} consultantIdParam="id">
                        <ConsultantProfileEditPage />
                      </ProtectedRoute>
                    </DashboardLayout>
                  } />

                  {/* Protected admin routes */}
                  <Route path="/admin/*" element={
                    <DashboardLayout>
                      <ProtectedRoute requiredRoles={['admin']}>
                        <Routes>
                          <Route path="dashboard" element={<AdminDashboard />} />
                          <Route path="sparks" element={<AdminSparksPage />} />
                          <Route path="consultants" element={<AdminConsultantsPage />} />
                          <Route path="clients" element={<AdminClientsPage />} />
                          <Route path="roles" element={<AdminRolesPage />} />
                          <Route path="settings" element={<div>Settings coming soon</div>} />
                        </Routes>
                      </ProtectedRoute>
                    </DashboardLayout>
                  } />

                  {/* Protected client routes */}
                  <Route path="/client/*" element={
                    <DashboardLayout>
                      <ProtectedRoute requiredRoles={['client']}>
                        <Routes>
                          <Route path="dashboard" element={<ClientDashboard />} />
                          <Route path="requests/:requestId" element={<ClientRequestPage />} />
                          <Route path="spark-request-handler" element={<SparkRequestHandler />} />
                          <Route path="conversations" element={<div>Conversations coming soon</div>} />
                          <Route path="documents" element={<div>Documents coming soon</div>} />
                        </Routes>
                      </ProtectedRoute>
                    </DashboardLayout>
                  } />

                  {/* Static files route */}
                  <Route path="/images/*" element={null} />

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
            </ClientSignUpProvider>
          </AuthProvider>
        </NotificationProvider>
      </HelmetProvider>
    );
  } catch (error) {
    console.error('App Error:', error);
    return <div>Something went wrong. Please try refreshing the page.</div>;
  }
}

export default App;