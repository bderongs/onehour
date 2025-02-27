import { createClient } from '@/lib/supabase/server';
import logger from '../utils/logger';

export interface ClientProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    company: string;
    roles: ("consultant" | "admin" | "client")[];
    createdAt: string;
    updatedAt: string;
}

// Transform database snake_case to camelCase
const transformClientFromDB = (dbClient: any): ClientProfile => ({
    id: dbClient.id,
    email: dbClient.email,
    firstName: dbClient.first_name,
    lastName: dbClient.last_name,
    company: dbClient.company,
    roles: dbClient.roles,
    createdAt: dbClient.created_at,
    updatedAt: dbClient.updated_at,
});

export const getClientById = async (id: string): Promise<ClientProfile | null> => {
    const client = await createClient();
    const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', id)
        .eq('roles', ['client'])
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return null;
        }
        logger.error('Error fetching client:', error);
        throw error;
    }

    return data ? transformClientFromDB(data) : null;
};

export const getAllClients = async (): Promise<ClientProfile[]> => {
    const client = await createClient();
    const { data, error } = await client
        .from('profiles')
        .select('*')
        .contains('roles', ['client'])
        .order('created_at', { ascending: false });

    if (error) {
        logger.error('Error fetching clients:', error);
        throw error;
    }

    return data.map(transformClientFromDB);
};

export async function deleteClient(clientId: string): Promise<boolean> {
    try {
        const client = await createClient();
        // Delete client's profile
        const { error: profileError } = await client
            .from('profiles')
            .delete()
            .eq('id', clientId)
            .contains('roles', ['client']);

        if (profileError) {
            logger.error('Error deleting client profile:', profileError);
            return false;
        }

        return true;
    } catch (error) {
        logger.error('Error in deleteClient:', error);
        return false;
    }
}

export const updateClient = async (id: string, updates: Partial<ClientProfile>): Promise<ClientProfile> => {
    const client = await createClient();
    
    // Convert camelCase to snake_case for database
    const dbUpdates: Record<string, any> = {};
    if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName;
    if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName;
    if (updates.company !== undefined) dbUpdates.company = updates.company;
    if (updates.roles !== undefined) dbUpdates.roles = updates.roles;
    
    const { data, error } = await client
        .from('profiles')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        logger.error('Error updating client:', error);
        throw error;
    }

    return transformClientFromDB(data);
}; 