import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MessageSquare, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export function ClientDashboard() {
    const navigate = useNavigate();

    const menuItems = [
        {
            title: 'Explorer les Sparks',
            description: 'Découvrez les offres de conseil disponibles',
            icon: <Sparkles className="h-8 w-8 text-blue-500" />,
            onClick: () => navigate('/sparks/explore'),
            cta: 'Voir les Sparks',
            highlight: true
        },
        {
            title: 'Mes conversations',
            description: 'Accédez à vos échanges avec les consultants',
            icon: <MessageSquare className="h-8 w-8 text-blue-500" />,
            onClick: () => navigate('/client/conversations'),
            cta: 'Voir les conversations'
        },
        {
            title: 'Mes documents',
            description: 'Retrouvez tous vos documents et livrables',
            icon: <FileText className="h-8 w-8 text-blue-500" />,
            onClick: () => navigate('/client/documents'),
            cta: 'Voir les documents'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">
                        Tableau de bord client
                    </h1>

                    {/* Menu Grid */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {menuItems.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
                                    item.highlight ? 'ring-2 ring-blue-500' : ''
                                }`}
                            >
                                <div className="p-6">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="flex-shrink-0 mb-4">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                                {item.title}
                                            </h2>
                                            <p className="text-gray-600 mb-4">
                                                {item.description}
                                            </p>
                                            <button
                                                onClick={item.onClick}
                                                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                                                    item.highlight
                                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                                }`}
                                            >
                                                {item.cta}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 