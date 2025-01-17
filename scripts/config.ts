import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Environment variables for Supabase configuration
export const supabaseUrl = process.env.VITE_SUPABASE_URL;
export const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing required environment variables. Please check your .env file.');
} 