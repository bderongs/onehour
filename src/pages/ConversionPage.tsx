import React from 'react';
import { CheckCircle, Star } from 'lucide-react';
import { LightFooter } from '../components/LightFooter';

export function ConversionPage() {
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

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <main className="flex-grow">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    {/* Combined Banner and Consultant Info Section */}
                    <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
                        <div className="relative">
                            <div className="w-40 h-40 bg-gray-400 rounded-full z-10 absolute left-6 top-1/2 transform translate-y-[-25%] border-4 border-white">
                                <img
                                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
                                    alt="Arnaud Lacaze"
                                    className="w-full h-full rounded-full object-cover object-top"
                                />
                            </div>
                            <div className="h-40 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-end px-12">
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-blue-200">OneHour</div>
                                    <div className="text-2xl font-semibold text-white">Consulting</div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 pt-12">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold">Arnaud Lacaze</h2>
                                    <p className="text-gray-600">Expert en Transformation Digitale & Innovation</p>
                                </div>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Me contacter</button>
                            </div>
                            <div className="flex space-x-4 mt-4">
                                <span className="bg-gray-200 px-3 py-1 rounded-full">75€ / 30 min</span>
                                <span className="bg-gray-200 px-3 py-1 rounded-full">15 ans d'xp</span>
                                <span className="bg-gray-200 px-3 py-1 rounded-full">20+ clients</span>
                            </div>
                            <div className="mt-6 prose prose-lg text-gray-600">
                                <p>
                                    Avec plus de 15 ans d'expérience dans la transformation digitale et l'innovation,
                                    j'accompagne les entreprises dans leur évolution technologique et organisationnelle.
                                    Ancien directeur de l'innovation chez Bouygues Telecom et consultant senior chez Accenture,
                                    j'ai piloté de nombreux projets de transformation à grande échelle.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Key Competencies Section */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
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

                    {/* Client References Section */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
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

                    {/* Recent Missions Section */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
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
        </div>
    );
}
