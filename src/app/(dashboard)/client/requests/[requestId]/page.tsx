import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ClientRequestDetails from './ClientRequestDetails'
import { getClientRequestById, getSparkById } from './actions'

interface RequestPageProps {
  params: Promise<{ requestId: string }> | { requestId: string }
  searchParams?: Record<string, string | string[] | undefined>
}

export async function generateMetadata({ params }: RequestPageProps): Promise<Metadata> {
  const resolvedParams = params instanceof Promise ? await params : params
  const requestId = resolvedParams.requestId
  const request = await getClientRequestById(requestId)
  
  if (!request) {
    return {
      title: 'Demande non trouvée | Sparkier',
      description: 'La demande client demandée n\'existe pas.',
    }
  }
  
  return {
    title: `Demande client | Sparkier`,
    description: `Détails de la demande client.`,
    openGraph: {
      title: `Demande client | Sparkier`,
      description: `Détails de la demande client.`,
      type: 'website',
    }
  }
}

export default async function RequestPage({ params }: RequestPageProps) {
  const resolvedParams = params instanceof Promise ? await params : params
  const requestId = resolvedParams.requestId
  const request = await getClientRequestById(requestId)
  
  if (!request) {
    notFound()
  }
  
  const spark = request.sparkId ? await getSparkById(request.sparkId) : null
  
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ClientRequestDetails initialRequest={request} initialSpark={spark} />
    </Suspense>
  )
} 