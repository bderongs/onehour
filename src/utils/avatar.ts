/**
 * Convertit un tableau d'octets en chaîne hexadécimale
 */
const bytesToHex = (bytes: Uint8Array): string => {
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
};

/**
 * Génère une URL d'avatar Dicebear
 * @param id - Identifiant à utiliser comme seed (UUID)
 * @param size - Taille de l'avatar en pixels
 * @returns URL de l'avatar Dicebear
 */
export const getDefaultAvatarUrl = (id: string, size: number = 128): string => {
    return `https://api.dicebear.com/7.x/shapes/svg?seed=${id}&size=${size}&backgroundColor=0052cc`;
}; 