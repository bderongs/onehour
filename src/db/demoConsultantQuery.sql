-- First, delete from tables that reference the consultant_id
DELETE FROM sparks WHERE consultant = '3c957f54-d43b-4cef-bd65-b519cd8b09d1';
DELETE FROM consultant_reviews WHERE consultant_id = '3c957f54-d43b-4cef-bd65-b519cd8b09d1';
DELETE FROM consultant_missions WHERE consultant_id = '3c957f54-d43b-4cef-bd65-b519cd8b09d1';
-- Finally delete the profile
DELETE FROM profiles WHERE id = '3c957f54-d43b-4cef-bd65-b519cd8b09d1';

-- Insert profile data
INSERT INTO profiles (
    id,
    email,
    first_name,
    last_name,
    roles,
    title,
    bio,
    location,
    languages,
    linkedin,
    twitter,
    website,
    profile_image_url,
    expertise,
    experience,
    key_competencies,
    average_rating,
    review_count,
    is_verified,
    verification_date
) VALUES (
    '3c957f54-d43b-4cef-bd65-b519cd8b09d1',
    'arnaud.lacaze@example.com',
    'Arnaud',
    'Lacaze',
    ARRAY['consultant'],
    'Expert en Transformation Digitale & Innovation',
    'Passionné par l''innovation et la transformation digitale, j''accompagne les entreprises dans leur évolution technologique depuis plus de 15 ans. Mon approche combine expertise technique et vision stratégique pour des résultats concrets et durables.',
    'Paris, France',
    ARRAY['Français', 'English', 'Español'],
    'https://linkedin.com/in/arnaud-lacaze',
    'https://twitter.com/arnaudlacaze',
    'https://arnaudlacaze.com',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&w=800&q=80',
    'Transformation Digitale',
    '15+ ans',
    ARRAY['Stratégie digitale', 'Innovation produit', 'Transformation organisationnelle', 'Management de l''innovation', 'Conduite du changement', 'Agilité à l''échelle'],
    5.0,
    3,
    true,
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    roles = EXCLUDED.roles,
    title = EXCLUDED.title,
    bio = EXCLUDED.bio,
    location = EXCLUDED.location,
    languages = EXCLUDED.languages,
    linkedin = EXCLUDED.linkedin,
    twitter = EXCLUDED.twitter,
    website = EXCLUDED.website,
    profile_image_url = EXCLUDED.profile_image_url,
    expertise = EXCLUDED.expertise,
    experience = EXCLUDED.experience,
    key_competencies = EXCLUDED.key_competencies,
    average_rating = EXCLUDED.average_rating,
    review_count = EXCLUDED.review_count,
    is_verified = EXCLUDED.is_verified,
    verification_date = EXCLUDED.verification_date;

-- Insert reviews data
INSERT INTO consultant_reviews (
    consultant_id,
    reviewer_name,
    reviewer_role,
    reviewer_company,
    review_text,
    rating,
    reviewer_image_url,
    is_verified
) VALUES 
(
    '3c957f54-d43b-4cef-bd65-b519cd8b09d1',
    'Pascal Dubois',
    'CTO',
    'TechCorp',
    'Service exceptionnel ! J''ai pu résoudre mon problème en une heure seulement. Arnaud était très compétent et a parfaitement compris nos besoins.',
    5,
    'https://images.unsplash.com/photo-1568602471122-7832951cc4c5',
    true
),
(
    '3c957f54-d43b-4cef-bd65-b519cd8b09d1',
    'Marie Jarry',
    'Directrice Innovation',
    'ScienceLab',
    'Arnaud est très professionnel et à l''écoute. Je recommande vivement. La qualité des conseils a dépassé mes attentes.',
    5,
    'https://images.unsplash.com/photo-1502685104226-ee32379fefbe',
    true
),
(
    '3c957f54-d43b-4cef-bd65-b519cd8b09d1',
    'Albert Dapas',
    'CEO',
    'FutureTech',
    'Une solution rapide et efficace. Très satisfait du service. L''accompagnement était personnalisé et pertinent.',
    5,
    'https://images.unsplash.com/photo-1560250097-0b93528c311a',
    true
);

-- Insert missions data
INSERT INTO consultant_missions (
    consultant_id,
    title,
    company,
    description,
    duration,
    start_date
) VALUES 
(
    '3c957f54-d43b-4cef-bd65-b519cd8b09d1',
    'Transformation Agile chez TotalEnergies',
    'TotalEnergies',
    'Accompagnement de la transformation agile à l''échelle pour une business unit de 400 personnes. Mise en place du framework SAFe, formation des équipes et du management, et création d''un centre d''excellence agile.',
    '6 mois',
    '2023-06-01T00:00:00Z'
),
(
    '3c957f54-d43b-4cef-bd65-b519cd8b09d1',
    'Innovation Produit chez Decathlon',
    'Decathlon',
    'Refonte du processus d''innovation produit et mise en place d''une approche design thinking. Animation d''ateliers d''idéation et accompagnement des équipes dans le développement de nouveaux produits connectés.',
    '8 mois',
    '2022-09-01T00:00:00Z'
),
(
    '3c957f54-d43b-4cef-bd65-b519cd8b09d1',
    'Stratégie Digitale pour La Poste',
    'La Poste',
    'Définition et déploiement de la stratégie de transformation digitale. Création d''une feuille de route sur 3 ans et accompagnement dans la mise en place des premiers projets structurants.',
    '4 mois',
    '2022-04-01T00:00:00Z'
);
