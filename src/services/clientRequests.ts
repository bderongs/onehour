import { supabase } from '../lib/supabase';
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

export interface CreateClientRequestData {
    sparkId: string;
    message?: string;
}

export const createClientRequest = async (data: CreateClientRequestData): Promise<ClientRequest> => {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
        throw new Error('User must be authenticated to create a request');
    }

    const { data: request, error } = await supabase
        .from('client_requests')
        .insert([
            {
                client_id: authData.user.id,
                spark_id: data.sparkId,
                message: data.message,
                status: 'pending'
            }
        ])
        .select()
        .single();

    if (error) {
        logger.error('Error creating client request:', error);
        throw error;
    }

    return transformClientRequestFromDB(request);
};

export const getClientRequestById = async (requestId: string): Promise<ClientRequest | null> => {
    const { data, error } = await supabase
        .from('client_requests')
        .select('*')
        .eq('id', requestId)
        .single();

    if (error) {
        logger.error('Error fetching client request:', error);
        return null;
    }

    return data ? transformClientRequestFromDB(data) : null;
};

export const getClientRequestsByClientId = async (clientId: string): Promise<ClientRequest[]> => {
    const { data, error } = await supabase
        .from('client_requests')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

    if (error) {
        logger.error('Error fetching client requests:', error);
        return [];
    }

    return data.map(transformClientRequestFromDB);
};

export const getClientRequestsBySparkId = async (sparkId: string): Promise<ClientRequest[]> => {
    const { data, error } = await supabase
        .from('client_requests')
        .select('*')
        .eq('spark_id', sparkId)
        .order('created_at', { ascending: false });

    if (error) {
        logger.error('Error fetching client requests:', error);
        return [];
    }

    return data.map(transformClientRequestFromDB);
};

export const updateClientRequestStatus = async (
    requestId: string,
    status: ClientRequest['status']
): Promise<ClientRequest | null> => {
    const { data, error } = await supabase
        .from('client_requests')
        .update({ status })
        .eq('id', requestId)
        .select()
        .single();

    if (error) {
        logger.error('Error updating client request:', error);
        return null;
    }

    return transformClientRequestFromDB(data);
};

// Transform database snake_case to camelCase
const transformClientRequestFromDB = (request: any): ClientRequest => ({
    id: request.id,
    clientId: request.client_id,
    sparkId: request.spark_id,
    status: request.status,
    message: request.message,
    createdAt: request.created_at,
    updatedAt: request.updated_at
}); 