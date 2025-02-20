'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Sparkles, Clock, ExternalLink } from 'lucide-react'
import type { ClientRequest } from '../../../services/clientRequests'
import { getClientRequestsByClientId } from '../../../services/clientRequests'
import { getSparkById } from '../../../services/sparks'
import { formatDate } from '../../../utils/format'
import { useAuth } from '../../../contexts/AuthContext'
import { LoadingSpinner } from '../../../components/LoadingSpinner'

const EmptyState = () => {
    const router = useRouter()
    
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <Sparkles className="h-20 w-20 text-blue-500" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Aucune demande en cours</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Vous n'avez pas encore fait de demande de conseil. Découvrez nos Sparks pour trouver le conseil qui vous correspond.
            </p>
            <button
                onClick={() => router.push('/')}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Explorer les Sparks
            </button>
        </div>
    )
}

const RequestRow = ({ request }: { request: ClientRequest & { sparkTitle?: string } }) => {
    const router = useRouter()

    const getStatusColor = (status: ClientRequest['status']) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            case 'accepted':
                return 'bg-green-100 text-green-800'
            case 'rejected':
                return 'bg-red-100 text-red-800'
            case 'completed':
                return 'bg-gray-100 text-gray-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusText = (status: ClientRequest['status']) => {
        switch (status) {
            case 'pending':
                return 'En attente'
            case 'accepted':
                return 'Acceptée'
            case 'rejected':
                return 'Refusée'
            case 'completed':
                return 'Terminée'
            default:
                return status
        }
    }

    const handleSparkClick = (e: React.MouseEvent) => {
        e.stopPropagation() // Prevent row click when clicking the spark link
        router.push(`/spark/product/${request.sparkId}`)
    }

    return (
        <div 
            className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
            onClick={() => router.push(`/client/request/${request.id}`)}
        >
            <div className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                {request.sparkTitle || 'Chargement...'}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                {getStatusText(request.status)}
                            </span>
                        </div>
                        <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatDate(request.createdAt)}
                            </span>
                        </div>
                        {request.message && (
                            <p className="mt-2 text-sm text-gray-600">
                                {request.message}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSparkClick}
                            className="text-gray-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-full"
                            title="Voir le Spark"
                        >
                            <ExternalLink className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Page() {
    const router = useRouter()
    const { user } = useAuth()
    const [requests, setRequests] = useState<(ClientRequest & { sparkTitle?: string })[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const checkUserAndFetchRequests = async () => {
            try {
                if (!user) {
                    router.push('/sign-in')
                    return
                }

                if (!user.roles?.includes('client')) {
                    router.push('/')
                    return
                }

                const clientRequests = await getClientRequestsByClientId(user.id)
                
                const requestsWithTitles = await Promise.all(
                    clientRequests.map(async (request) => {
                        const spark = await getSparkById(request.sparkId)
                        return {
                            ...request,
                            sparkTitle: spark?.title
                        }
                    })
                )

                setRequests(requestsWithTitles)
                setLoading(false)
            } catch (err) {
                console.error('Error fetching requests:', err)
                setError('Impossible de charger vos demandes. Veuillez réessayer plus tard.')
                setLoading(false)
            }
        }

        checkUserAndFetchRequests()
    }, [user, router])

    if (loading) {
        return <LoadingSpinner message="Chargement de vos demandes..." />
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
                        <h1 className="text-3xl font-bold text-gray-900">Mes demandes</h1>
                        <p className="text-gray-600 mt-2">Suivez l'état de vos demandes de conseil</p>
                    </div>
                    <button
                        onClick={() => router.push('/')}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Explorer les Sparks
                    </button>
                </div>

                {requests.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="space-y-4">
                        {requests
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .map((request) => (
                                <RequestRow key={request.id} request={request} />
                            ))}
                    </div>
                )}
            </div>
        </div>
    )
} 