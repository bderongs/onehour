import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, CheckCircle, Users, FileText, Target, Star, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { Spark } from '../types/spark';
import { sparks } from '../data/sparks';
import { Logo } from '../components/Logo';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

export function SparkProductPage() {
    const { sparkUrl } = useParams();
    const navigate = useNavigate();
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    // Find the spark by URL
    const spark = sparks.find(s => s.url === sparkUrl);

    // If spark not found, redirect to home
    if (!spark) {
        navigate('/');
        return null;
    }

    const handleBooking = () => {
        // Navigate to LandingConsultants page with hash
        navigate('/consultants#signup-form');
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            {/* Mobile Back Button */}
            <div className="lg:hidden sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 p-4 text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Retour</span>
                </button>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-6 lg:py-12">
                {/* Hero Section */}
                <motion.div
                    className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8"
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                >
                    <div className="flex flex-col gap-6 lg:gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-3 lg:mb-4">
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{spark.title}</h1>
                                {spark.highlight && (
                                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                        {spark.highlight}
                                    </span>
                                )}
                            </div>
                            <p className="text-base lg:text-lg text-gray-600 mb-4 lg:mb-6">{spark.description}</p>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Clock className="h-5 w-5" />
                                    <span>{spark.duration}</span>
                                </div>
                                <div className="text-xl font-bold text-gray-900">{spark.price}</div>
                            </div>
                        </div>
                        {/* Desktop Booking Button */}
                        <div className="hidden lg:flex justify-end">
                            <button
                                onClick={handleBooking}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 
                                        transition-colors flex items-center gap-2 whitespace-nowrap"
                            >
                                Créer mon premier Spark
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>
                        {/* Mobile Booking Button */}
                        <div className="lg:hidden w-full">
                            <button
                                onClick={handleBooking}
                                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold 
                                        hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                Créer mon premier Spark
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                        {/* Detailed Description */}
                        <motion.section
                            className="bg-white rounded-xl shadow-md p-4 sm:p-6"
                            variants={fadeInUp}
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
                                variants={fadeInUp}
                            >
                                <h2 className="text-lg lg:text-xl font-semibold mb-4">Méthodologie</h2>
                                <div className="space-y-3">
                                    {spark.methodology.map((step, index) => (
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
                                variants={fadeInUp}
                            >
                                <h2 className="text-lg lg:text-xl font-semibold mb-4">Ce que vous obtiendrez</h2>
                                <div className="space-y-3">
                                    {spark.deliverables.map((deliverable, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <p className="text-gray-600 text-sm lg:text-base">{deliverable}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* FAQ */}
                        {spark.faq && (
                            <motion.section
                                className="bg-white rounded-xl shadow-md p-4 sm:p-6"
                                variants={fadeInUp}
                            >
                                <h2 className="text-lg lg:text-xl font-semibold mb-4">Questions fréquentes</h2>
                                <div className="space-y-4">
                                    {spark.faq.map((item, index) => (
                                        <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                                            <button
                                                className="w-full flex items-center justify-between text-left"
                                                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                            >
                                                <span className="font-medium text-gray-900 text-sm lg:text-base pr-4">{item.question}</span>
                                                {expandedFaq === index ? (
                                                    <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                                ) : (
                                                    <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                                )}
                                            </button>
                                            {expandedFaq === index && (
                                                <p className="mt-2 text-gray-600 text-sm lg:text-base">{item.answer}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Testimonials */}
                        {spark.testimonials && (
                            <motion.section
                                className="bg-white rounded-xl shadow-md p-4 sm:p-6"
                                variants={fadeInUp}
                            >
                                <h2 className="text-lg lg:text-xl font-semibold mb-4">Ce qu'en disent nos clients</h2>
                                <div className="space-y-6">
                                    {spark.testimonials.map((testimonial, index) => (
                                        <div key={index} className="border-l-4 border-blue-200 pl-4">
                                            <p className="text-gray-600 italic mb-2 text-sm lg:text-base">{testimonial.text}</p>
                                            <div className="text-xs lg:text-sm">
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
                    <div className="space-y-6 lg:space-y-8">
                        {/* Target Audience */}
                        {spark.targetAudience && (
                            <motion.section
                                className="bg-white rounded-xl shadow-md p-4 sm:p-6"
                                variants={fadeInUp}
                            >
                                <h2 className="text-lg lg:text-xl font-semibold mb-4">Pour qui ?</h2>
                                <div className="space-y-3">
                                    {spark.targetAudience.map((audience, index) => (
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
                                variants={fadeInUp}
                            >
                                <h2 className="text-lg lg:text-xl font-semibold mb-4">Prérequis</h2>
                                <div className="space-y-3">
                                    {spark.prerequisites.map((prerequisite, index) => (
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
                                variants={fadeInUp}
                            >
                                <h2 className="text-lg lg:text-xl font-semibold mb-4">Profil de l'expert</h2>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">Expertise</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {spark.expertProfile.expertise.map((exp, index) => (
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
                                variants={fadeInUp}
                            >
                                <h2 className="text-lg lg:text-xl font-semibold mb-4">Prochaines étapes</h2>
                                <div className="space-y-3">
                                    {spark.nextSteps.map((step, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <p className="text-gray-600 text-sm lg:text-base">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Desktop Booking CTA - Sticky */}
                        <motion.div
                            className="hidden lg:block sticky top-8"
                            variants={fadeInUp}
                        >
                            <button
                                onClick={handleBooking}
                                className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold 
                                        hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                Créer mon premier Spark
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
} 