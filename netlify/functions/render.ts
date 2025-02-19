import { Handler } from '@netlify/functions'
import fs from 'fs'
import path from 'path'
import type { HelmetServerState } from 'react-helmet-async'

interface RenderOptions {
  helmetContext: { helmet?: HelmetServerState }
}

type RenderFunction = (url: string, options?: RenderOptions) => Promise<string>

const handler: Handler = async (event) => {
  try {
    const url = event.path || '/'
    console.log('Render function called with path:', url)
    console.log('Current working directory:', process.cwd())
    console.log('Directory contents:', fs.readdirSync(process.cwd()))

    // Get the template
    const template = fs.readFileSync(path.join(__dirname, '../../dist/client/index.html'), 'utf-8')
    console.log('Template loaded successfully')
    
    // Read the CSS file
    let styleContent = ''
    try {
      styleContent = fs.readFileSync(path.join(__dirname, '../../dist/client/assets/index.css'), 'utf-8')
      console.log('CSS loaded successfully')
    } catch (cssError) {
      console.warn('Could not load CSS file:', cssError)
    }
    
    // Import the server entry point
    console.log('Attempting to import entry-server.js')
    // @ts-ignore - This file is generated during build
    const { render } = await import('./entry-server.js') as { render: RenderFunction }
    console.log('Server entry point loaded successfully')
    
    try {
      // Create a fresh context for React Helmet Async
      const helmetContext: { helmet?: HelmetServerState } = {}

      // Render the app
      console.log('Attempting to render app with URL:', url)
      const appHtml = await render(url, { helmetContext })
      console.log('App rendered successfully')
      
      // Extract helmet data
      const { helmet } = helmetContext
      
      // Find all necessary scripts
      const assetsDir = path.join(__dirname, '../../dist/client/assets')
      const files = fs.readdirSync(assetsDir)
      
      // Get all JS files in the correct order
      const scriptFiles = files
        .filter(file => file.endsWith('.js'))
        .sort((a, b) => {
          // Ensure entry-client comes first, then app.js, then others
          if (a.startsWith('entry-client')) return -1
          if (b.startsWith('entry-client')) return 1
          if (a.startsWith('app')) return -1
          if (b.startsWith('app')) return 1
          return 0
        })

      if (scriptFiles.length === 0) {
        throw new Error('Could not find any script files')
      }

      // Create script tags for all JS files
      const scriptTags = scriptFiles
        .map(file => `<script type="module" src="/assets/${file}"></script>`)
        .join('\n')
      
      // Inject everything into the template
      let html = template
        // Replace the default head content with Helmet data
        .replace(/<title>.*?<\/title>/i, helmet?.title?.toString() || '')
        .replace('</head>',
          `${helmet?.meta?.toString() || ''}
           ${helmet?.link?.toString() || ''}
           ${helmet?.script?.toString() || ''}
           <style>${styleContent}</style>
           </head>`
        )
        .replace('<!--app-html-->', appHtml)
        .replace(
          '<script type="module" src="/src/entry-client.tsx">',
          scriptTags
        )
      
      // Add state and routing context
      const stateScript = `
        <script>
          window.__INITIAL_PATH__ = ${JSON.stringify(url)};
          window.__INITIAL_STATE__ = {};
        </script>
      `
      html = html.replace('</body>', `${stateScript}</body>`)
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'no-store, must-revalidate'
        },
        body: html,
      }
    } catch (renderError) {
      console.error('Error during app rendering:', renderError)
      throw renderError
    }
  } catch (error) {
    console.error('Render error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        cwd: process.cwd(),
        files: fs.existsSync(process.cwd()) ? fs.readdirSync(process.cwd()) : [],
        dirname: __dirname,
        dirnameContents: fs.existsSync(__dirname) ? fs.readdirSync(__dirname) : [],
        url: event.path,
        assetsDir: fs.existsSync(path.join(__dirname, '../../dist/client/assets')) 
          ? fs.readdirSync(path.join(__dirname, '../../dist/client/assets')) 
          : []
      }, null, 2)
    }
  }
}

export { handler } 