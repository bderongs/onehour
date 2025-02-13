import { supabase } from '../lib/supabase';

export interface ClientProfile {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    company: string;
    roles: string[];
    created_at: string;
    updated_at: string;
}

export async function getAllClients(includeSparkierEmails: boolean = false): Promise<ClientProfile[]> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .contains('roles', ['client']);

    if (error) {
        console.error('Error fetching all clients:', error);
        return [];
    }

    const clients = data as ClientProfile[];
    
    if (!includeSparkierEmails) {
        return clients.filter(c => !c.email.endsWith('@sparkier.io'));
    }

    return clients;
}

export async function deleteClient(clientId: string): Promise<boolean> {
    try {
        // Delete client's profile
        const { error: profileError } = await supabase
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