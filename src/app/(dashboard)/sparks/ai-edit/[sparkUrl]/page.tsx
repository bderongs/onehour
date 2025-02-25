import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DEFAULT_SPARK } from '../../constants'
import SparkAIEditor from '../../components/SparkAIEditor'
import SparkAIEditorSkeleton from '../../components/SparkAIEditorSkeleton'
import { getSparkByUrl } from './actions'

interface EditSparkPageProps {
  params: Promise<{ sparkUrl: string }> | { sparkUrl: string }
  searchParams?: Record<string, string | string[] | undefined>
}

export async function generateMetadata({ params }: EditSparkPageProps): Promise<Metadata> {
  const resolvedParams = params instanceof Promise ? await params : params
  const sparkUrl = resolvedParams.sparkUrl
  const spark = await getSparkByUrl(sparkUrl)
  
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
  const sparkUrl = resolvedParams.sparkUrl
  const spark = await getSparkByUrl(sparkUrl)
  
  if (!spark) {
    notFound()
  }
  
  return (
    <Suspense fallback={<SparkAIEditorSkeleton />}>
      <SparkAIEditor 
        mode="edit"
        initialSpark={spark}
        sparkUrl={sparkUrl}
        pageTitle="Modifier le Spark avec l'IA"
      />
    </Suspense>
  )
} 
