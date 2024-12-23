import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ChatPage } from './pages/ChatPage';
import { FAQ } from './pages/FAQ';
import ConsultantPage from './pages/ConsultantPage';
import { AutomationLandingPage } from './pages/AutomationLandingPage';
import ConsultantProfilePage from './pages/ConsultantProfilePage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { LightFooter } from './components/LightFooter';

function App() {
  try {
    return (
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <main className="flex-grow pt-16">
                <LandingPage />
              </main>
              <Footer />
            </>
          } />
          <Route path="/chat" element={
            <>
              <main className="flex-grow">
                <ChatPage />
              </main>
              <LightFooter />
            </>
          } />
          <Route path="/faq" element={
            <>
              <Header />
              <main className="flex-grow pt-16">
                <FAQ />
              </main>
              <Footer />
            </>
          } />
          <Route path="/consultants" element={
            <>
              <Header />
              <main className="flex-grow pt-16">
                <ConsultantPage />
              </main>
              <Footer />
            </>
          } />
          <Route path="/automation" element={
            <>
              <Header />
              <main className="flex-grow pt-16">
                <AutomationLandingPage />
              </main>
              <Footer />
            </>
          } />
          <Route path="/profile" element={
            <>
              <main className="flex-grow">
                <ConsultantProfilePage />
              </main>
              <LightFooter />
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