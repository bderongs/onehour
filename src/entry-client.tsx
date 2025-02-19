import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './index.css'

declare global {
  interface Window {
    __INITIAL_PATH__?: string;
    __INITIAL_STATE__?: any;
  }
}

// Wait for all scripts to load before hydrating
window.addEventListener('load', () => {
  ReactDOM.hydrateRoot(
    document.getElementById('root') as HTMLElement,
    <React.StrictMode>
      <HelmetProvider>
        <BrowserRouter basename="">
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </React.StrictMode>
  )
}) 