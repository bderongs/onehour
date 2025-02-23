'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface Feature {
    title: string;
    description: string;
    icon: React.ReactElement;
}

interface MarketingFeaturesProps {
    features: Feature[];
}

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

export function Features({ features }: MarketingFeaturesProps) {
    return (
        <motion.div
            id="spark"
            className="mb-24"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">
                    Le <span className="highlight">Spark</span>: un concentré de conseil
                </h2>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                    Une décision importante à prendre ? Un problème à régler ? Besoin de visibilité sur un sujet complexe ?
                    Chaque module Spark vous permet de répondre à une problématique précise.
                </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        variants={fadeInUp}
                        className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-blue-100 shadow-md text-center"
                    >
                        <div className="p-3 bg-blue-50 rounded-lg w-fit mx-auto mb-4">
                            {React.cloneElement(feature.icon, { className: "h-6 w-6 text-blue-600" })}
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
} 
