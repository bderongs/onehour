import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getClientRequestsByClientId } from '@/services/clientRequests'
import { getSparkById } from '@/services/sparks'
import { RequestsList } from './components/RequestsList'
import { RequestsSkeleton } from './components/RequestsSkeleton'
import { getCurrentUser } from '@/services/auth/server'

export const metadata = {
    title: 'Tableau de bord client | Sparkier',
    description: 'Gérez vos demandes de conseil et suivez leur état d\'avancement.',
}

async function getRequestsData(userId: string) {
    const clientRequests = await getClientRequestsByClientId(userId)
    
    const requestsWithTitles = await Promise.all(
        clientRequests.map(async (request) => {
            const spark = await getSparkById(request.sparkId)
            return {
                ...request,
                sparkTitle: spark?.title
            }
        })
    )

    return requestsWithTitles
}

export default async function Page() {
    const user = await getCurrentUser()
    
    if (!user) {
        redirect('/sign-in')
    }

    if (!user.roles.includes('client')) {
        redirect('/')
    }

    const requests = await getRequestsData(user.id)

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Mes demandes</h1>
                        <p className="text-gray-600 mt-2">Suivez l'état de vos demandes de conseil</p>
                    </div>
                    <a
                        href="/"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Explorer les Sparks
                    </a>
                </div>

                <Suspense fallback={<RequestsSkeleton />}>
                    <RequestsList requests={requests} />
                </Suspense>
            </div>
        </div>
    )
} 