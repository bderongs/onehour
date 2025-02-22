import { supabase } from '@/lib/supabase';
import logger from '../utils/logger';

export interface ClientProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    company: string;
    roles: string[];
    createdAt: string;
    updatedAt: string;
}

// Transform database snake_case to camelCase
const transformClientFromDB = (data: any): ClientProfile => ({
    id: data.id,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    company: data.company,
    roles: data.roles,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
});

export const getClientById = async (id: string): Promise<ClientProfile | null> => {
    const client = supabase();
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
    const client = supabase();
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
        const client = supabase();
        // Delete client's profile
        const { error: profileError } = await client
            .from('profiles')
            .delete()
            .eq('id', clientId)
            .contains('roles', ['client']);

        if (profileError) {
            console.error('Error deleting client profile:', profileError);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in deleteClient:', error);
        return false;
    }
} 