import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { ConsultantConnect } from './components/ConsultantConnect';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'connect'>('home');

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'home' ? (
        <Hero onConnect={() => setCurrentPage('connect')} />
      ) : (
        <ConsultantConnect onBack={() => setCurrentPage('home')} />
      )}
    </div>
  );
}

export default App;