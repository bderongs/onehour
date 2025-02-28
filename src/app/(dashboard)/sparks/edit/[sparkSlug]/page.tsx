/**
 * page.tsx
 * Server component for editing an existing Spark, fetches the Spark data and renders the edit form
 */
import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SparkEditForm } from './_components/SparkEditForm'
import { getSparkBySlug } from './actions'

interface PageProps {
    params: Promise<{ sparkSlug: string }> | { sparkSlug: string }
    searchParams?: Record<string, string | string[] | undefined>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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
        description: `Modifier les détails du spark ${spark.title}`,
        openGraph: {
            title: `Modifier ${spark.title} | Sparkier`,
            description: `Modifier le spark ${spark.title}.`,
            type: 'website',
        }
    }
}

export default async function Page({ params }: PageProps) {
    const resolvedParams = params instanceof Promise ? await params : params
    const sparkSlug = resolvedParams.sparkSlug
    const spark = await getSparkBySlug(sparkSlug)
    
    if (!spark) {
        notFound()
    }
    
    const sparkData = {
        ...spark,
        price: spark.price || '0'
    }
    
    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Suspense fallback={<div>Chargement...</div>}>
                    <SparkEditForm spark={sparkData} />
                </Suspense>
            </div>
        </div>
    )
} 