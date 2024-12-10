import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ChatPage } from './pages/ChatPage';
import { ConsultantConnect } from './components/ConsultantConnect';
import { Layout } from './components/Layout';

function App() {
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
      <Route path="/connect" element={
        <Layout>
          <ConsultantConnect onBack={() => window.history.back()} />
        </Layout>
      } />
    </Routes>
  );
}

export default App;