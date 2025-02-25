import { CheckCircle, Users, Target, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Spark } from '@/types/spark';

interface SparkContentProps {
    spark: Spark;
}

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

export function SparkContent({ spark }: SparkContentProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                {/* Detailed Description */}
                <motion.section
                    className="bg-white rounded-xl shadow-md p-4 sm:p-6"
                    {...fadeInUp}
                >
                    <h2 className="text-lg lg:text-xl font-semibold mb-4">Description détaillée</h2>
                    <p className="text-gray-600 whitespace-pre-line text-sm lg:text-base">
                        {spark.detailedDescription}
                    </p>
                </motion.section>

                {/* Methodology */}
                {spark.methodology && (
                    <motion.section
                        className="bg-white rounded-xl shadow-md p-4 sm:p-6"
                        {...fadeInUp}
                    >
                        <h2 className="text-lg lg:text-xl font-semibold mb-4">Méthodologie</h2>
                        <div className="space-y-3">
                            {spark.methodology.map((step: string, index: number) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                                        {index + 1}
                                    </div>
                                    <p className="text-gray-600 text-sm lg:text-base">{step}</p>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Deliverables */}
                {spark.deliverables && (
                    <motion.section
                        className="bg-white rounded-xl shadow-md p-4 sm:p-6"
                        {...fadeInUp}
                    >
                        <h2 className="text-lg lg:text-xl font-semibold mb-4">Ce que vous obtiendrez</h2>
                        <div className="space-y-3">
                            {spark.deliverables.map((deliverable: string, index: number) => (
                                <div key={index} className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-gray-600 text-sm lg:text-base">{deliverable}</p>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6 lg:space-y-8">
                {/* Target Audience */}
                {spark.targetAudience && (
                    <motion.section
                        className="bg-white rounded-xl shadow-md p-4 sm:p-6"
                        {...fadeInUp}
                    >
                        <h2 className="text-lg lg:text-xl font-semibold mb-4">Pour qui ?</h2>
                        <div className="space-y-3">
                            {spark.targetAudience.map((audience: string, index: number) => (
                                <div key={index} className="flex items-start gap-3">
                                    <Users className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-gray-600 text-sm lg:text-base">{audience}</p>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Prerequisites */}
                {spark.prerequisites && (
                    <motion.section
                        className="bg-white rounded-xl shadow-md p-4 sm:p-6"
                        {...fadeInUp}
                    >
                        <h2 className="text-lg lg:text-xl font-semibold mb-4">Prérequis</h2>
                        <div className="space-y-3">
                            {spark.prerequisites.map((prerequisite: string, index: number) => (
                                <div key={index} className="flex items-start gap-3">
                                    <Target className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-gray-600 text-sm lg:text-base">{prerequisite}</p>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Expert Profile */}
                {spark.expertProfile && (
                    <motion.section
                        className="bg-white rounded-xl shadow-md p-4 sm:p-6"
                        {...fadeInUp}
                    >
                        <h2 className="text-lg lg:text-xl font-semibold mb-4">Profil de l'expert</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">Expertise</h3>
                                <div className="flex flex-wrap gap-2">
                                    {spark.expertProfile.expertise.map((exp: string, index: number) => (
                                        <span
                                            key={index}
                                            className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs lg:text-sm"
                                        >
                                            {exp}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">Expérience</h3>
                                <p className="text-gray-600 text-sm lg:text-base">{spark.expertProfile.experience}</p>
                            </div>
                        </div>
                    </motion.section>
                )}

                {/* Next Steps */}
                {spark.nextSteps && (
                    <motion.section
                        className="bg-white rounded-xl shadow-md p-4 sm:p-6"
                        {...fadeInUp}
                    >
                        <h2 className="text-lg lg:text-xl font-semibold mb-4">Prochaines étapes</h2>
                        <div className="space-y-3">
                            {spark.nextSteps.map((step: string, index: number) => (
                                <div key={index} className="flex items-start gap-3">
                                    <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-gray-600 text-sm lg:text-base">{step}</p>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                )}
            </div>
        </div>
    );
} 