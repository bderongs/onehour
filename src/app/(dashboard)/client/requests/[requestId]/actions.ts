'use server';

import { createClient } from '@/lib/supabase/server';
import logger from '@/utils/logger';
import type { ClientRequest } from '@/services/clientRequests';
import type { Spark } from '@/types/spark';

// Get a client request by ID
export async function getClientRequestById(id: string): Promise<ClientRequest | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
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
  } catch (error) {
    logger.error('Error in getClientRequestById server action:', error);
    throw error;
  }
}

// Get a spark by ID
export async function getSparkById(id: string): Promise<Spark | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('sparks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      logger.error('Error fetching spark by ID:', error);
      return null;
    }

    return data ? transformSparkFromDB(data) : null;
  } catch (error) {
    logger.error('Error in getSparkById server action:', error);
    return null;
  }
}

// Update a client request
export async function updateClientRequest(id: string, updates: Partial<ClientRequest>): Promise<ClientRequest> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
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
  } catch (error) {
    logger.error('Error in updateClientRequest server action:', error);
    throw error;
  }
}

// Helper functions for data transformation
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

// Convert database snake_case to camelCase for frontend
const transformSparkFromDB = (dbSpark: any): Spark => ({
  id: dbSpark.id,
  title: dbSpark.title,
  duration: dbSpark.duration,
  price: dbSpark.price,
  description: dbSpark.description,
  benefits: dbSpark.benefits,
  prefillText: dbSpark.prefill_text,
  highlight: dbSpark.highlight,
  consultant: dbSpark.consultant,
  slug: dbSpark.slug,
  detailedDescription: dbSpark.detailed_description,
  methodology: dbSpark.methodology,
  targetAudience: dbSpark.target_audience,
  prerequisites: dbSpark.prerequisites,
  deliverables: dbSpark.deliverables,
  expertProfile: dbSpark.expert_profile,
  faq: dbSpark.faq,
  nextSteps: dbSpark.next_steps,
  imageUrl: dbSpark.image_url,
  socialImageUrl: dbSpark.social_image_url,
  createdAt: dbSpark.created_at,
  updatedAt: dbSpark.updated_at,
}); 