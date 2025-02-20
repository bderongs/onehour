'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Package2, Clock, Store } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { SparksGrid } from '@/components/SparksGrid';
import { getSparks } from '@/services/sparks';
import type { Spark } from '@/types/spark';
import { ConsultantSignUpForm } from '@/components/ConsultantSignUpForm';
import '@/styles/highlight.css';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function LandingConsultants() {
    const router = useRouter();
    const [sparks, setSparks] = useState<Spark[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedCallIndex, setExpandedCallIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchSparks = async () => {
            try {
                const fetchedSparks = await getSparks();
                setSparks(fetchedSparks);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching sparks:', err);
                setError('Impossible de charger les sparks. Veuillez réessayer plus tard.');
                setLoading(false);
            }
        };

        fetchSparks();
    }, []);

    useEffect(() => {
        // Handle hash-based navigation
        if (window.location.hash === '#signup-form') {
            const element = document.getElementById('signup-form');
            if (element) {
                const headerOffset = 120;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }, []); // Run only once when component mounts

    useEffect(() => {
        // Always set the first Spark (index 0) to be expanded on load
        if (expandedCallIndex === null) {
            setExpandedCallIndex(0);
        }
    }, []);

    const handleSparkCreation = () => {
        const element = document.getElementById('signup-form');
        const headerOffset = 120;

        if (element) {
            setTimeout(() => {
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Hero Section */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight px-2">
                        Accélérez votre activité de conseil avec des <span className="highlight">offres packagées</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8 sm:mb-12 px-2">
                        Transformez vos expertises en <span className="highlight">Sparks</span> : des modules de conseil packagés et <span className="highlight">prêts à vendre</span>.
                    </p>

                    {/* Example Sparks Section */}
                    <div className="text-center mb-6">
                        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                            Exemples de Sparks populaires
                        </h3>
                        <p className="text-gray-600 max-w-3xl mx-auto mb-6">
                            Découvrez comment d'autres consultants structurent leurs offres. Inspirez-vous de ces exemples pour créer vos propres Sparks personnalisés.
                        </p>
                    </div>

                    {/* Sparks Grid */}
                    <div className="mb-12 sm:mb-16">
                        {loading ? (
                            <div className="text-center py-8">
                                <LoadingSpinner message="Chargement des Sparks..." />
                            </div>
                        ) : error ? (
                            <div className="text-center py-8">
                                <p className="text-red-600">{error}</p>
                            </div>
                        ) : (
                            <SparksGrid
                                sparks={sparks.filter(spark => [
                                    'fda49682-dd97-4e3a-b9db-52a234348454',
                                    '60f1dcb7-a91b-4821-9fdd-7c19f240aa4d',
                                    '886c9a5c-19f6-429e-90fd-e3305eb37cf8'
                                ].includes(spark.id))}
                                expandedCallIndex={expandedCallIndex}
                                setExpandedCallIndex={setExpandedCallIndex}
                                onCallClick={handleSparkCreation}
                                buttonText="Créer mon premier Spark"
                                showAvailability={false}
                                showCreateCard={true}
                                showDetailsButton={true}
                                onDetailsClick={(spark) => {
                                    router.push(`/spark/${spark.url}`);
                                }}
                            />
                        )}
                    </div>

                    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8 sm:mb-12 px-2">
                        Avec <span className="highlight">Sparkier.io</span>, dites adieu aux échanges interminables et aux négociations fastidieuses. Créez des <span className="highlight">Sparks</span> — des missions ultra-claires et packagées de 30 minutes à 2 heures — qui vous permettent de convertir des prospects en clients en un clic, et d'offrir une expérience de conseil simple, rapide et efficace.
                    </p>

                    <motion.div
                        className="flex flex-col sm:flex-row justify-center gap-4"
                        variants={stagger}
                        initial="initial"
                        animate="animate"
                    >
                        <motion.button
                            variants={fadeInUp}
                            onClick={() => document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2 group"
                        >
                            <span className="whitespace-nowrap">Créer mes premiers Sparks gratuitement</span>
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </motion.button>
                        <motion.div variants={fadeInUp} className="w-full sm:w-auto">
                            <Link
                                href="/profile"
                                className="w-full sm:w-auto bg-white text-blue-600 border-2 border-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center gap-2 group"
                            >
                                <span className="whitespace-nowrap">Voir un profil exemple</span>
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Key Features Section */}
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 px-2">
                        Pourquoi adopter <span className="highlight">Sparkier.io</span> pour vos offres de conseil ?
                    </h2>
                </div>

                <div
                    id="key-features"
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-12 sm:mb-16"
                >
                    {[
                        {
                            title: "Des offres prêtes à vendre en quelques minutes",
                            description: "Plus besoin de rédiger des dizaines de pages de propositions. Notre IA vous accompagne via un chatbot intuitif : décrivez vos compétences et vos services, et laissez l'IA construire automatiquement des Sparks clairs et attrayants.",
                            icon: <Package2 className="h-6 w-6" />
                        },
                        {
                            title: "Votre vitrine de conseil personnelle",
                            description: "Chaque consultant dispose d'une page personnalisée présentant ses Sparks. Vos prospects peuvent parcourir vos offres, choisir celle qui correspond à leurs besoins et prendre rendez-vous instantanément. Simplifiez l'achat de vos services !",
                            icon: <Store className="h-6 w-6" />
                        },
                        {
                            title: "Une IA qui prépare vos sessions",
                            description: "Avant chaque mission, notre IA mène un entretien exploratoire avec le client et vous fournit un brief ultra-précis. Plus besoin de perdre du temps à clarifier les attentes : vous êtes efficace dès la première minute.",
                            icon: <Sparkles className="h-6 w-6" />
                        },
                        {
                            title: "Gagnez du temps, augmentez vos revenus",
                            description: "En packageant vos offres avec Sparkier.io, vous réduisez le temps passé en phase commerciale et maximisez votre temps de conseil facturable. Plus de missions, moins de stress !",
                            icon: <Clock className="h-6 w-6" />
                        }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            className="bg-white rounded-xl p-6 sm:p-8 shadow-md"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                                <div className="p-2 sm:p-3 bg-blue-50 rounded-lg w-fit h-fit">
                                    {React.cloneElement(feature.icon as React.ReactElement, {
                                        className: "h-6 w-6 text-blue-600"
                                    })}
                                </div>
                                <div className="text-left">
                                    <h3 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Sign Up Form */}
                <div id="signup-form" className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Créez vos premiers Sparks gratuitement !
                        </h2>
                        <p className="text-gray-600">
                            Commencez à packager vos offres de conseil dès maintenant
                        </p>
                    </div>

                    <ConsultantSignUpForm 
                        className="bg-white p-8 rounded-xl shadow-md"
                        buttonText="Créer mon profil gratuitement"
                    />
                </div>
            </div>
        </div>
    );
} 