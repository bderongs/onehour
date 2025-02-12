import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClientSignUpForm } from '../components/ClientSignUpForm';
import { useClientSignUp } from '../contexts/ClientSignUpContext';

export function SparkSignUpPage() {
    const navigate = useNavigate();
    const { sparkUrlSlug } = useClientSignUp();

    const handleSignUpSuccess = () => {
        navigate('/email-confirmation');
        // Le sparkUrlSlug doit être conservé pour être utilisé après la confirmation de l'email
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
                            Créez votre compte pour réserver
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Remplissez ce formulaire pour accéder à votre espace client et finaliser votre demande.
                        </p>
                    </div>

                    <ClientSignUpForm
                        sparkUrlSlug={sparkUrlSlug || undefined}
                        onSuccess={handleSignUpSuccess}
                        buttonText="Créer mon compte et continuer"
                    />
                </div>
            </motion.div>
        </div>
    );
} 