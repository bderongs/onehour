'use server'

import { updateUserRoles } from '@/services/auth/server'
import type { UserRole } from '@/services/auth/types'
import logger from '@/utils/logger'

export async function updateRoles(userId: string, newRoles: UserRole[], currentRoles: UserRole[]) {
    try {
        await updateUserRoles(userId, newRoles, currentRoles)
        return { success: true }
    } catch (error) {
        logger.error('Error updating user roles:', error)
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Failed to update roles' 
        }
    }
} 