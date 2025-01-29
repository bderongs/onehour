/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js';

const isDev = process.env.NODE_ENV === 'development';

// Initialize Supabase client with service role key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_KEY;
const demoConsultantId = import.meta.env.VITE_DEMO_CONSULTANT_ID;

if (!supabaseUrl || !supabaseServiceKey || !demoConsultantId) {
    console.error('Missing required environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Demo consultant profile data
const profileData = {
    id: demoConsultantId,
    email: 'arnaud.lacaze@example.com',
    first_name: 'Arnaud',
    last_name: 'Lacaze',
    roles: ['consultant'],
    title: 'Expert en Transformation Digitale & Innovation',
    bio: 'Passionné par l\'innovation et la transformation digitale, j\'accompagne les entreprises dans leur évolution technologique depuis plus de 15 ans. Mon approche combine expertise technique et vision stratégique pour des résultats concrets et durables.',
    location: 'Paris, France',
    languages: ['Français', 'English', 'Español'],
    linkedin: 'https://linkedin.com/in/arnaud-lacaze',
    twitter: 'https://twitter.com/arnaudlacaze',
    website: 'https://arnaudlacaze.com',
    profile_image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&w=800&q=80',
    expertise: 'Transformation Digitale',
    experience: '15+ ans',
    key_competencies: [
        'Stratégie digitale',
        'Innovation produit',
        'Transformation organisationnelle',
        'Management de l\'innovation',
        'Conduite du changement',
        'Agilité à l\'échelle'
    ],
    average_rating: 5.0,
    review_count: 3,
    is_verified: true,
    verification_date: new Date().toISOString()
};

// Demo reviews data
const reviewsData = [
    {
        consultant_id: demoConsultantId,
        reviewer_name: 'Pascal Dubois',
        reviewer_role: 'CTO',
        reviewer_company: 'TechCorp',
        review_text: 'Service exceptionnel ! J\'ai pu résoudre mon problème en une heure seulement. Arnaud était très compétent et a parfaitement compris nos besoins.',
        rating: 5,
        reviewer_image_url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5',
        is_verified: true
    },
    {
        consultant_id: demoConsultantId,
        reviewer_name: 'Marie Jarry',
        reviewer_role: 'Directrice Innovation',
        reviewer_company: 'ScienceLab',
        review_text: 'Arnaud est très professionnel et à l\'écoute. Je recommande vivement. La qualité des conseils a dépassé mes attentes.',
        rating: 5,
        reviewer_image_url: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe',
        is_verified: true
    },
    {
        consultant_id: demoConsultantId,
        reviewer_name: 'Albert Dapas',
        reviewer_role: 'CEO',
        reviewer_company: 'FutureTech',
        review_text: 'Une solution rapide et efficace. Très satisfait du service. L\'accompagnement était personnalisé et pertinent.',
        rating: 5,
        reviewer_image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
        is_verified: true
    }
];

// Demo missions data
const missionsData = [
    {
        consultant_id: demoConsultantId,
        title: 'Transformation Agile chez TotalEnergies',
        company: 'TotalEnergies',
        description: 'Accompagnement de la transformation agile à l\'échelle pour une business unit de 400 personnes. Mise en place du framework SAFe, formation des équipes et du management, et création d\'un centre d\'excellence agile.',
        duration: '6 mois',
        start_date: '2023-06-01T00:00:00Z'
    },
    {
        consultant_id: demoConsultantId,
        title: 'Innovation Produit chez Decathlon',
        company: 'Decathlon',
        description: 'Refonte du processus d\'innovation produit et mise en place d\'une approche design thinking. Animation d\'ateliers d\'idéation et accompagnement des équipes dans le développement de nouveaux produits connectés.',
        duration: '8 mois',
        start_date: '2022-09-01T00:00:00Z'
    },
    {
        consultant_id: demoConsultantId,
        title: 'Stratégie Digitale pour La Poste',
        company: 'La Poste',
        description: 'Définition et déploiement de la stratégie de transformation digitale. Création d\'une feuille de route sur 3 ans et accompagnement dans la mise en place des premiers projets structurants.',
        duration: '4 mois',
        start_date: '2022-04-01T00:00:00Z'
    }
];

async function injectDemoData() {
    try {
        // Clear existing data for the demo consultant
        await supabase.from('consultant_reviews').delete().eq('consultant_id', demoConsultantId);
        await supabase.from('consultant_missions').delete().eq('consultant_id', demoConsultantId);
        await supabase.from('profiles').delete().eq('id', demoConsultantId);

        // Insert new data
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert(profileData);

        if (profileError) throw profileError;

        const { error: reviewsError } = await supabase
            .from('consultant_reviews')
            .insert(reviewsData);

        if (reviewsError) throw reviewsError;

        const { error: missionsError } = await supabase
            .from('consultant_missions')
            .insert(missionsData);

        if (missionsError) throw missionsError;

        console.log('Demo consultant data injected successfully!');
    } catch (error) {
        console.error('Error injecting demo data:', error);
    }
}

// Run the injection
injectDemoData(); 