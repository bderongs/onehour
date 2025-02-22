import { createClient } from '@/lib/supabase';
import logger from '../utils/logger';

const MAX_WIDTH = 800;  // Maximum width for profile pictures
const MAX_HEIGHT = 1200; // Maximum height for profile pictures
const QUALITY = 0.8;    // Image quality (0.8 = 80% quality, good balance between quality and file size)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB max file size

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
const deleteImage = async (filePath: string): Promise<void> => {
    try {
        logger.debug('Attempting to delete file:', filePath);
        const client = createClient();
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

// Format file size for display
const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Check browser support for required features
const checkBrowserSupport = () => {
    const features = {
        canvas: !!document.createElement('canvas').getContext,
        blobConstructor: !!window.Blob,
        createObjectURL: !!window.URL?.createObjectURL,
        fileReader: !!window.FileReader
    };
    return features;
};

const optimizeImage = async (file: File): Promise<Blob> => {
    // Check file size first
    if (file.size > MAX_FILE_SIZE) {
        throw new Error(`L'image est trop volumineuse (${formatFileSize(file.size)}). La taille maximum autorisée est de ${formatFileSize(MAX_FILE_SIZE)}.`);
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
        throw new Error('Le fichier doit être une image (JPG, PNG, etc.)');
    }

    // Check browser support
    const support = checkBrowserSupport();
    if (!support.canvas || !support.blobConstructor) {
        logger.warn('Browser does not support image optimization, uploading original file');
        return file;
    }

    let objectUrl: string | null = null;

    return new Promise((resolve, reject) => {
        const img = new Image();
        
        // Security: prevent potential canvas taint
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
            try {
                // Calculate new dimensions while maintaining aspect ratio
                let width = img.width;
                let height = img.height;
                
                if (width > MAX_WIDTH) {
                    height = Math.round(height * (MAX_WIDTH / width));
                    width = MAX_WIDTH;
                }
                if (height > MAX_HEIGHT) {
                    width = Math.round(width * (MAX_HEIGHT / height));
                    height = MAX_HEIGHT;
                }

                // Create canvas and resize image
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    throw new Error('Erreur lors de la création du canvas');
                }
                
                // Use better quality scaling algorithm where supported
                try {
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                } catch (e) {
                    logger.warn('Advanced image smoothing not supported in this browser');
                }
                
                // Draw and compress image
                ctx.drawImage(img, 0, 0, width, height);
                
                // Try to use toBlob, fallback to toDataURL if not supported
                if (canvas.toBlob) {
                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                // Check if optimization actually reduced the size
                                if (blob.size > file.size) {
                                    logger.warn('Optimized image is larger than original, using original file');
                                    resolve(file);
                                } else {
                                    resolve(blob);
                                }
                            } else {
                                throw new Error('Erreur lors de la conversion de l\'image');
                            }
                        },
                        'image/jpeg',
                        QUALITY
                    );
                } else {
                    // Fallback for older browsers
                    try {
                        const dataUrl = canvas.toDataURL('image/jpeg', QUALITY);
                        const byteString = atob(dataUrl.split(',')[1]);
                        const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
                        const ab = new ArrayBuffer(byteString.length);
                        const ia = new Uint8Array(ab);
                        
                        for (let i = 0; i < byteString.length; i++) {
                            ia[i] = byteString.charCodeAt(i);
                        }
                        
                        const blob = new Blob([ab], { type: mimeString });
                        // Check if optimization actually reduced the size
                        if (blob.size > file.size) {
                            logger.warn('Optimized image is larger than original, using original file');
                            resolve(file);
                        } else {
                            resolve(blob);
                        }
                    } catch (e) {
                        logger.warn('Fallback conversion failed, uploading original file');
                        resolve(file);
                    }
                }
            } catch (e) {
                reject(e);
            }
        };
        
        img.onerror = () => {
            reject(new Error('Impossible de charger l\'image. Vérifiez que le fichier est une image valide.'));
        };

        // Use FileReader as a fallback if createObjectURL is not supported
        try {
            if (support.createObjectURL) {
                objectUrl = URL.createObjectURL(file);
                img.src = objectUrl;
            } else if (support.fileReader) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    img.src = e.target?.result as string;
                };
                reader.onerror = () => {
                    reject(new Error('Erreur lors de la lecture du fichier'));
                };
                reader.readAsDataURL(file);
            } else {
                reject(new Error('Votre navigateur ne supporte pas le chargement d\'images'));
            }
        } catch (e) {
            reject(new Error('Erreur lors du chargement de l\'image'));
        }
    });
};

