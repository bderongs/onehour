/**
 * page.tsx
 * Server component for creating a new spark with AI assistance.
 * Sets the consultant ID directly in the initialSpark to avoid client-side state issues.
 */
import { Suspense } from 'react'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { DEFAULT_SPARK } from '../constants'
import SparkAIEditor from '../components/SparkAIEditor'
import SparkAIEditorSkeleton from '../components/SparkAIEditorSkeleton'
import { getCurrentUser } from '@/services/auth/server'
import logger from '@/utils/logger'

export const metadata: Metadata = {
  title: 'Créer un Spark avec l\'IA | Sparkier',
  description: 'Utilisez l\'intelligence artificielle pour créer un nouveau Spark rapidement et efficacement.',
  openGraph: {
    title: 'Créer un Spark avec l\'IA | Sparkier',
    description: 'Utilisez l\'intelligence artificielle pour créer un nouveau Spark rapidement et efficacement.',
    type: 'website',
  }
}

export default async function CreateSparkPage() {
  // Get the current user on the server
  const user = await getCurrentUser()
  
  // Redirect if not authenticated
  if (!user) {
    redirect('/auth/signin')
  }
  
  // Only allow consultants and admins to access this page
  if (!user.roles?.includes('consultant') && !user.roles?.includes('admin')) {
    redirect('/')
  }
  
  // Create initial spark with consultant ID already set
  const initialSpark = {
    ...DEFAULT_SPARK,
    // Set consultant ID directly for consultants, null for admins
    consultant: user.roles?.includes('admin') ? null : user.id
  }
  
  logger.info('Creating new spark with consultant ID:', initialSpark.consultant)
  
  return (
    <Suspense fallback={<SparkAIEditorSkeleton />}>
      <SparkAIEditor 
        mode="create"
        initialSpark={initialSpark}
        pageTitle="Créer un Spark avec l'IA"
      />
    </Suspense>
  )
} 