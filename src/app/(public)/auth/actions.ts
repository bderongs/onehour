'use server'

import { 
    signUpConsultantWithEmail as signUpConsultantServer,
    signUpClientWithEmail as signUpClientServer,
    checkEmailExists as checkEmailServer,
    deleteUser as deleteUserServer
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