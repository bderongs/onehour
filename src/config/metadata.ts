import type { Spark } from '../types/spark';
import type { ConsultantProfile } from '../types/consultant';

interface MetadataConfig {
    title: string;
    description: string;
    image?: string;
    type?: string;
}

interface DynamicMetadataProps {
    spark?: Spark;
    consultant?: ConsultantProfile;
}

type MetadataConfigFunction = (props?: DynamicMetadataProps) => MetadataConfig;

interface RouteMetadata {
    [key: string]: MetadataConfig | MetadataConfigFunction;
}

export const defaultMetadata: MetadataConfig = {
    title: 'Sparkier - Le conseil hybride expert + IA',
    description: 'Obtenez les réponses que vous cherchez en une session de 30 min à 2h auprès d\'un expert validé. Le Spark: un concentré de conseil, sans engagement.',
    image: 'https://sparkier.io/images/og-consultant.png',
    type: 'website'
};

export const routeMetadata: RouteMetadata = {
    '/': defaultMetadata,
    
    '/consultants': {
        title: 'Sparkier - Créez vos offres de conseil packagées',
        description: 'Transformez vos expertises en Sparks : des modules de conseil packagés et prêts à vendre. Simplifiez votre activité de conseil avec Sparkier.',
        image: 'https://sparkier.io/images/og-consultant.png',
        type: 'website'
    },

    '/sparks/:sparkUrl': ({ spark }: DynamicMetadataProps = {}) => ({
        title: spark?.title ? `${spark.title} | Sparkier` : 'Sparkier',
        description: spark?.description || defaultMetadata.description,
        image: spark?.social_image_url || 'https://sparkier.io/images/og-spark.png',
        type: 'product'
    }),

    '/:slug': ({ consultant }: DynamicMetadataProps = {}) => ({
        title: consultant ? `${consultant.first_name} ${consultant.last_name} | Sparkier` : defaultMetadata.title,
        description: consultant?.bio || defaultMetadata.description,
        image: consultant?.profile_image_url || defaultMetadata.image,
        type: 'profile'
    })
};

// Create a memoized map of route patterns to regex
const routePatternMap = new Map(
    Object.keys(routeMetadata).map(pattern => [
        pattern,
        new RegExp('^' + pattern.replace(/:[^/]+/g, '[^/]+').replace(/\//g, '\\/') + '$')
    ])
);

export const getMetadataForRoute = (pathname: string, props?: DynamicMetadataProps): MetadataConfig => {
    // Find the matching route pattern using pre-compiled regex
    const route = Array.from(routePatternMap.entries()).find(([_, regex]) => regex.test(pathname))?.[0];

    if (!route) return defaultMetadata;

    const metadata = routeMetadata[route];
    return typeof metadata === 'function' ? metadata(props) : metadata;
}; 