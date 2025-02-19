import { Handler } from '@netlify/functions'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const handler: Handler = async (event) => {
  try {
    // Get the template from the published client directory
    const template = fs.readFileSync(path.join(process.cwd(), 'dist/client/index.html'), 'utf-8')
    
    // Import the server entry point from the functions directory
    // @ts-expect-error - This file will exist at runtime after the build
    const { render } = await import('../server/entry-server.js')
    
    // Render the app
    const appHtml = await render(event.path)
    
    // Replace the placeholder with the app HTML
    const html = template.replace('<!--app-html-->', appHtml)
    
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
      body: 'Internal Server Error',
    }
  }
}

export { handler } 