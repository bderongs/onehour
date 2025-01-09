import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, CheckCircle, BadgeCheck } from 'lucide-react';
import { ExpertCall } from '../types/expertCall';
import { Logo } from './Logo';

// Utility function to get next available business date
const getNextBusinessDate = () => {
    const date = new Date();
    const randomDays = Math.floor(Math.random() * 2) + 1; // 1 or 2 days
    
    for (let i = 0; i < randomDays;) {
        date.setDate(date.getDate() + 1);
        // Skip weekends (0 is Sunday, 6 is Saturday)
        if (date.getDay() !== 0 && date.getDay() !== 6) {
            i++;
        }
    }

    // Generate random time
    // First decide morning (9-12) or afternoon (13-18)
    const isMorning = Math.random() < 0.5;
    let hours;
    if (isMorning) {
        hours = Math.floor(Math.random() * (12 - 9 + 1)) + 9; // 9 to 12
    } else {
        hours = Math.floor(Math.random() * (18 - 13 + 1)) + 13; // 13 to 18
    }
    
    // Generate random minutes (0, 15, 30, 45)
    const minutes = Math.floor(Math.random() * 4) * 15;
    
    date.setHours(hours, minutes, 0);
    
    // Format the date in French
    return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: 'numeric',
        minute: '2-digit'
    });
};

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
    // Memoize the dates for each card
    const availableDates = useMemo(() => {
        return expertCalls.map(() => getNextBusinessDate());
    }, [expertCalls.length]); // Only regenerate if the number of calls changes

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto px-4 sm:px-0">
            {expertCalls.map((call, index) => (
                <motion.div
                    key={index}
                    layout
                    variants={fadeInUp}
                    className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer
                        transform-gpu hover:scale-[1.02]
                        ${expandedCallIndex === index ? 'sm:col-span-2 md:row-span-3 h-full' : ''}`}
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
                                className="flex flex-col flex-grow mt-4"
                            >
                                <div className="border-t border-gray-100" />
                                
                                <div className="space-y-4 py-4 flex-grow">
                                    <p className="text-gray-600 text-sm leading-relaxed text-left">
                                        {call.description}
                                    </p>

                                    {call.benefits && (
                                        <div className="space-y-3 text-left">
                                            <div className="text-sm font-medium text-gray-900">Ce que vous obtiendrez :</div>
                                            <div className="space-y-2.5">
                                                {call.benefits.map((benefit, i) => (
                                                    <div key={i} className="flex items-start gap-2">
                                                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                                        <span className="text-sm text-gray-600 leading-relaxed">{benefit}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4 border-t border-gray-100 pt-4">
                                    <div className="text-center">
                                        <div className="text-sm text-gray-500">Prochaine disponibilité</div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {availableDates[index]}
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