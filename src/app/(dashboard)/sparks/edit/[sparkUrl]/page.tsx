import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SparkEditForm } from './_components/SparkEditForm'
import { getSparkByUrl } from './actions'

interface PageProps {
    params: Promise<{ sparkUrl: string }> | { sparkUrl: string }
    searchParams?: Record<string, string | string[] | undefined>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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
        description: `Modifier le spark ${spark.title}.`,
        openGraph: {
            title: `Modifier ${spark.title} | Sparkier`,
            description: `Modifier le spark ${spark.title}.`,
            type: 'website',
        }
    }
}

export default async function Page({ params }: PageProps) {
    const resolvedParams = params instanceof Promise ? await params : params
    const sparkUrl = resolvedParams.sparkUrl
    const spark = await getSparkByUrl(sparkUrl)
    
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