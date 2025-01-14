import { supabase } from '../lib/supabase'

export interface SignUpData {
    email: string;
    firstName: string;
    lastName: string;
    linkedin?: string;
    expertise: string;
    experience: string;
}

export const signUpWithEmail = async (data: SignUpData) => {
    // First, create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: generateSecurePassword(), // We'll send this via email
        options: {
            data: {
                first_name: data.firstName,
                last_name: data.lastName,
            }
        }
    })

    if (authError) throw authError

    // Then, store additional user data in a profiles table
    const { error: profileError } = await supabase
        .from('profiles')
        .insert([
            {
                id: authData.user?.id,
                email: data.email,
                first_name: data.firstName,
                last_name: data.lastName,
                linkedin: data.linkedin,
                expertise: data.expertise,
                experience: data.experience,
                created_at: new Date().toISOString()
            }
        ])

    if (profileError) throw profileError

    return authData
}

// Helper function to generate a secure random password
function generateSecurePassword(): string {
    const length = 16
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
    let password = ''
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length)
        password += charset[randomIndex]
    }
    return password
} 