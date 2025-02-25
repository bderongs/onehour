'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const EmptyState = () => {
    const router = useRouter()
    
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <Sparkles className="h-20 w-20 text-blue-500" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Aucune demande en cours</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Vous n'avez pas encore fait de demande de conseil. Découvrez nos Sparks pour trouver le conseil qui vous correspond.
            </p>
            <button
                onClick={() => router.push('/')}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Explorer les Sparks
            </button>
        </div>
    )
} 