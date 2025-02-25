'use client'

import { useRouter } from 'next/navigation'
import type { ClientRequest } from '@/services/clientRequests'
import { RequestRow } from './RequestRow'
import { EmptyState } from './EmptyState'

interface RequestsListProps {
    requests: (ClientRequest & { sparkTitle?: string })[]
}

export const RequestsList = ({ requests }: RequestsListProps) => {
    const router = useRouter()

    if (requests.length === 0) {
        return <EmptyState />
    }

    return (
        <div className="space-y-4">
            {requests
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((request) => (
                    <RequestRow key={request.id} request={request} />
                ))}
        </div>
    )
} 