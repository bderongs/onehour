'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Mail, ExternalLink, ChevronDown, ChevronUp, Linkedin, Edit, Trash2, Eye, Clock, Plus } from 'lucide-react'
import type { ConsultantProfile } from '../../../types/consultant'
import type { Spark } from '../../../types/spark'
import { getAllConsultants, deleteConsultant, getConsultantSparks } from '../../../services/consultants'
import { deleteSpark } from '../../../services/sparks'
import { ConfirmDialog } from '../../../components/ConfirmDialog'
import { formatDuration, formatPrice } from '../../../utils/format'
import { useAuth } from '../../../contexts/AuthContext'
import { LoadingSpinner } from '../../../components/LoadingSpinner'
import { useNotification } from '../../../contexts/NotificationContext'

const EmptyState = () => (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
        >
            <Users className="h-20 w-20 text-blue-500" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Aucun consultant</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            Il n'y a actuellement aucun consultant inscrit sur la plateforme.
        </p>
    </div>
)

const ConsultantRow = ({ 
    consultant, 
    isExpanded,
    onToggle,
    onDelete
}: { 
    consultant: ConsultantProfile
    isExpanded: boolean
    onToggle: () => void
    onDelete: () => void
}) => {
    const router = useRouter()
    const { showNotification } = useNotification()
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [sparks, setSparks] = useState<Spark[]>([])
    const [loadingSparks, setLoadingSparks] = useState(false)
    const [showSparkDeleteConfirm, setShowSparkDeleteConfirm] = useState<{ isOpen: boolean; sparkUrl: string | null; sparkTitle: string | null }>({
        isOpen: false,
        sparkUrl: null,
        sparkTitle: null
    })
    const [showDeleteError, setShowDeleteError] = useState(false)

    useEffect(() => {
        const fetchSparks = async () => {
            if ((isExpanded || showDeleteConfirm) && consultant.id) {
                setLoadingSparks(true)
                try {
                    const consultantSparks = await getConsultantSparks(consultant.id)
                    setSparks(consultantSparks)
                } catch (error) {
                    console.error('Error fetching sparks:', error)
                } finally {
                    setLoadingSparks(false)
                }
            }
        }

        fetchSparks()
    }, [isExpanded, showDeleteConfirm, consultant.id])

    const handleDeleteAttempt = () => {
        if (sparks.length > 0) {
            setShowDeleteError(true)
        } else {
            setShowDeleteConfirm(true)
        }
    }

    const handleDelete = async () => {
        if (sparks.length > 0) {
            setShowDeleteError(true)
            setShowDeleteConfirm(false)
            return
        }

        setIsDeleting(true)
        const success = await deleteConsultant(consultant.id)
        setIsDeleting(false)
        if (success) {
            onDelete()
        }
        setShowDeleteConfirm(false)
    }

    const handleSparkDelete = async (sparkUrl: string, sparkTitle: string) => {
        setShowSparkDeleteConfirm({ isOpen: true, sparkUrl, sparkTitle })
    }

    const handleConfirmSparkDelete = async () => {
        if (!showSparkDeleteConfirm.sparkUrl) return
        
        try {
            await deleteSpark(showSparkDeleteConfirm.sparkUrl)
            setSparks(sparks.filter(spark => spark.url !== showSparkDeleteConfirm.sparkUrl))
            showNotification('success', 'Le Spark a été supprimé avec succès')
        } catch (error) {
            console.error('Error deleting spark:', error)
            showNotification('error', 'Échec de la suppression du Spark')
        } finally {
            setShowSparkDeleteConfirm({ isOpen: false, sparkUrl: null, sparkTitle: null })
        }
    }

    // Check if consultant is an admin
    const isAdmin = consultant.roles?.includes('admin')

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div 
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-4"
                    onClick={onToggle}
                >
                    <div className="flex-1 grid grid-cols-4 gap-4 items-center">
                        {/* Nom et badges */}
                        <div className="flex items-center gap-2">
                            <h3 className="text-base font-medium text-gray-900">
                                {consultant.first_name} {consultant.last_name}
                            </h3>
                        </div>

                        {/* Date d'inscription */}
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                            <span>Inscrit le {new Date(consultant.created_at).toLocaleDateString()}</span>
                        </div>

                        {/* Rôle admin */}
                        <div className="flex items-center gap-2">
                            {isAdmin && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Admin
                                </span>
                            )}
                        </div>

                        {/* LinkedIn */}
                        <div className="flex items-center justify-end">
                            {consultant.linkedin && (
                                <a 
                                    href={consultant.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Linkedin className="h-4 w-4" />
                                    <span className="text-sm">LinkedIn</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 ml-4">
                        {/* Primary Actions */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    router.push(`/admin/consultants/${consultant.id}/edit`)
                                }}
                                className="text-gray-400 hover:text-blue-600 transition-colors"
                                title="Modifier"
                            >
                                <Edit className="h-5 w-5" />
                            </button>
                            <a
                                href={`/consultant/${consultant.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                                title="Voir le profil"
                            >
                                <ExternalLink className="h-5 w-5" />
                            </a>
                            {isExpanded ? (
                                <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                        </div>

                        {/* Danger Zone - Separated */}
                        <div className="ml-4 border-l pl-4 border-gray-200">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteAttempt()
                                }}
                                disabled={isDeleting || isAdmin}
                                className={`${
                                    isAdmin 
                                        ? 'opacity-50 cursor-not-allowed' 
                                        : isDeleting 
                                            ? 'opacity-50 cursor-wait' 
                                            : 'hover:bg-red-50'
                                } p-1.5 rounded-full transition-colors group`}
                                title={isAdmin ? "Les administrateurs ne peuvent pas être supprimés" : "Supprimer"}
                            >
                                <Trash2 className={`h-5 w-5 ${
                                    isAdmin 
                                        ? 'text-gray-400' 
                                        : 'text-gray-400 group-hover:text-red-600 transition-colors'
                                }`} />
                            </button>
                        </div>
                    </div>
                </div>
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-gray-100"
                        >
                            <div className="p-4 bg-gray-50">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Informations</h4>
                                        <dl className="space-y-2">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Titre</dt>
                                                <dd className="text-sm text-gray-900">{consultant.title || 'Non défini'}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Email</dt>
                                                <dd className="text-sm text-gray-900 flex items-center gap-1">
                                                    <Mail className="h-4 w-4" />
                                                    {consultant.email}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                    {consultant.key_competencies && consultant.key_competencies.length > 0 && (
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Compétences clés</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {consultant.key_competencies.map((competency, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                    >
                                                        {competency}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Sparks Section */}
                                <div className="mt-6">
                                    <h4 className="font-medium text-gray-900 mb-4">Sparks ({sparks.length})</h4>
                                    {loadingSparks ? (
                                        <div className="flex justify-center">
                                            <LoadingSpinner message="Chargement des Sparks..." fullScreen={false} />
                                        </div>
                                    ) : sparks.length > 0 ? (
                                        <div className="space-y-3">
                                            {sparks.map((spark) => (
                                                <div
                                                    key={spark.url}
                                                    className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between"
                                                >
                                                    <div className="flex-1">
                                                        <h5 className="font-medium text-gray-900">{spark.title}</h5>
                                                        <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-4 w-4" />
                                                                {formatDuration(spark.duration)}
                                                            </span>
                                                            <span>{formatPrice(spark.price)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => router.push(`/spark/edit/${spark.url}`)}
                                                            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                                                            title="Modifier"
                                                        >
                                                            <Edit className="h-5 w-5" />
                                                        </button>
                                                        <a
                                                            href={`/spark/product/${spark.url}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                                                            title="Voir"
                                                        >
                                                            <Eye className="h-5 w-5" />
                                                        </a>
                                                        <button
                                                            onClick={() => handleSparkDelete(spark.url, spark.title)}
                                                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                                                            title="Supprimer"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">Aucun Spark créé</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                title="Supprimer le consultant"
                message="Êtes-vous sûr de vouloir supprimer ce consultant ? Cette action est irréversible."
                confirmLabel="Supprimer"
                cancelLabel="Annuler"
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteConfirm(false)}
                variant="danger"
            />

            {/* Delete Error Dialog */}
            <ConfirmDialog
                isOpen={showDeleteError}
                title="Impossible de supprimer le consultant"
                message="Ce consultant a des Sparks actifs. Veuillez d'abord supprimer tous ses Sparks."
                confirmLabel="J'ai compris"
                onConfirm={() => setShowDeleteError(false)}
                onCancel={() => setShowDeleteError(false)}
                variant="danger"
            />

            {/* Spark Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showSparkDeleteConfirm.isOpen}
                title="Supprimer le Spark"
                message={`Êtes-vous sûr de vouloir supprimer le Spark "${showSparkDeleteConfirm.sparkTitle}" ? Cette action est irréversible.`}
                confirmLabel="Supprimer"
                cancelLabel="Annuler"
                onConfirm={handleConfirmSparkDelete}
                onCancel={() => setShowSparkDeleteConfirm({ isOpen: false, sparkUrl: null, sparkTitle: null })}
                variant="danger"
            />
        </>
    )
}

export default function Page() {
    const router = useRouter()
    const { user } = useAuth()
    const [consultants, setConsultants] = useState<ConsultantProfile[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [expandedConsultantId, setExpandedConsultantId] = useState<string | null>(null)
    const [showAll, setShowAll] = useState(false)

    const fetchConsultants = async (includeSparkierEmails: boolean) => {
        try {
            const fetchedConsultants = await getAllConsultants(includeSparkierEmails)
            setConsultants(fetchedConsultants)
            setLoading(false)
        } catch (err) {
            console.error('Error fetching consultants:', err)
            setError('Impossible de charger les consultants. Veuillez réessayer plus tard.')
            setLoading(false)
        }
    }

    useEffect(() => {
        const checkUserAndFetchConsultants = async () => {
            try {
                if (!user) {
                    router.push('/sign-in')
                    return
                }

                if (!user.roles?.includes('admin')) {
                    router.push('/')
                    return
                }

                await fetchConsultants(showAll)
            } catch (err) {
                console.error('Error:', err)
                setError('Une erreur est survenue. Veuillez réessayer plus tard.')
                setLoading(false)
            }
        }

        checkUserAndFetchConsultants()
    }, [router, user, showAll])

    const toggleShowAll = async () => {
        setShowAll(!showAll)
        await fetchConsultants(!showAll)
    }

    const toggleExpand = (consultantId: string) => {
        setExpandedConsultantId(expandedConsultantId === consultantId ? null : consultantId)
    }

    const handleConsultantDelete = () => {
        fetchConsultants(showAll)
    }

    if (loading) {
        return <LoadingSpinner message="Chargement des consultants..." />
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
                        <h1 className="text-3xl font-bold text-gray-900">Gestion des consultants</h1>
                        <p className="text-gray-600 mt-2">Gérez les consultants de la plateforme</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleShowAll}
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            {showAll ? 'Masquer les emails @sparkier.io' : 'Afficher tous les emails'}
                        </button>
                    </div>
                </div>

                {consultants.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="space-y-4">
                        {consultants.map((consultant) => (
                            <ConsultantRow
                                key={consultant.id}
                                consultant={consultant}
                                isExpanded={expandedConsultantId === consultant.id}
                                onToggle={() => toggleExpand(consultant.id)}
                                onDelete={handleConsultantDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
} 