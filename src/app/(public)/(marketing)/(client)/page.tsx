import { Metadata } from 'next';
import { Suspense } from 'react';
import { 
    Bot, 
    Users, 
    Briefcase, 
    MessageSquare, 
    Calendar, 
    Zap, 
    Shield, 
    Sparkles, 
    ArrowRight, 
    FileText
} from 'lucide-react';
import { getSparks } from '@/services/sparks';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { About } from './components/About';
import { CTA } from './components/CTA';
import { HeroSkeleton } from './components/HeroSkeleton';
import { FeaturesSkeleton } from './components/FeaturesSkeleton';
import '@/styles/highlight.css';

// Add metadata for SEO
export const metadata: Metadata = {
    title: 'Sparkier - Boostez votre activité avec les Sparks',
    description: 'Les Sparks allient IA et experts métiers pour mettre l\'expertise du monde entier au service de votre réussite.',
    openGraph: {
        title: 'Sparkier - Boostez votre activité avec les Sparks',
        description: 'Les Sparks allient IA et experts métiers pour mettre l\'expertise du monde entier au service de votre réussite.',
        type: 'website'
    }
};

// Static data
const features = [
    {
        title: "Format structuré ",
        description: "Un concentré de conseil pour répondre à une problématique précise, sans engagement et sans perte de temps.",
        icon: <Zap className="h-6 w-6" />
    },
    {
        title: "Tarif défini",
        description: "Pas de surprise, le tarif est annoncé avant le début de la session.",
        icon: <Briefcase className="h-6 w-6" />
    },
    {
        title: "Qualité garantie",
        description: "Chaque consultant est limité à 10 Sparks maximum, assurant une expertise pointue sur chaque sujet proposé.",
        icon: <Shield className="h-6 w-6" />
    },
    {
        title: "Gestion simplifiée",
        description: "Pas de temps masqué ni de gestion commerciale complexe. Réservez votre session et commencez immédiatement.",
        icon: <Calendar className="h-6 w-6" />
    }
];

const howItWorks = [
    {
        icon: <MessageSquare className="h-6 w-6" />,
        title: "Choisissez votre Spark",
        description: "Sélectionnez le module qui correspond à votre problématique."
    },
    {
        icon: <Bot className="h-6 w-6" />,
        title: "Précisez votre contexte",
        description: "Notre IA vous aide à structurer votre demande pour optimiser la session."
    },
    {
        icon: <Users className="h-6 w-6" />,
        title: "Échangez avec votre Expert",
        description: "Travaillez en direct avec le consultant pour obtenir des réponses concrètes."
    },
    {
        icon: <FileText className="h-6 w-6" />,
        title: "Recevez votre Rapport",
        description: "Recevez un rapport détaillé prêt à partager avec vos équipes."
    }
];

const about_content = [
    {
        title: "Sparkier encadre la prestation",
        description: "Sparkier va au-delà de la mise en relation, et structure les prestations proposées par nos consultants pour en garantir la pertinence et la qualité. Nos experts ne peuvent proposer que 10 Sparks chacun au maximum, ce qui les force à ne proposer des prestations sur lesquelles ils sont réellement experts.",
        icon: <Shield className="h-6 w-6" />
    },
    {
        title: "Sparkier vous épargne la gestion de la relation commerciale",
        description: "Pas de temps masqué. Sélectionnez un Spark, détaillez votre contexte et réservez la session. La mission commence et s'arrête avec votre rendez-vous.",
        icon: <Calendar className="h-6 w-6" />
    }
];

// Server Component
export default async function Page() {
    // Fetch sparks on the server
    const sparks = await getSparks();

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Hero Section with Interactive Chat */}
                <Suspense fallback={<HeroSkeleton />}>
                    <Hero initialSparks={sparks} />
                </Suspense>

                {/* Features Section */}
                <Suspense fallback={<FeaturesSkeleton />}>
                    <Features features={features} />
                </Suspense>

                {/* How it Works Section */}
                <HowItWorks steps={howItWorks} />

                {/* About Section */}
                <About content={about_content} />

                {/* CTA Section with Sign Up Form */}
                <CTA />
            </div>
        </div>
    );
}