export const uploadProfileImage = async (file: File, userId: string, oldImageUrl?: string): Promise<{ publicUrl: string; filePath: string }> => {
    let objectUrl: string | null = null;
    
    try {
        // Optimize image before upload
        const optimizedImageBlob = await optimizeImage(file);
        
        const fileExt = 'jpg';
        const fileName = `user_${userId}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `profile-images/${fileName}`;

        // Delete old image if URL is provided
        if (oldImageUrl) {
            const oldPath = getFilePathFromUrl(oldImageUrl);
            if (oldPath) {
                await deleteImage(oldPath);
            } else {
                logger.warn('Could not extract file path from URL:', oldImageUrl);
            }
        }

        const client = createClient();
        const { error: uploadError } = await client.storage
            .from('profiles')
            .upload(filePath, optimizedImageBlob, {
                cacheControl: '3600',
                upsert: true,
                contentType: 'image/jpeg'
            });

        if (uploadError) {
            throw new Error('Erreur lors de l\'upload : ' + uploadError.message);
        }

        // Get the public URL
        const { data: { publicUrl } } = client.storage
            .from('profiles')
            .getPublicUrl(filePath);

        // Return both the public URL and the file path
        return { publicUrl, filePath };
    } finally {
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
        }
    }
};

// Delete profile image using URL
export const deleteProfileImage = async (imageUrl: string): Promise<void> => {
    if (!imageUrl) return;
    
    const filePath = getFilePathFromUrl(imageUrl);
    if (!filePath) {
        logger.warn('Could not extract file path from URL:', imageUrl);
        return;
    }
    
    await deleteImage(filePath);
};

// Extract file path from Supabase URL for Spark images
const getSparkImagePathFromUrl = (url: string): string | null => {
    try {
        // Extract the path after 'public/'
        const matches = url.match(/public\/sparks\/([^?#]+)/);
        return matches ? matches[1] : null;
    } catch (e) {
        logger.error('Impossible de parser l\'URL:', e);
        return null;
    }
};

// Delete a Spark image from storage using its file path
const deleteSparkImageFromStorage = async (filePath: string): Promise<void> => {
    try {
        logger.debug('Attempting to delete Spark image:', filePath);
        const client = createClient();
        const { error } = await client.storage
            .from('sparks')
            .remove([filePath]);

        if (error) {
            logger.error('Impossible de supprimer l\'image:', error);
            logger.error('Error details:', {
                message: error.message,
                name: error.name
            });
            throw new Error(`Erreur lors de la suppression de l'image: ${error.message}`);
        } else {
            logger.debug('Successfully deleted Spark image:', filePath);
        }
    } catch (error) {
        logger.error('Erreur lors de la suppression de l\'image:', error);
        throw error;
    }
};

export const uploadSparkImage = async (file: File, sparkId: string, oldImageUrl?: string): Promise<{ publicUrl: string; filePath: string }> => {
    let objectUrl: string | null = null;
    
    try {
        // Optimize image before upload - using same optimization function as profile images
        const optimizedImageBlob = await optimizeImage(file);
        
        const fileExt = 'jpg';
        const fileName = `spark_${sparkId}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `social-images/${fileName}`;

        // Delete old image if URL is provided
        if (oldImageUrl) {
            const oldPath = getSparkImagePathFromUrl(oldImageUrl);
            if (oldPath) {
                await deleteSparkImageFromStorage(oldPath);
            } else {
                logger.warn('Could not extract file path from URL:', oldImageUrl);
            }
        }

        const client = createClient();
        const { error: uploadError } = await client.storage
            .from('sparks')
            .upload(filePath, optimizedImageBlob, {
                cacheControl: '3600',
                upsert: true,
                contentType: 'image/jpeg'
            });

        if (uploadError) {
            throw new Error('Erreur lors de l\'upload : ' + uploadError.message);
        }

        // Get the public URL
        const { data: { publicUrl } } = client.storage
            .from('sparks')
            .getPublicUrl(filePath);

        // Return both the public URL and the file path
        return { publicUrl, filePath };
    } finally {
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
        }
    }
};

// Delete Spark image using URL
export const deleteSparkImage = async (imageUrl: string): Promise<void> => {
    if (!imageUrl) return;
    
    const filePath = getSparkImagePathFromUrl(imageUrl);
    if (!filePath) {
        logger.warn('Could not extract file path from URL:', imageUrl);
        return;
    }
    
    await deleteSparkImageFromStorage(filePath);
}; 
