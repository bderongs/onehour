import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, CheckCircle, Users, FileText, Target, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Spark } from '../types/spark';
import { sparks } from '../data/sparks';
import { Logo } from '../components/Logo';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

export function SparkProductPage() {
    const { sparkId } = useParams();
    const navigate = useNavigate();
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    // Find the spark by ID (you'll need to implement this based on your routing strategy)
    const spark = sparks[parseInt(sparkId || '0')] || sparks[0];

    const handleBooking = () => {
        // Implement your booking logic here
        console.log('Booking spark:', spark.title);
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            <div className="max-w-5xl mx-auto px-4 py-12">
                {/* Hero Section */}
                <motion.div
                    className="bg-white rounded-2xl shadow-lg p-8 mb-8"
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                >
                    <div className="flex items-start justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Logo className="h-6 w-6" color="indigo-600" />
                                {spark.highlight && (
                                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                        {spark.highlight}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{spark.title}</h1>
                            <p className="text-lg text-gray-600 mb-6">{spark.description}</p>
                            <div className="flex flex-wrap gap-4 mb-6">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Clock className="h-5 w-5" />
                                    <span>{spark.duration}</span>
                                </div>
                                <div className="text-xl font-bold text-gray-900">{spark.price}</div>
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <button
                                onClick={handleBooking}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 
                                        transition-colors flex items-center gap-2"
                            >
                                Réserver maintenant
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Detailed Description */}
                        <motion.section
                            className="bg-white rounded-xl shadow-md p-6"
                            variants={fadeInUp}
                        >
                            <h2 className="text-xl font-semibold mb-4">Description détaillée</h2>
                            <p className="text-gray-600 whitespace-pre-line">
                                {spark.detailedDescription}
                            </p>
                        </motion.section>

                        {/* Methodology */}
                        {spark.methodology && (
                            <motion.section
                                className="bg-white rounded-xl shadow-md p-6"
                                variants={fadeInUp}
                            >
                                <h2 className="text-xl font-semibold mb-4">Méthodologie</h2>
                                <div className="space-y-3">
                                    {spark.methodology.map((step, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                                                {index + 1}
                                            </div>
                                            <p className="text-gray-600">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Deliverables */}
                        {spark.deliverables && (
                            <motion.section
                                className="bg-white rounded-xl shadow-md p-6"
                                variants={fadeInUp}
                            >
                                <h2 className="text-xl font-semibold mb-4">Ce que vous obtiendrez</h2>
                                <div className="space-y-3">
                                    {spark.deliverables.map((deliverable, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <p className="text-gray-600">{deliverable}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* FAQ */}
                        {spark.faq && (
                            <motion.section
                                className="bg-white rounded-xl shadow-md p-6"
                                variants={fadeInUp}
                            >
                                <h2 className="text-xl font-semibold mb-4">Questions fréquentes</h2>
                                <div className="space-y-4">
                                    {spark.faq.map((item, index) => (
                                        <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                                            <button
                                                className="w-full flex items-center justify-between text-left"
                                                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                            >
                                                <span className="font-medium text-gray-900">{item.question}</span>
                                                {expandedFaq === index ? (
                                                    <ChevronUp className="h-5 w-5 text-gray-500" />
                                                ) : (
                                                    <ChevronDown className="h-5 w-5 text-gray-500" />
                                                )}
                                            </button>
                                            {expandedFaq === index && (
                                                <p className="mt-2 text-gray-600">{item.answer}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Testimonials */}
                        {spark.testimonials && (
                            <motion.section
                                className="bg-white rounded-xl shadow-md p-6"
                                variants={fadeInUp}
                            >
                                <h2 className="text-xl font-semibold mb-4">Ce qu'en disent nos clients</h2>
                                <div className="space-y-6">
                                    {spark.testimonials.map((testimonial, index) => (
                                        <div key={index} className="border-l-4 border-blue-200 pl-4">
                                            <p className="text-gray-600 italic mb-2">{testimonial.text}</p>
                                            <div className="text-sm">
                                                <span className="font-medium text-gray-900">{testimonial.author}</span>
                                                {(testimonial.role || testimonial.company) && (
                                                    <span className="text-gray-500">
                                                        {testimonial.role && ` • ${testimonial.role}`}
                                                        {testimonial.company && ` • ${testimonial.company}`}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-8">
                        {/* Target Audience */}
                        {spark.targetAudience && (
                            <motion.section
                                className="bg-white rounded-xl shadow-md p-6"
                                variants={fadeInUp}
                            >
                                <h2 className="text-xl font-semibold mb-4">Pour qui ?</h2>
                                <div className="space-y-3">
                                    {spark.targetAudience.map((audience, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <Users className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <p className="text-gray-600">{audience}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Prerequisites */}
                        {spark.prerequisites && (
                            <motion.section
                                className="bg-white rounded-xl shadow-md p-6"
                                variants={fadeInUp}
                            >
                                <h2 className="text-xl font-semibold mb-4">Prérequis</h2>
                                <div className="space-y-3">
                                    {spark.prerequisites.map((prerequisite, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <Target className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <p className="text-gray-600">{prerequisite}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Expert Profile */}
                        {spark.expertProfile && (
                            <motion.section
                                className="bg-white rounded-xl shadow-md p-6"
                                variants={fadeInUp}
                            >
                                <h2 className="text-xl font-semibold mb-4">Profil de l'expert</h2>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">Expertise</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {spark.expertProfile.expertise.map((exp, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm"
                                                >
                                                    {exp}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">Expérience</h3>
                                        <p className="text-gray-600">{spark.expertProfile.experience}</p>
                                    </div>
                                </div>
                            </motion.section>
                        )}

                        {/* Next Steps */}
                        {spark.nextSteps && (
                            <motion.section
                                className="bg-white rounded-xl shadow-md p-6"
                                variants={fadeInUp}
                            >
                                <h2 className="text-xl font-semibold mb-4">Prochaines étapes</h2>
                                <div className="space-y-3">
                                    {spark.nextSteps.map((step, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <p className="text-gray-600">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Booking CTA */}
                        <motion.div
                            className="sticky top-8"
                            variants={fadeInUp}
                        >
                            <button
                                onClick={handleBooking}
                                className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold 
                                        hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                Réserver maintenant
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
} 