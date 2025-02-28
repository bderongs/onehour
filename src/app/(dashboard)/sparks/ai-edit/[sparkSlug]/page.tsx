/**
 * page.tsx
 * Server component for AI-assisted spark editing
 */
import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DEFAULT_SPARK } from '../../constants'
import SparkAIEditor from '../../components/SparkAIEditor'
import SparkAIEditorSkeleton from '../../components/SparkAIEditorSkeleton'
import { getSparkBySlug } from './actions'

interface EditSparkPageProps {
  params: Promise<{ sparkSlug: string }> | { sparkSlug: string }
  searchParams?: Record<string, string | string[] | undefined>
}

export async function generateMetadata({ params }: EditSparkPageProps): Promise<Metadata> {
  const resolvedParams = params instanceof Promise ? await params : params
  const sparkSlug = resolvedParams.sparkSlug
  const spark = await getSparkBySlug(sparkSlug)
  
  if (!spark) {
    return {
      title: 'Spark non trouvé | Sparkier',
      description: 'Le spark demandé n\'existe pas.',
    }
  }
  
  return {
    title: `Modifier ${spark.title} | Sparkier`,
    description: `Utilisez l'intelligence artificielle pour modifier le spark ${spark.title}.`,
    openGraph: {
      title: `Modifier ${spark.title} | Sparkier`,
      description: `Utilisez l'intelligence artificielle pour modifier le spark ${spark.title}.`,
      type: 'website',
    }
  }
}

export default async function EditSparkPage({ params }: EditSparkPageProps) {
  const resolvedParams = params instanceof Promise ? await params : params
  const sparkSlug = resolvedParams.sparkSlug
  const spark = await getSparkBySlug(sparkSlug)
  
  if (!spark) {
    notFound()
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Suspense fallback={<SparkAIEditorSkeleton />}>
        <SparkAIEditor 
          mode="edit"
          initialSpark={spark}
          sparkSlug={sparkSlug}
          pageTitle="Modifier avec l'IA"
        />
      </Suspense>
    </div>
  )
} 
