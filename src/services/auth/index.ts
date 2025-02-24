export * from './types';
export * from './server';

// Re-export only the client-side functions when used in the browser
export { getCurrentUser, signOut } from './client'; 