'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AboutContent {
    title: string;
    description: string;
    icon: React.ReactElement;
}

interface MarketingAboutProps {
    content: AboutContent[];
}

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

export function MarketingAbout({ content }: MarketingAboutProps) {
    return (
        <motion.div
            id="why-sparkier"
            className="mb-24"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">
                    Pourquoi <span className="highlight">Sparkier</span> ?
                </h2>
                <p className="text-xl text-gray-600">
                    Une nouvelle approche du conseil, simple et efficace
                </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                {content.map((item, index) => (
                    <motion.div
                        key={index}
                        variants={fadeInUp}
                        className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-blue-100 shadow-md"
                    >
                        <div className="p-3 bg-blue-50 rounded-lg w-fit mb-4">
                            {React.cloneElement(item.icon, {
                                className: "h-6 w-6 text-blue-600"
                            })}
                        </div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-900">
                            {item.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            {item.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
} 