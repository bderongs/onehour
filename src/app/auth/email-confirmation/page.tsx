'use client';

import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

export default function EmailConfirmationPage() {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full"
            >
                <div className="bg-white p-8 rounded-xl shadow-md text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                        <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Vérifiez votre email
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Nous vous avons envoyé un email avec un lien de confirmation.
                        Cliquez sur ce lien pour activer votre compte et accéder à votre espace.
                    </p>
                    <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
                        <p>
                            Si vous ne trouvez pas l'email, vérifiez votre dossier spam.
                            L'email devrait arriver dans les prochaines minutes.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
} 