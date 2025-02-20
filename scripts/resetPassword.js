import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

if (!supabaseUrl || !supabaseAnonKey || !siteUrl) {
    console.error('Missing Supabase configuration or site URL. Please check your .env.local file')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function resetPassword() {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail('matthieu@sparkier.io', {
            redirectTo: `${siteUrl}/auth/callback`
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