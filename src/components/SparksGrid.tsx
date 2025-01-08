import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, CheckCircle, BadgeCheck } from 'lucide-react';
import { ExpertCall } from '../types/expertCall';
import { Logo } from './Logo';

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
                        transform-gpu hover:scale-[1.02]
                        ${expandedCallIndex === index ? 'sm:col-span-2 md:row-span-3' : ''}`}
                    onClick={() => {
                        if (expandedCallIndex === index) {
                            return;
                        }
                        setExpandedCallIndex(expandedCallIndex === index ? null : index);
                    }}
                >
                    <div className="p-4 sm:p-6 h-full flex flex-col">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 text-left line-clamp-3">
                                    <Logo className="h-5 w-5 inline-block align-text-bottom mr-2" color="indigo-600" />
                                    {call.title}
                                </h3>
                                <div className="flex flex-col gap-1 mt-2">
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Clock className="h-4 w-4" />
                                        <span>{call.duration}</span>
                                    </div>
                                    <div className="text-sm font-bold text-gray-900 text-left">{call.price}</div>
                                </div>
                            </div>
                            {call.highlight && (
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                    {call.highlight}
                                </span>
                            )}
                        </div>

                        {expandedCallIndex === index ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col flex-grow"
                            >
                                <p className="text-gray-600 text-sm mb-4 text-left">
                                    {call.description}
                                </p>

                                {call.benefits && (
                                    <div className="space-y-2 mb-6">
                                        <div className="text-sm font-medium text-gray-900 mb-2 text-left">Bénéfices :</div>
                                        {call.benefits.map((benefit, i) => (
                                            <div key={i} className="flex items-start gap-2 text-left">
                                                <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm text-gray-600">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-auto">
                                    <div className="text-center mb-3">
                                        <div className="text-sm text-gray-500">Prochaine disponibilité</div>
                                        <div className="text-sm font-medium text-gray-900">
                                            Lundi 15 avril, 14h00
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onCallClick(call.prefillText);
                                            setExpandedCallIndex(null);
                                        }}
                                        className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg 
                                                text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center 
                                                justify-center gap-2"
                                    >
                                        {buttonText}
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="flex flex-col flex-grow">
                                <div className="mt-auto flex items-center justify-end text-sm">
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