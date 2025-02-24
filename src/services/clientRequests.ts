import { createClient } from '@/lib/supabase/server';
import logger from '../utils/logger';

export interface ClientRequest {
    id: string;
    clientId: string;
    sparkId: string;
    status: 'pending' | 'accepted' | 'rejected' | 'completed';
    message?: string;
    createdAt: string;
    updatedAt: string;
}

// Transform database snake_case to camelCase
const transformRequestFromDB = (data: any): ClientRequest => ({
    id: data.id,
    clientId: data.client_id,
    sparkId: data.spark_id,
    status: data.status,
    message: data.message,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
});

// Transform camelCase to database snake_case
const transformRequestToDB = (data: Pick<ClientRequest, 'clientId' | 'sparkId' | 'status' | 'message'>) => ({
    client_id: data.clientId,
    spark_id: data.sparkId,
    status: data.status,
    message: data.message,
});

export const createClientRequest = async (request: Omit<ClientRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<ClientRequest> => {
    const client = await createClient();
    const { data, error } = await client
        .from('client_requests')
        .insert([{
            client_id: request.clientId,
            spark_id: request.sparkId,
            status: request.status,
            message: request.message,
        }])
        .select()
        .single();

    if (error) {
        logger.error('Error creating client request:', error);
        throw error;
    }

    return transformRequestFromDB(data);
};

export const updateClientRequest = async (id: string, updates: Partial<ClientRequest>): Promise<ClientRequest> => {
    const client = await createClient();
    const { data, error } = await client
        .from('client_requests')
        .update({
            status: updates.status,
            message: updates.message,
        })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        logger.error('Error updating client request:', error);
        throw error;
    }

    return transformRequestFromDB(data);
};

export const deleteClientRequest = async (id: string): Promise<void> => {
    const client = await createClient();
    const { error } = await client
        .from('client_requests')
        .delete()
        .eq('id', id);

    if (error) {
        logger.error('Error deleting client request:', error);
        throw error;
    }
};

export const getClientRequestById = async (id: string): Promise<ClientRequest | null> => {
    const client = await createClient();
    const { data, error } = await client
        .from('client_requests')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return null;
        }
        logger.error('Error fetching client request:', error);
        throw error;
    }

    return data ? transformRequestFromDB(data) : null;
};

export const getClientRequestsByClientId = async (clientId: string): Promise<ClientRequest[]> => {
    const client = await createClient();
    const { data, error } = await client
        .from('client_requests')
        .select('*')
        .eq('client_id', clientId);

    if (error) {
        logger.error('Error fetching client requests:', error);
        throw error;
    }

    return data.map(transformRequestFromDB);
};

export const getClientRequestsBySparkId = async (sparkId: string): Promise<ClientRequest[]> => {
    const client = await createClient();
    const { data, error } = await client
        .from('client_requests')
        .select('*')
        .eq('spark_id', sparkId);

    if (error) {
        logger.error('Error fetching spark requests:', error);
        throw error;
    }

    return data.map(transformRequestFromDB);
}; 