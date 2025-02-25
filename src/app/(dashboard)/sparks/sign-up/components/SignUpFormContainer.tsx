'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SignUpFormContainerProps {
    title: string;
    description: string;
    children: ReactNode;
}

export function SignUpFormContainer({ title, description, children }: SignUpFormContainerProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
        >
            <div className="bg-white p-8 rounded-xl shadow-md space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {title}
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        {description}
                    </p>
                </div>
                {children}
            </div>
        </motion.div>
    );
} 