'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { SparkForm } from '@/components/SparkForm';
import { createSparkAction } from '../actions';
import type { Spark } from '@/types/spark';
import { useAuth } from '@/contexts/AuthContext';
import logger from '@/utils/logger';

export default function CreateSparkForm() {
    const router = useRouter();
    const { user } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (data: Spark) => {
        try {
            await createSparkAction({
                ...data,
                consultant: user?.id || null
            });
            router.push('/sparks/manage');
        } catch (err) {
            logger.error('Error creating spark:', err);
            setError('Failed to create spark. Please try again.');
        }
    };

    const handleCancel = () => {
        router.push('/sparks/manage');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600">{error}</p>
                </div>
            )}
            <SparkForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </motion.div>
    );
} 