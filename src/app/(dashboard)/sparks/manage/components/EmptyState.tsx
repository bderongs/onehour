'use client';

import { motion } from 'framer-motion';
import { Plus, Eye, Sparkles, Rocket } from 'lucide-react';

interface EmptyStateProps {
    onCreateSpark: () => void;
}

export const EmptyState = ({ onCreateSpark }: EmptyStateProps) => (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
        >
            <Rocket className="h-20 w-20 text-blue-500" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Lancez votre premier Spark !</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            Créez votre premier Spark en quelques minutes grâce à notre assistant IA.
            Partagez votre expertise et développez une nouvelle source de revenus avec des appels optimisés et semi-automatisés.
        </p>
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <button
                onClick={onCreateSpark}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg flex items-center gap-2 transition-colors"
            >
                <Plus className="h-6 w-6" />
                Créer mon premier Spark
            </button>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <Sparkles className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Création rapide avec l'assistant IA</h3>
                <p className="text-gray-600">Notre assistant vous guide pour créer un Spark professionnel en quelques minutes</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <Eye className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Attirez des clients</h3>
                <p className="text-gray-600">Augmentez votre visibilité et trouvez de nouveaux clients qualifiés</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <Rocket className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Optimisez vos revenus</h3>
                <p className="text-gray-600">Maximisez l'impact de vos appels grâce à un processus semi-automatisé</p>
            </div>
        </div>
    </div>
); 