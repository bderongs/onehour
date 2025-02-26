'use server'

import { 
    signUpConsultantWithEmail as signUpConsultantServer,
    signUpClientWithEmail as signUpClientServer,
    checkEmailExists as checkEmailServer,
    deleteUser as deleteUserServer,
    testSupabaseConnection as testSupabaseConnectionServer
} from '@/services/auth/server'
import type { ConsultantSignUpData, ClientSignUpData } from '@/services/auth/types'
import logger from '@/utils/logger'

export async function signUpConsultant(data: ConsultantSignUpData) {
    try {
        const result = await signUpConsultantServer(data)
        return { success: true, data: result }
    } catch (error) {
        logger.error('Error in consultant signup:', error)
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Failed to sign up' 
        }
    }
}

export async function signUpClient(data: ClientSignUpData) {
    try {
        // Log the data being sent to help with debugging
        logger.info('Attempting client signup with data:', { 
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            // Don't log sensitive data
            hasCompany: !!data.company,
            hasCompanyRole: !!data.companyRole,
            hasSparkUrlSlug: !!data.sparkUrlSlug
        })
        
        // Validate required fields
        if (!data.email || !data.firstName || !data.lastName || !data.company || !data.companyRole) {
            logger.error('Missing required fields for client signup')
            return { 
                success: false, 
                error: 'All fields are required' 
            }
        }
        
        try {
            const result = await signUpClientServer(data)
            logger.info('Client signup successful')
            return { success: true, data: result }
        } catch (serverError) {
            // Log the detailed server error
            logger.error('Server error in client signup:', serverError)
            
            // Return a more specific error message
            const errorMessage = serverError instanceof Error 
                ? serverError.message 
                : 'Failed to sign up';
                
            // Check for specific error types
            if (errorMessage.includes('Auth error')) {
                return { 
                    success: false, 
                    error: 'Authentication error during signup. Please try again.' 
                }
            } else if (errorMessage.includes('Profile error')) {
                return { 
                    success: false, 
                    error: 'Error creating user profile. Please try again.' 
                }
            } else if (errorMessage.includes('Password')) {
                return { 
                    success: false, 
                    error: 'Error with password requirements. Please try again.' 
                }
            }
            
            // Return the original error message
            return { 
                success: false, 
                error: errorMessage
            }
        }
    } catch (error) {
        // This catches any other errors in the outer try block
        logger.error('Unexpected error in client signup action:', error)
        return { 
            success: false, 
            error: error instanceof Error 
                ? `Unexpected error: ${error.message}` 
                : 'An unexpected error occurred during signup'
        }
    }
}

export async function checkEmail(email: string) {
    try {
        const exists = await checkEmailServer(email)
        return { success: true, exists }
    } catch (error) {
        logger.error('Error checking email:', error)
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Failed to check email',
            exists: false
        }
    }
}

export async function checkEmailExistsAction(email: string): Promise<boolean> {
    try {
        return await checkEmailServer(email)
    } catch (error) {
        logger.error('Error in checkEmailExistsAction:', error)
        throw error
    }
}

export async function deleteUserAction(userId: string): Promise<void> {
    try {
        return await deleteUserServer(userId)
    } catch (error) {
        logger.error('Error in deleteUserAction:', error)
        throw error
    }
}

export async function testSupabaseConnection() {
    try {
        const result = await testSupabaseConnectionServer()
        return { success: result }
    } catch (error) {
        logger.error('Error testing Supabase connection:', error)
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Failed to test Supabase connection' 
        }
    }
} 