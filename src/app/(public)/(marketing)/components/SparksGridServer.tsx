/**
 * SparksGridServer Component (Server Component)
 * 
 * This server component generates availability dates on the server side
 * and passes them to the client-side SparksGrid component.
 * This ensures consistent rendering between server and client,
 * preventing hydration mismatches.
 * 
 * Note: This is a Server Component (no 'use client' directive)
 */

import { Spark } from '@/types/spark';
import { SparksGrid } from './SparksGrid';

// Utility function to get a deterministic business date based on spark ID
const getBusinessDate = (sparkId: string) => {
    // Use a deterministic seed based on the spark ID
    const seed = sparkId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Create a base date
    const date = new Date();
    // Add days based on the seed (between 1-5 business days)
    const daysToAdd = (seed % 5) + 1;
    date.setDate(date.getDate() + daysToAdd);
    
    // If it's a weekend, move to Monday
    if (date.getDay() === 0) { // Sunday
        date.setDate(date.getDate() + 1);
    } else if (date.getDay() === 6) { // Saturday
        date.setDate(date.getDate() + 2);
    }
    
    // Set hours based on the seed (9-17)
    const hour = 9 + (seed % 9);
    // Set minutes to either 00, 15, 30, or 45
    const minute = (seed % 4) * 15;
    
    date.setHours(hour, minute, 0);
    
    // Format the date in French
    return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: 'numeric',
        minute: '2-digit'
    });
};

interface SparksGridServerProps {
    sparks: Spark[];
    expandedCallIndex: number | null;
    setExpandedCallIndex: (index: number | null) => void;
    onCallClick: (prefillText: string) => void;
    buttonText: string;
    showAvailability?: boolean;
    showCreateCard?: boolean;
    showDetailsButton?: boolean;
    onDetailsClick?: (spark: Spark) => void;
}

export function SparksGridServer({
    sparks,
    expandedCallIndex,
    setExpandedCallIndex,
    onCallClick,
    buttonText,
    showAvailability = true,
    showCreateCard = false,
    showDetailsButton = false,
    onDetailsClick
}: SparksGridServerProps) {
    // Generate dates on the server side
    const availableDates = sparks.map((spark, index) => {
        // Make sure we have a valid identifier to use as seed
        const identifier = spark.id || spark.url || `spark-${index}`;
        return getBusinessDate(identifier);
    });

    // Pass the pre-generated dates to the client component
    return (
        <SparksGrid
            sparks={sparks}
            expandedCallIndex={expandedCallIndex}
            setExpandedCallIndex={setExpandedCallIndex}
            onCallClick={onCallClick}
            buttonText={buttonText}
            showAvailability={showAvailability}
            showCreateCard={showCreateCard}
            showDetailsButton={showDetailsButton}
            onDetailsClick={onDetailsClick}
            availableDates={availableDates}
        />
    );
} 