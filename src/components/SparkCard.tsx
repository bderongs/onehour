import { motion } from 'framer-motion';
import { Edit2, Eye, Sparkles, Trash2 } from 'lucide-react';
import type { Spark } from '../types/spark';
import { formatDuration, formatPrice } from '../utils/format';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

interface SparkCardProps {
    spark: Spark;
    onPreview: (sparkUrl: string) => void;
    onEdit: (sparkUrl: string) => void;
    onAIEdit: (sparkUrl: string) => void;
    onDelete: (sparkUrl: string) => void;
}

export function SparkCard({
    spark,
    onPreview,
    onEdit,
    onAIEdit,
    onDelete
}: SparkCardProps) {
    return (
        <motion.div
            className="bg-white rounded-xl shadow-md p-6"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{spark.title}</h2>
                    <div className="flex items-center gap-4 text-gray-600 text-sm">
                        <span>{formatDuration(spark.duration)}</span>
                        <span>{formatPrice(spark.price)}</span>
                    </div>
                </div>
                {spark.highlight && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {spark.highlight}
                    </span>
                )}
            </div>
            
            <p className="text-gray-600 mb-6 line-clamp-2">{spark.description}</p>

            <div className="flex items-center gap-3">
                <button
                    onClick={() => onPreview(spark.url)}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    title="Preview"
                >
                    <Eye className="h-5 w-5" />
                </button>
                <button
                    onClick={() => onEdit(spark.url)}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    title="Edit"
                >
                    <Edit2 className="h-5 w-5" />
                </button>
                <button
                    onClick={() => onAIEdit(spark.url)}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                    title="AI Edit"
                >
                    <Sparkles className="h-5 w-5" />
                </button>
                <button
                    onClick={() => onDelete(spark.url)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                    title="Delete"
                >
                    <Trash2 className="h-5 w-5" />
                </button>
            </div>
        </motion.div>
    );
} 