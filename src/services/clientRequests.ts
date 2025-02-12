import { supabase } from '../lib/supabase';
import logger from '../utils/logger';
import type { SupabaseClient } from '@supabase/supabase-js';

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
    clientId?: string; // Optional clientId for admin operations
}

export const createClientRequest = async (
    data: CreateClientRequestData,
    client: SupabaseClient = supabase // Default to regular client if none provided
): Promise<ClientRequest> => {
    logger.info('Starting client request creation', { data });
    
    let userId: string;
    
    if (data.clientId) {
        // If clientId is provided, use it (admin operation)
        userId = data.clientId;
        logger.info('Using provided clientId for request creation', { clientId: userId });
    } else {
        // Otherwise get the current user's ID
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData.user) {
            logger.error('Authentication error in createClientRequest', { authError });
            throw new Error('User must be authenticated to create a request');
        }
        userId = authData.user.id;
        logger.info('Using authenticated user ID for request creation', { userId });
    }

    const { data: request, error } = await client
        .from('client_requests')
        .insert([
            {
                client_id: userId,
                spark_id: data.sparkId,
                message: data.message,
                status: 'pending'
            }
        ])
        .select()
        .single();

    if (error) {
        logger.error('Database error in createClientRequest', { error });
        throw error;
    }

    logger.info('Client request created successfully', { requestId: request.id });
    return transformClientRequestFromDB(request);
};

export const getClientRequestById = async (requestId: string): Promise<ClientRequest | null> => {
    logger.info('Fetching client request by ID', { requestId });
    
    // Check authentication first
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
        logger.error('Authentication error in getClientRequestById', { authError });
        return null;
    }
    
    logger.info('User authenticated, fetching request', { userId: authData.user.id });

    const { data, error } = await supabase
        .from('client_requests')
        .select('*')
        .eq('id', requestId)
        .single();

    if (error) {
        logger.error('Database error in getClientRequestById', { error });
        return null;
    }

    if (!data) {
        logger.info('No request found with ID', { requestId });
        return null;
    }

    logger.info('Client request found', { requestId });
    return transformClientRequestFromDB(data);
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

export const updateClientRequestMessage = async (
    requestId: string,
    message: string
): Promise<ClientRequest | null> => {
    const { data, error } = await supabase
        .from('client_requests')
        .update({ message })
        .eq('id', requestId)
        .select()
        .single();

    if (error) {
        logger.error('Error updating client request message:', error);
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