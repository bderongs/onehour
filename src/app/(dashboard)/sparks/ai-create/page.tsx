import { Suspense } from 'react'
import { Metadata } from 'next'
import { DEFAULT_SPARK } from '../constants'
import SparkAIEditor from '../components/SparkAIEditor'
import SparkAIEditorSkeleton from '../components/SparkAIEditorSkeleton'

export const metadata: Metadata = {
  title: 'Créer un Spark avec l\'IA | Sparkier',
  description: 'Utilisez l\'intelligence artificielle pour créer un nouveau Spark rapidement et efficacement.',
  openGraph: {
    title: 'Créer un Spark avec l\'IA | Sparkier',
    description: 'Utilisez l\'intelligence artificielle pour créer un nouveau Spark rapidement et efficacement.',
    type: 'website',
  }
}

export default function CreateSparkPage() {
  return (
    <Suspense fallback={<SparkAIEditorSkeleton />}>
      <SparkAIEditor 
        mode="create"
        initialSpark={DEFAULT_SPARK}
        pageTitle="Créer un Spark avec l'IA"
      />
    </Suspense>
  )
} 