import React from 'react';
import ReactDOM from 'react-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Header />
    <Hero onConnect={() => {}} />
    <Features />
    <Footer />
  </React.StrictMode>,
  document.getElementById('root')
);
