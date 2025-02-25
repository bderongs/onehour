'use client'

import { Clock, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { ClientRequest } from '@/services/clientRequests'
import { formatDate } from '@/utils/format'

interface RequestRowProps {
    request: ClientRequest & { sparkTitle?: string }
}

export const RequestRow = ({ request }: RequestRowProps) => {
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
        e.stopPropagation()
        router.push(`/sparks/product/${request.sparkId}`)
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