'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Rocket, ChevronDown } from 'lucide-react'
import type { Spark } from '../../../../types/spark'
import { getSparks, deleteSpark } from '../../../../services/sparks'
import { ConfirmDialog } from '../../../../components/ui/ConfirmDialog'
import { useAuth } from '../../../../contexts/AuthContext'
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner'
import { useNotification } from '../../../../contexts/NotificationContext'
import { SparksGrid } from '../../../../components/SparksGrid'

const EmptyState = ({ onCreateSpark }: { onCreateSpark: () => void }) => (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
        >
            <Rocket className="h-20 w-20 text-blue-500" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Aucun Spark disponible</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            Il n'y a actuellement aucun Spark dans la base de données.
            Vous pouvez en créer un nouveau ou attendre que les consultants en créent.
        </p>
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <button
                onClick={onCreateSpark}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg flex items-center gap-2 transition-colors"
            >
                <Plus className="h-6 w-6" />
                Créer un Spark
            </button>
        </motion.div>
    </div>
)

type FilterType = 'consultants' | 'demo' | 'orphan' | 'all'

export default function Page() {
    const router = useRouter()
    const { user } = useAuth()
    const { showNotification } = useNotification()
    const [sparks, setSparks] = useState<Spark[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [filterType, setFilterType] = useState<FilterType>('orphan')
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; sparkUrl: string | null }>({
        isOpen: false,
        sparkUrl: null
    })

    const filteredSparks = sparks.filter(spark => {
        const demoConsultantId = process.env.NEXT_PUBLIC_DEMO_CONSULTANT_ID
        
        switch (filterType) {
            case 'consultants':
                return spark.consultant && spark.consultant !== demoConsultantId
            case 'demo':
                return spark.consultant === demoConsultantId
            case 'orphan':
                return !spark.consultant
            case 'all':
                return true
            default:
                return true
        }
    })

    useEffect(() => {
        const fetchUserAndSparks = async () => {
            try {
                if (!user) {
                    router.push('/sign-in')
                    return
                }

                if (!user.roles?.includes('admin')) {
                    router.push('/')
                    return
                }

                // Fetch all sparks for admin
                const fetchedSparks = await getSparks()
                setSparks(fetchedSparks)
                setLoading(false)
            } catch (err) {
                console.error('Error fetching data:', err)
                setError('Impossible de charger les Sparks. Veuillez réessayer plus tard.')
                setLoading(false)
            }
        }

        fetchUserAndSparks()
    }, [router, user])

    const handleCreateSpark = () => {
        router.push('/sparks/create')
    }

    const handleEditSpark = (sparkUrl: string) => {
        router.push(`/sparks/edit/${sparkUrl}`)
    }

    const handleAIEditSpark = (sparkUrl: string) => {
        router.push(`/sparks/ai/${sparkUrl}`)
    }

    const handlePreviewSpark = (sparkUrl: string) => {
        router.push(`/sparks/product/${sparkUrl}`)
    }

    const handleDeleteSpark = async (sparkUrl: string) => {
        setDeleteConfirm({ isOpen: true, sparkUrl })
    }

    const handleConfirmDelete = async () => {
        if (!deleteConfirm.sparkUrl) return
        
        try {
            await deleteSpark(deleteConfirm.sparkUrl)
            setSparks(sparks.filter(spark => spark.url !== deleteConfirm.sparkUrl))
            showNotification('success', 'Le Spark a été supprimé avec succès')
        } catch (error) {
            console.error('Error deleting spark:', error)
            showNotification('error', 'Échec de la suppression du Spark')
        } finally {
            setDeleteConfirm({ isOpen: false, sparkUrl: null })
        }
    }

    if (loading) {
        return <LoadingSpinner message="Chargement des Sparks..." />
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 text-blue-600 hover:text-blue-700"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gestion des Sparks</h1>
                        <p className="text-gray-600 mt-2">Gérez tous les Sparks de la plateforme</p>
                    </div>
                    <div className="relative">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as FilterType)}
                            className="appearance-none block w-64 pl-4 pr-10 py-2.5 text-sm bg-white border border-gray-300 rounded-lg shadow-sm 
                            text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                            hover:border-blue-300 transition-colors cursor-pointer"
                        >
                            <option value="consultants" className="py-2">Sparks des consultants</option>
                            <option value="demo" className="py-2">Sparks de démo</option>
                            <option value="orphan" className="py-2">Faux Sparks</option>
                            <option value="all" className="py-2">Tous les Sparks</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <ChevronDown className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                {filteredSparks.length === 0 ? (
                    <EmptyState onCreateSpark={handleCreateSpark} />
                ) : (
                    <SparksGrid
                        sparks={filteredSparks}
                        onCreateSpark={handleCreateSpark}
                        onPreviewSpark={handlePreviewSpark}
                        onEditSpark={handleEditSpark}
                        onAIEditSpark={handleAIEditSpark}
                        onDeleteSpark={handleDeleteSpark}
                    />
                )}
            </div>
            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                title="Supprimer le Spark"
                message="Êtes-vous sûr de vouloir supprimer ce Spark ? Cette action est irréversible."
                confirmLabel="Supprimer"
                cancelLabel="Annuler"
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteConfirm({ isOpen: false, sparkUrl: null })}
                variant="danger"
            />
        </div>
    )
} 
