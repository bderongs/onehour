'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ClientSignUpForm } from '@/components/ClientSignUpForm';
import { EmailCheckForm } from '@/components/EmailCheckForm';
import { SignInForm } from '@/components/SignInForm';
import { useClientSignUp } from '@/contexts/ClientSignUpContext';
import { getSparkByUrl } from '@/services/sparks';
import { createClientRequest, getClientRequestsByClientId } from '@/services/clientRequests';
import { supabase } from '@/lib/supabase';
import logger from '@/utils/logger';

type FormState = 'email_check' | 'sign_in' | 'sign_up';

export default function SparkSignUpPage() {
    const router = useRouter();
    const { sparkUrlSlug } = useClientSignUp();
    const [formState, setFormState] = useState<FormState>('email_check');
    const [email, setEmail] = useState('');

    const handleSignUpSuccess = () => {
        router.push('/auth/email-confirmation');
        // Le sparkUrlSlug doit être conservé pour être utilisé après la confirmation de l'email
    };

    const handleSignInSuccess = async () => {
        if (!sparkUrlSlug) {
            router.push('/client/dashboard');
            return;
        }

        try {
            // Wait a moment for the session to be established
            await new Promise(resolve => setTimeout(resolve, 500));

            // Double check that we're still authenticated
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                logger.error('Session lost after sign in');
                throw new Error('Session perdue après la connexion');
            }

            // Get the spark first
            const spark = await getSparkByUrl(sparkUrlSlug);
            if (!spark) {
                logger.error('Spark not found after sign in', { sparkUrlSlug });
                router.push('/client/dashboard');
                return;
            }

            // Check for existing requests
            const requests = await getClientRequestsByClientId(session.user.id);
            const existingRequest = requests.find(r => 
                r.sparkId === spark.id && 
                (r.status === 'pending' || r.status === 'accepted')
            );

            if (existingRequest) {
                logger.info('Found existing active request after sign in, redirecting', { requestId: existingRequest.id });
                router.push(`/client/requests/${existingRequest.id}`);
            } else {
                // Create new request
                logger.info('Creating new request after sign in', { sparkId: spark.id });
                const request = await createClientRequest({ sparkId: spark.id });
                router.push(`/client/requests/${request.id}`);
            }
        } catch (error) {
            logger.error('Error handling sign in success:', error);
            router.push('/client/dashboard');
        }
    };

    const renderForm = () => {
        switch (formState) {
            case 'email_check':
                return (
                    <EmailCheckForm
                        onEmailExists={(email) => {
                            setEmail(email);
                            setFormState('sign_in');
                        }}
                        onEmailNotExists={(email) => {
                            setEmail(email);
                            setFormState('sign_up');
                        }}
                    />
                );
            case 'sign_in':
                return (
                    <SignInForm
                        email={email}
                        onSuccess={handleSignInSuccess}
                        onBack={() => setFormState('email_check')}
                    />
                );
            case 'sign_up':
                return (
                    <ClientSignUpForm
                        sparkUrlSlug={sparkUrlSlug || undefined}
                        onSuccess={handleSignUpSuccess}
                        buttonText="Créer mon compte et continuer"
                        initialEmail={email}
                    />
                );
        }
    };

    const getTitle = () => {
        switch (formState) {
            case 'email_check':
                return 'Connectez-vous ou créez votre compte';
            case 'sign_in':
                return 'Connectez-vous à votre compte';
            case 'sign_up':
                return 'Créez votre compte pour réserver';
        }
    };

    const getDescription = () => {
        switch (formState) {
            case 'email_check':
                return 'Entrez votre email professionnel pour commencer.';
            case 'sign_in':
                return 'Entrez votre mot de passe pour vous connecter.';
            case 'sign_up':
                return 'Remplissez ce formulaire pour accéder à votre espace client et finaliser votre demande.';
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md mx-auto"
            >
                <div className="bg-white p-8 rounded-xl shadow-md space-y-6">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {getTitle()}
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            {getDescription()}
                        </p>
                    </div>

                    {renderForm()}
                </div>
            </motion.div>
        </div>
    );
} 