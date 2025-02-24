'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { SparkForm } from '../../../../components/SparkForm'
import { getSparkByUrl, updateSpark } from '../../../../services/sparks'
import type { Spark } from '../../../../types/spark'
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner'

export default function Page() {
    const router = useRouter()
    const params = useParams()
    const sparkUrl = params.sparkUrl as string
    const [spark, setSpark] = useState<Spark | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchSpark = async () => {
            if (!sparkUrl) {
                router.push('/admin/sparks')
                return
            }

            try {
                const fetchedSpark = await getSparkByUrl(sparkUrl)
                if (!fetchedSpark) {
                    router.push('/admin/sparks')
                    return
                }
                setSpark({
                    ...fetchedSpark,
                    price: fetchedSpark.price || '0'
                })
                setLoading(false)
            } catch (err) {
                console.error('Error fetching spark:', err)
                setError('Impossible de charger le spark. Veuillez réessayer plus tard.')
                setLoading(false)
            }
        }

        fetchSpark()
    }, [sparkUrl, router])

    const handleSubmit = async (data: Spark) => {
        try {
            if (!sparkUrl) return
            const updatedData = {
                ...data,
                price: data.price || '0'
            }
            await updateSpark(sparkUrl, updatedData)
            router.back()
        } catch (error) {
            console.error('Error updating spark:', error)
            setError('Impossible de mettre à jour le spark. Veuillez réessayer plus tard.')
        }
    }

    const handleCancel = () => {
        router.back()
    }

    if (loading) {
        return <LoadingSpinner message="Chargement du Spark..." />
    }

    if (error || !spark) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">{error || 'Spark introuvable'}</p>
                    <button
                        onClick={() => router.push('/admin/sparks')}
                        className="mt-4 text-blue-600 hover:text-blue-700"
                    >
                        Retour aux sparks
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8">
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

                    <SparkForm
                        initialData={spark}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                </motion.div>
            </div>
        </div>
    )
} 