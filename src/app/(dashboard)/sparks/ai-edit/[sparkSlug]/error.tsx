'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import logger from '@/utils/logger'

export default function SparkError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to the server
    logger.error('Spark edit error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Une erreur est survenue</h1>
        <p className="text-gray-600 mb-6">
          Impossible de charger ou de modifier le spark. Veuillez réessayer plus tard.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Réessayer
          </button>
          <Link 
            href="/admin/sparks"
            className="inline-flex items-center justify-center px-5 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Retour aux sparks
          </Link>
        </div>
      </div>
    </div>
  )
} 