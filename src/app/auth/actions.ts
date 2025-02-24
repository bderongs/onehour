'use server'

import { 
    signUpConsultantWithEmail as signUpConsultantServer,
    signUpClientWithEmail as signUpClientServer,
    checkEmailExists as checkEmailServer
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
        const result = await signUpClientServer(data)
        return { success: true, data: result }
    } catch (error) {
        logger.error('Error in client signup:', error)
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Failed to sign up' 
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