import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, Settings, Zap, UserCog } from 'lucide-react';
import { motion } from 'framer-motion';

export function AdminDashboard() {
    const navigate = useNavigate();

    const menuItems = [
        {
            title: 'Gestion des consultants',
            description: 'Gérez les profils et les accès des consultants',
            icon: <Briefcase className="h-8 w-8 text-blue-500" />,
            onClick: () => navigate('/admin/consultants'),
            cta: 'Gérer les consultants',
            isImplemented: true
        },
        {
            title: 'Gestion des clients',
            description: 'Gérez les comptes et les accès des clients',
            icon: <Users className="h-8 w-8 text-blue-500" />,
            onClick: () => navigate('/admin/clients'),
            cta: 'Gérer les clients',
            isImplemented: true
        },
        {
            title: 'Gestion des sparks',
            description: 'Gérez les sparks et leurs configurations',
            icon: <Zap className="h-8 w-8 text-blue-500" />,
            onClick: () => navigate('/admin/sparks'),
            cta: 'Gérer les sparks',
            isImplemented: true
        },
        {
            title: 'Gestion des rôles',
            description: 'Gérez les rôles des utilisateurs',
            icon: <UserCog className="h-8 w-8 text-blue-500" />,
            onClick: () => navigate('/admin/roles'),
            cta: 'Gérer les rôles',
            isImplemented: true
        },
        {
            title: 'Paramètres',
            description: 'Configuration générale de la plateforme',
            icon: <Settings className="h-8 w-8 text-blue-500" />,
            onClick: () => navigate('/admin/settings'),
            cta: 'Configurer',
            isImplemented: false
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
                        Administration
                    </h1>

                    {/* Menu Grid */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {menuItems.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
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
                                                    item.isImplemented
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