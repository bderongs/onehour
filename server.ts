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
  isProd = process.env.NODE_ENV === 'production'
) {
  const app = express()

  let vite: any
  
  if (!isProd) {
    // Create Vite server in middleware mode and configure the app type
    vite = await createViteServer({
      root,
      logLevel: 'info',
      server: {
        middlewareMode: true,
        watch: {
          usePolling: true,
          interval: 100
        }
      },
      appType: 'custom',
      optimizeDeps: {
        include: [
          'react',
          'react-dom',
          'react-dom/server',
          'react-router-dom',
          'react-helmet-async'
        ]
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

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl

    try {
      let template: string
      let render: (url: string) => Promise<string>

      if (!isProd) {
        // Always read fresh template in development
        template = fs.readFileSync(path.resolve('index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)

        // Load the server entry. vite.ssrLoadModule automatically transforms
        // your ESM source code to be usable in Node.js!
        const { render: ssrRender } = await vite.ssrLoadModule('/src/entry-server.tsx')
        render = ssrRender
      } else {
        template = fs.readFileSync(path.resolve('dist/client/index.html'), 'utf-8')
        const { render: ssrRender } = await import('./dist/server/entry-server.js')
        render = ssrRender
      }

      try {
        const appHtml = await render(url)
        const html = template.replace(`<!--app-html-->`, appHtml)

        res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
      } catch (e) {
        // If an error is caught, let Vite fix the stack trace so it maps back to
        // your actual source code.
        vite?.ssrFixStacktrace(e as Error)
        next(e)
      }
    } catch (e) {
      vite?.ssrFixStacktrace(e as Error)
      next(e)
    }
  })

  return { app }
}

createServer().then(({ app }) => {
  app.listen(5173, () => {
    console.log('Server running at http://localhost:5173')
  })
}) 