import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle, Star, ArrowRight, Linkedin, Twitter, Globe, X } from 'lucide-react';
import { LightFooter } from '../components/LightFooter';

interface ServicePackage {
    title: string;
    duration: string;
    price: string;
    description: string;
    deliverables: string[];
    highlight?: string;
}

function getNextWorkingDay(): string {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Keep adding days until we find a weekday (1-5, Monday-Friday)
    while (tomorrow.getDay() === 0 || tomorrow.getDay() === 6) {
        tomorrow.setDate(tomorrow.getDate() + 1);
    }
    
    // Format the date in French
    const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
    };
    return tomorrow.toLocaleDateString('fr-FR', options);
}

function useScrollAnimation() {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '-50px 0px'
            }
        );

        const elements = document.querySelectorAll('.scroll-animation');
        elements.forEach(el => observer.observe(el));

        return () => elements.forEach(el => observer.unobserve(el));
    }, []);
}

// Add new interface for modal state
interface ModalState {
    isOpen: boolean;
    package: ServicePackage | null;
}

function getAvailabilityForDuration(duration: string): string {
    const now = new Date();
    let daysToAdd = 1;
    
    // Add more days based on duration
    if (duration.includes("minutes")) {
        daysToAdd = 1; // Next day for discovery calls
    } else if (duration.includes("mois")) {
        daysToAdd = 30; // One month for monthly services
    } else {
        daysToAdd = 7; // One week for all other services
    }
    
    const availabilityDate = new Date(now);
    availabilityDate.setDate(availabilityDate.getDate() + daysToAdd);
    
    // Keep adding days until we find a weekday (1-5, Monday-Friday)
    while (availabilityDate.getDay() === 0 || availabilityDate.getDay() === 6) {
        availabilityDate.setDate(availabilityDate.getDate() + 1);
    }
    
    // Format the date in French
    const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
    };
    return availabilityDate.toLocaleDateString('fr-FR', options);
}

