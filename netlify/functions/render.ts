import { Handler } from '@netlify/functions'
import fs from 'fs'
import path from 'path'

const handler: Handler = async (event) => {
  try {
    console.log('Render function called with path:', event.path)
    console.log('Current working directory:', process.cwd())
    console.log('Directory contents:', fs.readdirSync(process.cwd()))

    // Get the template from the published client directory
    let template: string
    try {
      // Try the production path first
      template = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8')
      console.log('Template loaded from root successfully')
    } catch (e) {
      // Fall back to development path
      template = fs.readFileSync(path.join(process.cwd(), 'dist/client/index.html'), 'utf-8')
      console.log('Template loaded from dist/client successfully')
    }
    
    // Read the CSS file
    let styleContent = ''
    try {
      // Try the production path first
      styleContent = fs.readFileSync(path.join(process.cwd(), 'assets/index.css'), 'utf-8')
      console.log('CSS loaded from root successfully')
    } catch (e) {
      try {
        // Fall back to development path
        styleContent = fs.readFileSync(path.join(process.cwd(), 'dist/client/assets/index.css'), 'utf-8')
        console.log('CSS loaded from dist/client successfully')
      } catch (cssError) {
        console.warn('Could not load CSS file:', cssError)
      }
    }
    
    // Import the server entry point
    // @ts-ignore - This file is generated during build
    const { render } = await import('./entry-server.js')
    console.log('Server entry point loaded successfully')
    
    // Render the app
    const appHtml = await render(event.path || '/')
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
  } catch (error) {
    console.error('Render error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        cwd: process.cwd(),
        files: fs.existsSync(process.cwd()) ? fs.readdirSync(process.cwd()) : []
      })
    }
  }
}

export { handler } 