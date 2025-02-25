import { createClient } from '@/lib/supabase/server';
import logger from '../utils/logger';

// Extract file path from Supabase URL
const getFilePathFromUrl = (url: string): string | null => {
    try {
        // Extract the path after 'public/'
        const matches = url.match(/public\/profiles\/([^?#]+)/);
        return matches ? matches[1] : null;
    } catch (e) {
        logger.error('Impossible de parser l\'URL:', e);
        return null;
    }
};

// Delete an image from storage using its file path
export const deleteImage = async (filePath: string): Promise<void> => {
    try {
        logger.debug('Attempting to delete file:', filePath);
        const client = await createClient();
        const { error } = await client.storage
            .from('profiles')
            .remove([filePath]);

        if (error) {
            logger.error('Impossible de supprimer l\'image:', error);
            logger.error('Error details:', {
                message: error.message,
                name: error.name
            });
            throw new Error(`Erreur lors de la suppression de l'image: ${error.message}`);
        } else {
            logger.debug('Successfully deleted file:', filePath);
        }
    } catch (error) {
        logger.error('Erreur lors de la suppression de l\'image:', error);
        throw error;
    }
};

// Server-side functions for storage operations
export const deleteProfileImage = async (imageUrl: string): Promise<void> => {
    const filePath = getFilePathFromUrl(imageUrl);
    if (!filePath) {
        throw new Error('Invalid image URL format');
    }
    await deleteImage(filePath);
};

const getSparkImagePathFromUrl = (url: string): string | null => {
    try {
        // Extract the path after 'public/'
        const matches = url.match(/public\/sparks\/([^?#]+)/);
        return matches ? matches[1] : null;
    } catch (e) {
        logger.error('Impossible de parser l\'URL du spark:', e);
        return null;
    }
};

const deleteSparkImageFromStorage = async (filePath: string): Promise<void> => {
    try {
        logger.debug('Attempting to delete spark image:', filePath);
        const client = await createClient();
        const { error } = await client.storage
            .from('sparks')
            .remove([filePath]);

        if (error) {
            logger.error('Impossible de supprimer l\'image du spark:', error);
            throw new Error(`Erreur lors de la suppression de l'image du spark: ${error.message}`);
        } else {
            logger.debug('Successfully deleted spark image:', filePath);
        }
    } catch (error) {
        logger.error('Erreur lors de la suppression de l\'image du spark:', error);
        throw error;
    }
};

export const deleteSparkImage = async (imageUrl: string): Promise<void> => {
    const filePath = getSparkImagePathFromUrl(imageUrl);
    if (!filePath) {
        throw new Error('Invalid spark image URL format');
    }
    await deleteSparkImageFromStorage(filePath);
};

export const deleteFile = async (bucket: string, path: string): Promise<void> => {
    try {
        const client = await createClient();
        const { error } = await client.storage
            .from(bucket)
            .remove([path]);

        if (error) {
            logger.error(`Impossible de supprimer le fichier du bucket ${bucket}:`, error);
            throw error;
        }
    } catch (error) {
        logger.error(`Erreur lors de la suppression du fichier du bucket ${bucket}:`, error);
        throw error;
    }
};

export const getPublicUrl = async (bucket: string, path: string): Promise<string> => {
    const client = await createClient();
    const { data } = client.storage
        .from(bucket)
        .getPublicUrl(path);

    return data.publicUrl;
}; 