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
      
      // Inject the CSS and app HTML
      const html = template
        .replace('</head>', `<style>${styleContent}</style></head>`)
        .replace('<!--app-html-->', appHtml)
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/html',
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