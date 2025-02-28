'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EmailCheckForm } from '../../components/EmailCheckForm';
import { PasswordSignInStep } from '../../components/PasswordSignInStep';
import { ClientSignUpForm } from '../../components/ClientSignUpForm';
import { useClientSignUp } from '@/contexts/ClientSignUpContext';
import { getSparkBySlug } from '@/services/sparks';
import { createClientRequest, getClientRequestsByClientId } from '@/services/clientRequests';
import { createBrowserClient } from '@/lib/supabase/client';
import logger from '@/utils/logger';
import { SignUpFormContainer } from './SignUpFormContainer';

type FormState = 'email_check' | 'sign_in' | 'sign_up';

export function SignUpFormManager() {
    const router = useRouter();
    const { sparkUrlSlug } = useClientSignUp();
    const [formState, setFormState] = useState<FormState>('email_check');
    const [email, setEmail] = useState('');

    const handleSignUpSuccess = () => {
        router.push('/auth/email-confirmation');
    };

    const handleSignInSuccess = async () => {
        if (!sparkUrlSlug) {
            router.push('/client/dashboard');
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 200));
            const { data: { session } } = await createBrowserClient().auth.getSession();
            if (!session?.user) {
                logger.error('Session lost after sign in');
                throw new Error('Session perdue après la connexion');
            }

            const spark = await getSparkBySlug(sparkUrlSlug);
            if (!spark) {
                logger.error('Spark not found after sign in', { sparkUrlSlug });
                router.push('/client/dashboard');
                return;
            }

            const requests = await getClientRequestsByClientId(session.user.id);
            const existingRequest = requests.find(r => 
                r.sparkId === spark.id && 
                (r.status === 'pending' || r.status === 'accepted')
            );

            if (existingRequest) {
                logger.info('Found existing active request after sign in', { requestId: existingRequest.id });
                router.push(`/client/requests/${existingRequest.id}`);
            } else {
                logger.info('Creating new request after sign in', { sparkId: spark.id });
                const request = await createClientRequest({
                    sparkId: spark.id,
                    clientId: session.user.id,
                    status: 'pending',
                    message: ''
                });
                router.push(`/client/requests/${request.id}`);
            }
        } catch (error) {
            logger.error('Error handling sign in success:', error);
            router.push('/client/dashboard');
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
                    <PasswordSignInStep
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

    return (
        <SignUpFormContainer
            title={getTitle()}
            description={getDescription()}
        >
            {renderForm()}
        </SignUpFormContainer>
    );
} 