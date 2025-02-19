import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import type { HelmetServerState } from 'react-helmet-async'
import App from './App'
import './index.css'

interface RenderOptions {
  helmetContext: { helmet?: HelmetServerState }
}

export async function render(url: string, options?: RenderOptions) {
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <HelmetProvider context={options?.helmetContext || {}}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    </React.StrictMode>
  )

  return html
} 