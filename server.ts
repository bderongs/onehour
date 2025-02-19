import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import compression from 'compression'
import sirv from 'sirv'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() === 'production' : false
) {
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('isProd:', isProd);
  
  const app = express()

  let vite: any
  
  if (!isProd) {
    // Create Vite server in middleware mode and configure the app type
    vite = await createViteServer({
      root,
      server: { middlewareMode: true },
      appType: 'custom',
      optimizeDeps: {
        include: ['tailwindcss']
      }
    })
    // Use vite's connect instance as middleware
    app.use(vite.middlewares)
  } else {
    app.use(compression())
    app.use(
      sirv('dist/client', {
        gzip: true
      })
    )
  }

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl

      let template: string
      let render: (url: string) => Promise<string>
      let styleTag = ''

      if (!isProd) {
        // Always read fresh template in development
        template = fs.readFileSync(path.resolve('index.html'), 'utf-8')

        // Process and inject Tailwind CSS before transforming HTML
        try {
          const cssModules = await vite.ssrLoadModule('/src/index.css')
          if (cssModules.default) {
            styleTag = `<style type="text/css">${cssModules.default}</style>`
          }
        } catch (e) {
          console.error('Error loading CSS:', e)
        }

        // Inject the style tag right after the last meta tag or before </head>
        template = template.replace(
          /<\/head>/,
          `${styleTag}</head>`
        )

        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
      } else {
        template = fs.readFileSync(path.resolve('dist/client/index.html'), 'utf-8')
        render = (await import(path.resolve('dist/server/entry-server.js'))).render
      }

      const appHtml = await render(url)
      
      // Inject the app HTML
      let html = template.replace(`<!--app-html-->`, appHtml)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e: any) {
      !isProd && vite.ssrFixStacktrace(e)
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  })

  return { app }
}

createServer().then(({ app }) => {
  app.listen(5173, () => {
    console.log('Server running at http://localhost:5173')
  })
}) 