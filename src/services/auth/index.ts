// Shared types used by both client and server
export * from './types';

// Client-side auth operations - safe to use in components
export {
    getCurrentUser,
    signOut,
} from './client';

// Re-export server-side functions needed by client components
export { checkEmailExists, deleteUser } from './server';

// Note: Server-side functions should be imported directly from './server'
// They cannot be used in client components 