import { Handler } from '@netlify/functions'
import fs from 'fs'
import path from 'path'

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
    const { render } = await import('./entry-server.js')
    console.log('Server entry point loaded successfully')
    
    try {
      // Render the app
      console.log('Attempting to render app with URL:', url)
      const appHtml = await render(url)
      console.log('App rendered successfully')
      
      // Find the client entry script and other assets
      const assetsDir = path.join(__dirname, '../../dist/client/assets')
      const files = fs.readdirSync(assetsDir)
      
      const clientScriptPath = files.find(file => file.match(/^entry-client\.[a-z0-9]+\.js$/))
      const appScriptPath = files.find(file => file.match(/^app\.[a-z0-9]+\.js$/))
      
      if (!clientScriptPath || !appScriptPath) {
        throw new Error('Could not find required script files')
      }
      
      // Inject the CSS and app HTML, and update script paths
      let html = template
        .replace('</head>', `<style>${styleContent}</style></head>`)
        .replace('<!--app-html-->', appHtml)
        .replace(
          '<script type="module" src="/src/entry-client.tsx">',
          `<script type="module" src="/assets/${clientScriptPath}"></script>
           <script type="module" src="/assets/${appScriptPath}">`
        )
      
      // Add state context if needed (you might want to pass initial state to the client)
      html = html.replace(
        '</body>',
        `<script>window.__INITIAL_PATH__ = "${url}";</script></body>`
      )
      
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
      throw renderError // Re-throw to be caught by outer try-catch
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
        url: event.path
      }, null, 2)
    }
  }
}

export { handler } 