import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, CheckCircle, BadgeCheck, Sparkle } from 'lucide-react';
import { ExpertCall } from '../types/expertCall';

interface SparksGridProps {
    expertCalls: ExpertCall[];
    expandedCallIndex: number | null;
    setExpandedCallIndex: (index: number | null) => void;
    onCallClick: (prefillText: string) => void;
    buttonText: string;
}

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

export function SparksGrid({
    expertCalls,
    expandedCallIndex,
    setExpandedCallIndex,
    onCallClick,
    buttonText
}: SparksGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto px-4 sm:px-0">
            {expertCalls.map((call, index) => (
                <motion.div
                    key={index}
                    layout
                    variants={fadeInUp}
                    className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer
                        ${expandedCallIndex === index ? 'sm:col-span-2 md:row-span-3' : ''}`}
                    onClick={() => {
                        if (expandedCallIndex === index) {
                            return;
                        }
                        setExpandedCallIndex(expandedCallIndex === index ? null : index);
                    }}
                >
                    <div className="p-3 sm:p-4 h-full flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-blue-50 rounded-lg w-fit">
                                <Sparkle className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900 text-left line-clamp-2">
                                {call.title}
                            </h3>
                        </div>

                        {expandedCallIndex === index ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col flex-grow"
                            >
                                <p className="text-gray-600 text-sm mb-3 sm:mb-4 text-left">
                                    {call.description}
                                </p>

                                <div className="space-y-3 sm:space-y-4 mb-3 sm:mb-4">
                                    <div className="flex items-center gap-2 text-gray-900 text-left">
                                        <Clock className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm">{call.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-900 text-left">
                                        <BadgeCheck className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm">{call.price}</span>
                                    </div>
                                </div>

                                {call.benefits && (
                                    <div className="space-y-2 mb-4 sm:mb-6">
                                        {call.benefits.map((benefit, i) => (
                                            <div key={i} className="flex items-start gap-2 text-left">
                                                <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                                <span className="text-xs sm:text-sm text-gray-600">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onCallClick(call.prefillText);
                                        setExpandedCallIndex(null);
                                    }}
                                    className="mt-auto w-full bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg 
                                             text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center 
                                             justify-center gap-2"
                                >
                                    {buttonText}
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </motion.div>
                        ) : (
                            <div className="flex flex-col flex-grow">
                                <div className="mt-auto flex items-center justify-between text-xs sm:text-sm text-left">
                                    <div className="flex items-center gap-1 text-gray-600">
                                        <Clock className="h-4 w-4" />
                                        <span>{call.duration}</span>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-blue-600" />
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
} 