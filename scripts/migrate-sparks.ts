import { sparks } from '../src/data/sparks.js';
import { createSpark } from './sparks-service.js';
import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from './config.js';

// Create Supabase client with service role key for admin access
const supabase = createClient(supabaseUrl!, process.env.SUPABASE_SERVICE_ROLE_KEY || '');

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required');
    process.exit(1);
}

const getOrCreateArnaudProfile = async () => {
    const email = 'arnaud@sparkier.io';
    
    // First try to find existing profile
    const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

    if (existingProfile) {
        console.log('Found existing profile for Arnaud');
        return existingProfile.id;
    }

    console.log('Creating new profile for Arnaud...');
    
    // Create the auth user
    const password = 'temporary-password-' + Math.random().toString(36).slice(2);
    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
            first_name: 'Arnaud',
            last_name: 'Lacaze'
        }
    });

    if (authError) {
        throw new Error(`Failed to create auth user for Arnaud: ${authError.message}`);
    }

    if (!authData.user) {
        throw new Error('Auth user creation succeeded but no user was returned');
    }

    // Create the profile
    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([{
            id: authData.user.id,
            email,
            first_name: 'Arnaud',
            last_name: 'Lacaze',
            expertise: 'Transformation numérique, Stratégie IT, Management',
            experience: '15+ ans d\'expérience en transformation numérique et management',
            role: 'consultant',
            linkedin: 'https://www.linkedin.com/in/arnauddufay/'
        }])
        .select()
        .single();

    if (profileError) {
        throw new Error(`Failed to create Arnaud's profile: ${profileError.message}`);
    }

    console.log('Successfully created Arnaud\'s profile');
    console.log('Please note: The account is already confirmed');
    console.log('The temporary password is:', password);
    
    return profileData.id;
};

const migrateSparks = async () => {
    console.log('Starting sparks migration...');
    
    try {
        // Get or create Arnaud's profile
        const arnaudId = await getOrCreateArnaudProfile();
        
        // Migrate sparks
        for (const spark of sparks) {
            console.log(`Migrating spark: ${spark.title}`);
            
            // Only link sparks to Arnaud if they belong to him, otherwise set consultant to null
            const sparkToCreate = {
                ...spark,
                consultant: spark.consultant === 'arnaud' ? arnaudId : null
            };
            
            await createSpark(sparkToCreate);
            console.log(`Successfully migrated: ${spark.title}`);
        }
        
        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Error during migration:', error);
        process.exit(1);
    }
};

migrateSparks(); 