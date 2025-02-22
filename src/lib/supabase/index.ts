// Re-export the client utilities
export { createClient as createServerClient } from './server'
export { createClient as createBrowserClient } from './client'
export { createClient as createMiddlewareClient } from './middleware'

// Helper to check if we're on the server side
export const isServer = () => typeof window === 'undefined'

// Get the appropriate client based on the context
export const createClient = () => {
  if (isServer()) {
    const { createClient } = require('./server')
    return createClient()
  }
  const { createClient } = require('./client')
  return createClient()
} 