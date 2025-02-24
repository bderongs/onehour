'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Step {
    icon: React.ReactElement;
    title: string;
    description: string;
}

interface MarketingHowItWorksProps {
    steps: Step[];
}

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

export function HowItWorks({ steps }: MarketingHowItWorksProps) {
    return (
        <motion.div
            id="how-it-works"
            className="mb-24"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">
                    Comment ça <span className="highlight">marche</span> ?
                </h2>
                <p className="text-xl text-gray-600">
                    Un processus simple en quatre étapes
                </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        variants={fadeInUp}
                        className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-blue-100 shadow-md text-center"
                    >
                        <div className="p-3 bg-blue-50 rounded-lg w-fit mx-auto mb-4">
                            {React.cloneElement(step.icon, { className: "h-6 w-6 text-blue-600" })}
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
} 