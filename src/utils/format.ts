/**
 * Format a duration interval into a human-readable string in French
 * @param duration Duration in minutes or ISO duration string
 */
export function formatDuration(duration: string | number): string {
    let minutes: number;
    
    if (typeof duration === 'string') {
        // Handle ISO duration string (e.g. "01:30:00" or "PT1H30M")
        if (duration.includes('PT')) {
            // Parse ISO 8601 duration
            const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
            if (!matches) return duration;
            
            const hours = parseInt(matches[1] || '0');
            const mins = parseInt(matches[2] || '0');
            minutes = hours * 60 + mins;
        } else if (duration.includes(':')) {
            // Parse HH:MM:SS format
            const [hours, mins] = duration.split(':').map(Number);
            minutes = hours * 60 + mins;
        } else {
            // Try parsing as number
            minutes = parseInt(duration);
            if (isNaN(minutes)) return duration;
        }
    } else {
        minutes = duration;
    }

    if (minutes < 60) {
        return `${minutes} min`;
    } else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (remainingMinutes === 0) {
            return hours === 1 ? '1 heure' : `${hours} heures`;
        } else {
            return `${hours}h${remainingMinutes.toString().padStart(2, '0')}`;
        }
    }
}

/**
 * Format a price in EUR with consistent styling
 * @param price Price in EUR (can be string or number)
 */
export function formatPrice(price: string | number | null | undefined): string {
    if (price === null || price === undefined || price === '') {
        return 'Prix sur demande';
    }

    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    if (isNaN(numericPrice)) {
        return 'Prix sur demande';
    }

    if (numericPrice === 0) {
        return 'Gratuit';
    }

    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(numericPrice);
}

/**
 * Format a date in French locale
 * @param date Date string or Date object
 */
export function formatDate(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(d);
} 