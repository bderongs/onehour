import { Handler } from '@netlify/functions'
import fs from 'fs'
import path from 'path'

const handler: Handler = async (event) => {
  try {
    console.log('Render function called with path:', event.path)
    console.log('Current working directory:', process.cwd())
    console.log('Directory contents:', fs.readdirSync(process.cwd()))

    // Get the template from the published client directory
    const template = fs.readFileSync(path.join(process.cwd(), 'dist/client/index.html'), 'utf-8')
    console.log('Template loaded successfully')
    
    // Read the CSS file
    let styleContent = ''
    try {
      styleContent = fs.readFileSync(path.join(process.cwd(), 'dist/client/assets/index.css'), 'utf-8')
      console.log('CSS loaded successfully')
    } catch (e) {
      console.warn('Could not load CSS file:', e)
    }
    
    // Import the server entry point
    // @ts-expect-error - This file will exist at runtime after the build
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