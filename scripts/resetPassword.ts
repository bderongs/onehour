import { createClient } from '../src/lib/supabase/client';
import logger from '../src/utils/logger';

async function resetPassword() {
    try {
        const supabase = createClient();
        await supabase.auth.resetPasswordForEmail('matthieu@sparkier.io', {
            redirectTo: 'http://localhost:5173/auth/callback'
        });
        logger.info('Password reset email sent successfully');
    } catch (error) {
        logger.error('Error sending password reset email:', error);
    }
}

resetPassword();
