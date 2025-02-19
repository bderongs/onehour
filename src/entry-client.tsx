import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
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
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  )
}) 