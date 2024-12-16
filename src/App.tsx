import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ChatPage } from './pages/ChatPage';
import { ConsultantConnect } from './components/ConsultantConnect';
import { Layout } from './components/Layout';
import { FAQ } from './pages/FAQ';
import ConsultantPage from './pages/ConsultantPage';


function App() {
  try {
    return (
      <Routes>
        <Route path="/" element={
          <Layout>
            <LandingPage />
          </Layout>
        } />
        <Route path="/chat" element={
          <Layout>
            <ChatPage />
          </Layout>
        } />
        <Route path="/faq" element={
          <Layout>
            <FAQ />
          </Layout>
        } />
        <Route path="/consultants" element={
          <Layout>
            <ConsultantPage />
          </Layout>
        } />
        <Route path="*" element={
          <Layout>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold">Page not found</h2>
              <p>The page you're looking for doesn't exist.</p>
            </div>
          </Layout>
        } />
      </Routes>
    );
  } catch (error) {
    console.error('App Error:', error);
    return <div>Something went wrong. Please try refreshing the page.</div>;
  }
}

export default App;