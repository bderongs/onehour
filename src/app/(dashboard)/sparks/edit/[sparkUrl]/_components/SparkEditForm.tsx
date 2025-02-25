'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { SparkForm } from '@/components/SparkForm'
import { updateSpark } from '@/services/sparks'
import type { Spark } from '@/types/spark'
import { useNotification } from '@/contexts/NotificationContext'
import logger from '@/utils/logger'

interface SparkEditFormProps {
    spark: Spark
}

export function SparkEditForm({ spark }: SparkEditFormProps) {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const { showNotification } = useNotification()

    const handleSubmit = async (data: Spark) => {
        try {
            const updatedData = {
                ...data,
                price: data.price || '0'
            }
            await updateSpark(spark.url, updatedData)
            showNotification('success', 'Spark mis à jour avec succès')
            router.back()
        } catch (error) {
            logger.error('Error updating spark:', error)
            setError('Impossible de mettre à jour le spark. Veuillez réessayer plus tard.')
            showNotification('error', 'Erreur lors de la mise à jour du spark')
        }
    }

    const handleCancel = () => {
        router.back()
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.back()}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-3xl font-bold text-gray-900">Modifier le Spark</h1>
            </div>

            {error && (
                <div className="mb-6">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            <SparkForm
                initialData={spark}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </motion.div>
    )
} 