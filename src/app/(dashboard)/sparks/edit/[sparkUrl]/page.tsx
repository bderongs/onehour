import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getSparkByUrl } from '@/services/sparks'
import { SparkEditForm } from './_components/SparkEditForm'
import type { Metadata } from 'next'

interface PageProps {
    params: {
        sparkUrl: string
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const spark = await getSparkByUrl(params.sparkUrl)
    
    if (!spark) {
        return {
            title: 'Spark introuvable',
            description: 'Le spark que vous recherchez n\'existe pas.'
        }
    }

    return {
        title: `Modifier ${spark.title} | Sparkier`,
        description: `Modifier le spark ${spark.title}`
    }
}

export default async function Page({ params }: PageProps) {
    const spark = await getSparkByUrl(params.sparkUrl)

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