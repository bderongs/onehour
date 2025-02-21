const isDevelopment = process.env.NODE_ENV === 'development';

console.log('Logger initialized with NODE_ENV:', process.env.NODE_ENV);

const logger = {
  log: (...args: any[]) => {
    console.log('[LOG]', ...args);
  },
  info: (...args: any[]) => {
    console.info('[INFO]', ...args);
  },
  warn: (...args: any[]) => {
    console.warn('[WARN]', ...args);
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  },
  debug: (...args: any[]) => {
    console.debug('[DEBUG]', ...args);
  },
};

// Log the environment state
console.log('Current NODE_ENV:', process.env.NODE_ENV);
console.log('isDevelopment:', isDevelopment);

export default logger; 