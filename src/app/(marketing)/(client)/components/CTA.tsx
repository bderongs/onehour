'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ClientSignUpForm } from '@/components/ClientSignUpForm';

export function CTA() {
    return (
        <motion.div
            id="signup-form"
            className="max-w-2xl mx-auto px-3 sm:px-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Prêt à <span className="highlight">commencer</span> ?
                </h2>
                <p className="text-gray-600">
                    Créez votre compte et trouvez l'expert qu'il vous faut
                </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
                <ClientSignUpForm />
            </div>
        </motion.div>
    );
} 