export function ConversionPage() {
    const [scrollY, setScrollY] = useState(0);
    const [nextAvailability] = useState(getNextWorkingDay());
    const [modal, setModal] = useState<ModalState>({ isOpen: false, package: null });
    useScrollAnimation();

    // Add function to handle modal
    const openModal = (pkg: ServicePackage) => {
        setModal({ isOpen: true, package: pkg });
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    };

    const closeModal = () => {
        setModal({ isOpen: false, package: null });
        document.body.style.overflow = 'unset'; // Restore scroll
    };

    // Add function to get time based on package duration
    const getTimeForDuration = (duration: string): string => {
        if (duration.includes("mois")) {
            return "10h";
        } else if (duration.includes("semaine")) {
            return "11h";
        } else if (duration.includes("jours") || duration.includes("journée")) {
            return "14h30";
        }
        return "14h"; // Default time for short calls
    };

    const clientReviews = [
        {
            name: "Pascal Dubois",
            role: "CTO",
            company: "TechCorp",
            review: "Service exceptionnel ! J'ai pu résoudre mon problème en une heure seulement. Miguel était très compétent et a parfaitement compris nos besoins.",
            rating: 5,
            initials: "PL",
            image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5"
        },
        {
            name: "Marie Jarry",
            role: "Directrice Innovation",
            company: "ScienceLab",
            review: "Miguel est très professionnel et à l'écoute. Je recommande vivement. La qualité des conseils a dépassé mes attentes.",
            rating: 5,
            initials: "MC",
            image: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe"
        },
        {
            name: "Albert Dapas",
            role: "CEO",
            company: "FutureTech",
            review: "Une solution rapide et efficace. Très satisfait du service. L'accompagnement était personnalisé et pertinent.",
            rating: 5,
            initials: "AE",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a"
        }
    ];

    const servicePackages: ServicePackage[] = [
        {
            title: "Appel Découverte",
            duration: "15 minutes",
            price: "Gratuit",
            description: "Un premier échange pour comprendre vos enjeux et voir comment je peux vous aider dans votre transformation.",
            deliverables: [
                "Présentation de votre contexte",
                "Identification des challenges",
                "Discussion des solutions possibles",
                "Recommandations initiales"
            ],
            highlight: "Sans engagement"
        },
        {
            title: "Diagnostic Flash",
            duration: "1 journée",
            price: "1\u00A0200\u00A0€",
            description: "Évaluation rapide de votre transformation digitale et identification des axes d'amélioration prioritaires.",
            deliverables: [
                "Audit express de maturité digitale",
                "Identification des quick wins",
                "Recommandations prioritaires",
                "Compte rendu détaillé"
            ],
            highlight: "Idéal pour démarrer"
        },
        {
            title: "Sprint Innovation",
            duration: "5 jours",
            price: "5\u00A0000\u00A0€",
            description: "Accompagnement intensif pour accélérer un projet d'innovation ou résoudre un défi stratégique.",
            deliverables: [
                "Animation d'ateliers design thinking",
                "Prototype conceptuel",
                "Feuille de route détaillée",
                "Présentation des résultats"
            ],
            highlight: "Best-seller"
        },
        {
            title: "Transformation Agile",
            duration: "3 mois",
            price: "Sur mesure",
            description: "Programme complet de transformation agile adapté à votre contexte et vos objectifs.",
            deliverables: [
                "Diagnostic organisationnel",
                "Formation des équipes",
                "Mise en place du framework",
                "Coaching des managers"
            ]
        },
        {
            title: "Mentorat Direction",
            duration: "6 mois",
            price: "2\u00A0500€/mois",
            description: "Accompagnement personnalisé des dirigeants dans leur vision et execution stratégique.",
            deliverables: [
                "Sessions mensuelles one-to-one",
                "Support continu à distance",
                "Revues stratégiques trimestrielles",
                "Accès à mon réseau"
            ]
        },
        {
            title: "Innovation Workshop",
            duration: "2 jours",
            price: "2\u00A0400€",
            description: "Workshop intensif pour générer des idées innovantes et construire une vision produit partagée avec vos équipes.",
            deliverables: [
                "Facilitation d'ateliers créatifs",
                "Cartographie d'opportunités",
                "Priorisation des initiatives",
                "Synthèse et plan d'action"
            ]
        },
        {
            title: "Digital Assessment",
            duration: "2 semaines",
            price: "4\u00A0800\u00A0€",
            description: "Audit complet de votre maturité digitale et de vos processus avec recommandations détaillées.",
            deliverables: [
                "Analyse des processus actuels",
                "Benchmark sectoriel",
                "Plan de transformation",
                "Présentation exécutive"
            ],
            highlight: "Popular"
        }
    ];

    // Calculate average rating
    const averageRating = clientReviews.reduce((acc, review) => acc + review.rating, 0) / clientReviews.length;

    return (
        <div className="min-h-screen flex flex-col relative">
            <style>
                {`
                    .scroll-animation {
                        opacity: 0;
                        transform: translateY(30px);
                        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                        will-change: transform, opacity;
                    }
                    .animate-in {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    @media (prefers-reduced-motion: reduce) {
                        .scroll-animation {
                            transition: none;
                            opacity: 1;
                            transform: none;
                        }
                    }
                    .scrollbar-hide {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                `}
            </style>

            {/* Animated Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div 
                    className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50"
                    style={{
                        backgroundImage: `
                            radial-gradient(circle at 20% 35%, rgba(147, 197, 253, 0.15) 0%, transparent 50%),
                            radial-gradient(circle at 75% 44%, rgba(165, 180, 252, 0.15) 0%, transparent 50%),
                            radial-gradient(circle at 5% 75%, rgba(147, 197, 253, 0.15) 0%, transparent 50%),
                            radial-gradient(circle at 80% 95%, rgba(165, 180, 252, 0.15) 0%, transparent 50%)
                        `
                    }}
                />
                <div 
                    className="absolute inset-0 opacity-30"
                    style={{
                        transform: `translateY(${scrollY * 0.2}px)`,
                        backgroundImage: `
                            radial-gradient(circle at 50% ${30 + (scrollY * 0.02)}%, rgba(147, 197, 253, 0.2) 0%, transparent 40%),
                            radial-gradient(circle at ${70 - (scrollY * 0.01)}% ${60 + (scrollY * 0.01)}%, rgba(165, 180, 252, 0.2) 0%, transparent 40%)
                        `,
                        transition: 'transform 0.1s ease-out'
                    }}
                />
            </div>

            <main className="flex-grow relative">
                {/* Cover Section - Full Width */}
                <div className="scroll-animation w-full bg-white shadow-md mb-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative p-4 md:p-6 flex items-start gap-6">
                            <div className="w-48 h-64 md:w-72 md:h-96 flex-shrink-0 bg-gray-400 rounded-2xl border-4 border-white overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
                                    alt="Arnaud Lacaze"
                                    className="w-full h-full object-cover"
                                    style={{ objectPosition: '50% 10%' }}
                                />
                            </div>
                            <div className="flex-grow flex flex-col gap-4">
                                <div className="flex justify-end">
                                    <div className="text-right">
                                        <div className="text-2xl md:text-3xl font-bold text-blue-600">ShowMeTheWay</div>
                                        <div className="text-xl md:text-2xl font-semibold text-gray-700">Consulting</div>
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="flex items-center gap-4 mb-1">
                                        <h2 className="text-xl md:text-2xl font-bold">Arnaud Lacaze</h2>
                                        <div className="flex gap-3">
                                            <a href="https://linkedin.com/in/arnaud-lacaze" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                                                <Linkedin className="h-5 w-5" />
                                            </a>
                                            <a href="https://twitter.com/arnaudlacaze" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                                                <Twitter className="h-5 w-5" />
                                            </a>
                                            <a href="https://arnaudlacaze.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 transition-colors">
                                                <Globe className="h-5 w-5" />
                                            </a>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm md:text-base">Expert en Transformation Digitale & Innovation</p>
                                </div>

                                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                    Passionné par l'innovation et la transformation digitale, j'accompagne les entreprises dans leur évolution technologique depuis plus de 15 ans. Mon approche combine expertise technique et vision stratégique pour des résultats concrets et durables.
                                </p>

                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm text-gray-500">
                                        <span>📍 Paris, France</span>
                                        <span className="hidden md:inline">•</span>
                                        <span>🗣️ Français, English, Español</span>
                                    </div>
                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                                        <div className="flex items-center gap-1">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star 
                                                        key={i} 
                                                        className={`h-4 w-4 ${i < Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-600 ml-1">
                                                {averageRating.toFixed(1)}/5 ({clientReviews.length} avis)
                                            </span>
                                        </div>
                                        <span className="hidden md:inline text-gray-300">•</span>
                                        <div className="flex items-center gap-1">
                                            <span className="text-sm text-gray-600">
                                                ⚡️ Répond en général sous 6h
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Service Packages Section */}
                <div className="scroll-animation overflow-hidden mb-8">
                    <div className="flex overflow-x-auto pb-6 scrollbar-hide">
                        <div className="flex gap-4 mx-auto px-4 py-2">
                            {servicePackages.map((pkg, index) => (
                                <div 
                                    key={index}
                                    className="flex flex-col bg-white rounded-xl shadow-md w-80 flex-shrink-0 
                                    hover:shadow-lg transition-all duration-200 ease-out hover:scale-[1.02]
                                    transform-gpu"
                                >
                                    <div className="p-6 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-900">{pkg.title}</h4>
                                                <p className="text-sm text-gray-500">{pkg.duration}</p>
                                                <div className="text-sm font-bold text-gray-900 mt-1">{pkg.price}</div>
                                            </div>
                                            {pkg.highlight && (
                                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                    {pkg.highlight}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
                                        <div className="mt-auto">
                                            <div className="text-sm font-medium text-gray-900 mb-2">Ce qui est inclus :</div>
                                            <ul className="space-y-2">
                                                {pkg.deliverables.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                        <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="p-6 pt-0">
                                        <div className="text-center mb-3">
                                            <div className="text-sm text-gray-500">Prochaine disponibilité</div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {getAvailabilityForDuration(pkg.duration)}, {getTimeForDuration(pkg.duration)}
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => openModal(pkg)}
                                            className="w-full bg-gray-50 hover:bg-gray-100 text-gray-900 font-medium px-4 py-2 rounded-lg transition-colors"
                                        >
                                            En savoir plus
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Container for the rest of the content */}
                <div className="max-w-4xl mx-auto px-4">
                    {/* Client References Section */}
                    <div className="scroll-animation bg-white p-6 rounded-lg shadow-md mb-8">
                        <h3 className="text-xl font-semibold mb-4">Références clients</h3>
                        <div className="space-y-4">
                            {clientReviews.map((review, index) => (
                                <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={review.image}
                                            alt={review.name}
                                            className="h-10 w-10 rounded-full object-cover object-top"
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-lg font-medium text-gray-900">{review.name}</div>
                                        <div className="text-sm text-gray-600">{review.role} chez {review.company}</div>
                                        <div className="mt-2 text-gray-700">{review.review}</div>
                                        <div className="mt-2 flex">
                                            {Array.from({ length: review.rating }).map((_, i) => (
                                                <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className="scroll-animation bg-white p-6 rounded-lg shadow-md mb-8">
                        <div className="prose prose-sm md:prose-lg text-gray-600">
                            <p>
                                Avec plus de 15 ans d'expérience dans la transformation digitale et l'innovation,
                                j'accompagne les entreprises dans leur évolution technologique et organisationnelle.
                                Ancien directeur de l'innovation chez Bouygues Telecom et consultant senior chez Accenture,
                                j'ai piloté de nombreux projets de transformation à grande échelle.
                            </p>
                        </div>
                    </div>

                    {/* Key Competencies Section */}
                    <div className="scroll-animation bg-white p-6 rounded-lg shadow-md mb-8">
                        <h3 className="text-xl font-semibold mb-4">Compétences clés</h3>
                        <ul className="grid md:grid-cols-2 gap-2">
                            <li className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-blue-600" />
                                <span>Stratégie digitale</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-blue-600" />
                                <span>Innovation produit</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-blue-600" />
                                <span>Transformation organisationnelle</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-blue-600" />
                                <span>Management de l'innovation</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-blue-600" />
                                <span>Conduite du changement</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-blue-600" />
                                <span>Agilité à l'échelle</span>
                            </li>
                        </ul>
                    </div>

                    {/* Toolkit Section */}
                    <div className="scroll-animation bg-white p-6 rounded-lg shadow-md mb-8">
                        <h3 className="text-xl font-semibold mb-4">Toolkit</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Gestion de Projet & Agilité</h4>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Jira</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Confluence</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Trello</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Azure DevOps</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Miro</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Design & Prototypage</h4>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Figma</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Adobe XD</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">InVision</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Sketch</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Analyse & Reporting</h4>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Tableau</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Power BI</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Google Analytics</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Looker</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Collaboration & Communication</h4>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Slack</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Microsoft Teams</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Notion</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Google Workspace</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Missions Section */}
                    <div className="scroll-animation bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Mes dernières missions</h3>
                        <div className="space-y-6">
                            <div className="border-l-4 border-blue-600 pl-4">
                                <h4 className="font-semibold text-lg text-gray-900">Transformation Agile chez TotalEnergies</h4>
                                <p className="text-gray-600 mt-1">Accompagnement de la transformation agile à l'échelle pour une business unit de 400 personnes. Mise en place du framework SAFe, formation des équipes et du management, et création d'un centre d'excellence agile.</p>
                                <div className="text-sm text-gray-500 mt-2">2023 - 6 mois</div>
                            </div>
                            
                            <div className="border-l-4 border-blue-600 pl-4">
                                <h4 className="font-semibold text-lg text-gray-900">Innovation Produit chez Decathlon</h4>
                                <p className="text-gray-600 mt-1">Refonte du processus d'innovation produit et mise en place d'une approche design thinking. Animation d'ateliers d'idéation et accompagnement des équipes dans le développement de nouveaux produits connectés.</p>
                                <div className="text-sm text-gray-500 mt-2">2022 - 8 mois</div>
                            </div>
                            
                            <div className="border-l-4 border-blue-600 pl-4">
                                <h4 className="font-semibold text-lg text-gray-900">Stratégie Digitale pour La Poste</h4>
                                <p className="text-gray-600 mt-1">Définition et déploiement de la stratégie de transformation digitale. Création d'une feuille de route sur 3 ans et accompagnement dans la mise en place des premiers projets structurants.</p>
                                <div className="text-sm text-gray-500 mt-2">2022 - 4 mois</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Add Modal */}
            {modal.isOpen && modal.package && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div 
                        className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative
                        transform transition-all duration-300 scale-100"
                    >
                        <button 
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-6 w-6" />
                        </button>
                        
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{modal.package.title}</h2>
                                    <p className="text-gray-500">{modal.package.duration}</p>
                                    <div className="text-lg font-bold text-gray-900 mt-1">{modal.package.price}</div>
                                </div>
                                {modal.package.highlight && (
                                    <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                                        {modal.package.highlight}
                                    </span>
                                )}
                            </div>

                            <div className="prose prose-blue max-w-none">
                                <h3 className="text-lg font-semibold mb-2">Description détaillée</h3>
                                <p className="text-gray-600">{modal.package.description}</p>
                                
                                <h3 className="text-lg font-semibold mt-6 mb-2">Livrables</h3>
                                <ul className="space-y-3">
                                    {modal.package.deliverables.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-600">{item}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-8">
                                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors">
                                        Réserver un créneau
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
