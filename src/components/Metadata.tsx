import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getMetadataForRoute, defaultMetadata } from '../config/metadata';
import type { Spark } from '../types/spark';
import type { ConsultantProfile } from '../types/consultant';
import { memo } from 'react';

interface MetadataProps {
    spark?: Spark;
    consultant?: ConsultantProfile;
}

function MetadataComponent({ spark, consultant }: MetadataProps) {
    const { pathname } = useLocation();
    const metadata = getMetadataForRoute(pathname, { spark, consultant });

    return (
        <Helmet>
            <title>{metadata.title}</title>
            <meta name="description" content={metadata.description} />
            
            {/* OpenGraph Meta Tags */}
            <meta name="type" property="og:type" content={metadata.type || 'website'} />
            <meta name="url" property="og:url" content={`https://sparkier.io${pathname}`} />
            <meta name="title" property="og:title" content={metadata.title} />
            <meta name="description" property="og:description" content={metadata.description} />
            <meta name="image" property="og:image" content={metadata.image || defaultMetadata.image} />
            <meta name="image:width" property="og:image:width" content="1200" />
            <meta name="image:height" property="og:image:height" content="630" />
            <meta name="site_name" property="og:site_name" content="Sparkier" />
            
            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@sparkier" />
            <meta name="twitter:title" content={metadata.title} />
            <meta name="twitter:description" content={metadata.description} />
            <meta name="twitter:image" content={metadata.image || defaultMetadata.image} />
            <meta name="twitter:image:alt" content={metadata.title} />

            {/* Additional metadata for specific types */}
            {metadata.type === 'profile' && consultant && (
                <>
                    <meta name="profile:first_name" property="profile:first_name" content={consultant.first_name || ''} />
                    <meta name="profile:last_name" property="profile:last_name" content={consultant.last_name || ''} />
                    {consultant.title && (
                        <meta name="profile:title" property="profile:title" content={consultant.title} />
                    )}
                    {consultant.linkedin && (
                        <meta name="profile:username" property="profile:username" content={consultant.linkedin.split('/').pop() || ''} />
                    )}
                    {consultant.company && (
                        <meta name="business:business_name" property="business:business_name" content={consultant.company} />
                    )}
                    {consultant.location && (
                        <meta name="business:location" property="business:location" content={consultant.location} />
                    )}
                </>
            )}
        </Helmet>
    );
}

export const Metadata = memo(MetadataComponent, (prevProps, nextProps) => {
    // Custom comparison function for memoization
    if (!prevProps.spark && !nextProps.spark && !prevProps.consultant && !nextProps.consultant) {
        return true; // No props changed
    }
    
    if (prevProps.spark?.id === nextProps.spark?.id && 
        prevProps.consultant?.id === nextProps.consultant?.id) {
        return true; // Same entities
    }
    
    return false; // Props changed
}); 