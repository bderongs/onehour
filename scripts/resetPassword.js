import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase configuration. Please check your .env file')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function resetPassword() {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail('matthieu@sparkier.io', {
            redirectTo: 'http://localhost:5173/auth/callback'
        })

        if (error) {
            console.error('Error sending reset email:', error.message)
            process.exit(1)
        }

        console.log('Password reset email sent successfully!')
    } catch (err) {
        console.error('Unexpected error:', err)
        process.exit(1)
    }
}

resetPassword() 