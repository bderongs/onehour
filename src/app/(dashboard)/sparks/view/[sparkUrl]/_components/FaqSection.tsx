/**
 * This client component displays an accordion of frequently asked questions
 * It allows users to expand/collapse individual FAQ items
 */
'use client'

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

type FaqItem = {
    question: string;
    answer: string;
};

interface FaqSectionProps {
    faq: FaqItem[];
}

export function FaqSection({ faq }: FaqSectionProps) {
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    return (
        <motion.section
            className="bg-white rounded-xl shadow-md p-4 sm:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-lg lg:text-xl font-semibold mb-4">Questions fréquentes</h2>
            <div className="space-y-4">
                {faq.map((item, index) => (
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
    );
} 