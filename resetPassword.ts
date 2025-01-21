import { supabase } from './src/lib/supabase'; await supabase.auth.resetPasswordForEmail('matthieu@sparkier.io', { redirectTo: 'http://localhost:5173/auth/callback' });
