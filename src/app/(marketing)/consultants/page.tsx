import React, { Suspense } from 'react';
import { Package2, Clock, Store, Sparkles } from 'lucide-react';
import { getSparks } from '@/services/sparks';
import { SparksGridSection } from './components/SparksGridSection';
import { InteractiveFeatures } from './components/InteractiveFeatures';
import { ConsultantSignUpForm } from '@/components/ConsultantSignUpForm';
import '@/styles/highlight.css';

// Define metadata for SEO
export const metadata = {
    title: 'Sparkier - Accélérez votre activité de conseil avec des offres packagées',
    description: 'Transformez vos expertises en Sparks : des modules de conseil packagés et prêts à vendre. Simplifiez votre activité de conseil et augmentez vos revenus.',
    openGraph: {
        title: 'Sparkier - Accélérez votre activité de conseil',
        description: 'Transformez vos expertises en Sparks : des modules de conseil packagés et prêts à vendre.',
        type: 'website',
        locale: 'fr_FR',
        siteName: 'Sparkier',
    },
};

// Loading fallback components
const SparksSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-48 bg-gray-200 rounded-lg"></div>
    </div>
);

const FormSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-96 bg-gray-200 rounded-lg"></div>
    </div>
);

async function ConsultantsPage() {
    // Fetch sparks data server-side
    const sparks = await getSparks();

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Hero Section */}
                <div className="text-center mb-16 opacity-0 translate-y-4 animate-[fadeInUp_0.6s_ease-out_forwards]">
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight px-2">
                        Accélérez votre activité de conseil avec des <span className="highlight">offres packagées</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8 sm:mb-12 px-2">
                        Transformez vos expertises en <span className="highlight">Sparks</span> : des modules de conseil packagés et <span className="highlight">prêts à vendre</span>.
                    </p>

                    {/* Sparks Grid Section */}
                    <Suspense fallback={<SparksSkeleton />}>
                        <SparksGridSection initialSparks={sparks} />
                    </Suspense>

                    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8 sm:mb-12 px-2">
                        Avec <span className="highlight">Sparkier.io</span>, dites adieu aux échanges interminables et aux négociations fastidieuses. Créez des <span className="highlight">Sparks</span> — des missions ultra-claires et packagées de 30 minutes à 2 heures — qui vous permettent de convertir des prospects en clients en un clic, et d'offrir une expérience de conseil simple, rapide et efficace.
                    </p>

                    {/* Interactive Features (CTA Buttons) */}
                    <Suspense fallback={<div>Chargement...</div>}>
                        <InteractiveFeatures />
                    </Suspense>
                </div>

                {/* Key Features Section */}
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 px-2">
                        Pourquoi adopter <span className="highlight">Sparkier.io</span> pour vos offres de conseil ?
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-12 sm:mb-16">
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
                        <div
                            key={index}
                            className="bg-white rounded-xl p-6 sm:p-8 shadow-md opacity-0 translate-y-4 animate-[fadeInUp_0.5s_ease-out_forwards]"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                                <div className="p-2 sm:p-3 bg-blue-50 rounded-lg w-fit h-fit">
                                    {React.cloneElement(feature.icon as React.ReactElement, {
                                        className: "h-6 w-6 text-blue-600"
                                    })}
                                </div>
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{feature.title}</h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* How it works Section */}
                <div className="mb-12 sm:mb-16">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 px-2">
                            Comment ça <span className="highlight">fonctionne</span> ?
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                        {[
                            {
                                title: "Configurez et générez vos Sparks",
                                description: "Décrivez vos compétences via notre chatbot et laissez l'IA créer automatiquement des offres structurées et engageantes."
                            },
                            {
                                title: "Partagez votre page",
                                description: "Présentez vos Sparks à vos prospects via votre page personnelle."
                            },
                            {
                                title: "Délivrez vos sessions",
                                description: "Recevez un brief détaillé avant chaque session et délivrez un conseil impactant dès la première minute !"
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow opacity-0 translate-y-4 animate-[fadeInUp_0.5s_ease-out_forwards]"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                                        {index + 1}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                                </div>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Advantages Section */}
                <div className="mb-12 sm:mb-16">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 px-2">
                            Vos avantages clés
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                        {[
                            "Maximisez votre rentabilité en éliminant les phases commerciales chronophages",
                            "Augmentez votre taux de conversion grâce à des offres standardisées et prêtes à l'emploi",
                            "Gagnez du temps sur la préparation de vos offres",
                            "Proposez une expérience client fluide avec des briefs précis et une prise de rendez-vous simplifiée"
                        ].map((advantage, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-start gap-3 opacity-0 translate-y-4 animate-[fadeInUp_0.5s_ease-out_forwards]"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1">
                                    {/* Placeholder for the CheckCircle icon */}
                                </div>
                                <p className="text-gray-600">{advantage}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Final CTA Section */}
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">
                        Prêt à <span className="highlight">propulser</span> votre activité de conseil ?
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        👉 Créez vos premiers Sparks <span className="highlight"> gratuitement</span> dès aujourd'hui !<br />
                        Il ne vous faut que quelques minutes pour transformer vos compétences en <span className="highlight">offres irrésistibles</span>.
                    </p>
                    <p className="text-lg text-gray-600 italic">
                        Simplifiez, automatisez, concentrez-vous sur l'<span className="highlight">essentiel</span> : votre expertise.
                    </p>
                </div>

                {/* Sign Up Section */}
                <Suspense fallback={<FormSkeleton />}>
                    <div
                        id="signup-form"
                        className="max-w-2xl mx-auto px-3 sm:px-0 opacity-0 translate-y-4 animate-[fadeInUp_0.5s_ease-out_forwards]"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Créez votre profil maintenant
                            </h2>
                            <p className="text-gray-600">
                                Packagez vos services en Sparks et commencez à vendre
                            </p>
                        </div>

                        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
                            <ConsultantSignUpForm />
                        </div>
                    </div>
                </Suspense>
            </div>
        </div>
    );
}

export default ConsultantsPage;