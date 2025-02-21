import { supabase } from '../src/lib/supabase';

async function resetPassword() {
    try {
        await supabase.auth.resetPasswordForEmail('matthieu@sparkier.io', {
            redirectTo: 'http://localhost:5173/auth/callback'
        });
        console.log('Password reset email sent successfully');
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
}

resetPassword();
