import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { Spark } from '../types/spark';
import { SparkCard } from './SparkCard';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

interface SparksGridProps {
    sparks: Spark[];
    onCreateSpark: () => void;
    onPreviewSpark: (sparkSlug: string) => void;
    onEditSpark: (sparkSlug: string) => void;
    onAIEditSpark: (sparkSlug: string) => void;
    onDeleteSpark: (sparkSlug: string) => void;
}

export function SparksGrid({
    sparks,
    onCreateSpark,
    onPreviewSpark,
    onEditSpark,
    onAIEditSpark,
    onDeleteSpark
}: SparksGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
                onClick={onCreateSpark}
                className="bg-white rounded-xl shadow-md p-6 cursor-pointer border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors flex flex-col items-center justify-center min-h-[250px]"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
            >
                <Plus className="h-12 w-12 text-blue-500 mb-4" />
                <h2 className="text-xl font-semibold text-blue-600">Créer un Spark</h2>
                <p className="text-gray-500 text-sm text-center mt-2">Cliquez pour créer un nouveau Spark</p>
            </motion.div>

            {sparks.map((spark) => (
                <SparkCard
                    key={spark.slug}
                    spark={spark}
                    onPreview={onPreviewSpark}
                    onEdit={onEditSpark}
                    onAIEdit={onAIEditSpark}
                    onDelete={onDeleteSpark}
                />
            ))}
        </div>
    );
} 