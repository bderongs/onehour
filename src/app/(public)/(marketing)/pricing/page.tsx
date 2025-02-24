import { Metadata } from 'next';
import { Suspense } from 'react';
import { PricingTierCard } from './components/PricingTierCard';
import { PricingTierSkeleton } from './components/PricingTierSkeleton';
import { ConsultantSignUpForm } from '@/components/ConsultantSignUpForm';

export const metadata: Metadata = {
    title: 'Tarifs | Sparkier - Développez votre activité de consultant',
    description: 'Des tarifs transparents pour vous accompagner à chaque étape de votre croissance. Découvrez nos offres de lancement et nos futurs services premium.',
    openGraph: {
        title: 'Tarifs | Sparkier',
        description: 'Des tarifs transparents pour vous accompagner à chaque étape de votre croissance.',
        type: 'website',
    },
};

const tiers = [
    {
        name: 'Lancement',
        price: '1€',
        currentPrice: 'Gratuit',
        period: 'par mois',
        description: 'Accélérez votre croissance avec Sparkier',
        features: [
            'Page de profil professionnelle',
            'Assistant IA de qualification (100 messages/mois)',
            '10 Sparks pour présenter vos services',
        ],
        cta: 'Commencer gratuitement',
        highlight: true,
    },
    {
        name: 'Premium',
        price: '19€',
        period: 'par mois',
        description: 'Des services premium bientôt disponibles',
        features: [
            'Page de profil personnalisée',
            'Assistant IA illimité',
            'Sparks illimités',
            'Agenda en ligne',
            'Paiements sécurisés',
            'Analytics avancés',
            'Support prioritaire',
            'Intégration calendrier',
        ],
        cta: 'Bientôt disponible',
        highlight: false,
    },
    {
        name: 'Enterprise',
        price: 'Sur mesure',
        period: '',
        description: 'Solution complète pour les cabinets de conseil',
        features: [
            'Tout ce qui est inclus dans Pro',
            'Pages de profil pour tous les consultants',
            'Assistant IA personnalisé',
            'Marque blanche possible',
            'Account manager dédié',
            'API access',
            'SSO & contrôles admin',
            'Formation personnalisée',
        ],
        cta: 'Bientôt disponible',
        highlight: false,
    }
];

export default function PricingPage() {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Développez votre activité avec <span className="highlight">Sparkier</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Des tarifs <span className="highlight">transparents</span> pour vous accompagner à chaque étape de votre croissance.
                    </p>
                </div>

                {/* Pricing Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    <Suspense fallback={
                        <>
                            <PricingTierSkeleton />
                            <PricingTierSkeleton />
                            <PricingTierSkeleton />
                        </>
                    }>
                        {tiers.map((tier, index) => (
                            <PricingTierCard 
                                key={tier.name}
                                tier={{
                                    ...tier,
                                    action: index === 0 
                                        ? () => document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' })
                                        : () => {}
                                }}
                                index={index}
                            />
                        ))}
                    </Suspense>
                </div>

                {/* FAQ Section */}
                <div className="mt-24">
                    <h2 className="text-3xl font-bold text-center mb-12">Questions fréquentes</h2>
                    <div className="grid gap-8 max-w-3xl mx-auto">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Combien coûte Sparkier.io ?</h3>
                            <p className="text-gray-600">Pour le lancement, Sparkier.io est <span className="highlight">entièrement gratuit</span>. Vous pouvez créer et publier 10 Sparks sans frais. À terme, nous proposerons un modèle d'abonnement mensuel en fonction du niveau de service choisi, ainsi qu'une rémunération en cas d'apport d'affaire.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Y a-t-il une commission si un client me contacte via ma page personnelle ?</h3>
                            <p className="text-gray-600">Non. Il n'y aura <span className="highlight">jamais de commission</span> pour les clients qui vous contactent directement via votre page personnelle Sparkier. Vous conservez <span className="highlight">100 % de vos revenus</span>. Nous ne prélevons une commission que si un client est amené directement via la plateforme Sparkier, et non via votre page personnelle. Ce modèle restera valable, même après le lancement.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Comment le futur abonnement sera-t-il structuré ?</h3>
                            <p className="text-gray-600">Nous lancerons prochainement plusieurs formules d'abonnement mensuel offrant différents niveaux de services. Ces formules incluront des <span className="highlight">fonctionnalités avancées</span> comme des outils d'automatisation, des options de personnalisation supplémentaires et un support premium. Le tarif dépendra des fonctionnalités choisies.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Puis-je continuer à utiliser Sparkier.io gratuitement après le lancement payant ?</h3>
                            <p className="text-gray-600"><span className="highlight">Oui</span>, le plan de lancement restera <span className="highlight">gratuit pour nos premiers clients</span>. Vous pourrez continuer à utiliser la plateforme sans frais, même après la mise en place des formules payantes. Nous souhaitons récompenser nos premiers utilisateurs pour leur confiance et leur engagement.</p>
                        </div>
                    </div>
                </div>

                {/* Sign Up Form */}
                <div id="signup-form" className="max-w-2xl mx-auto mt-24">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Rejoignez Sparkier maintenant !
                        </h2>
                        <p className="text-gray-600">
                            Créez votre profil et commencez à développer votre activité
                        </p>
                    </div>

                    <Suspense fallback={
                        <div className="bg-white p-8 rounded-xl shadow-md animate-pulse">
                            <div className="space-y-4">
                                <div className="h-10 bg-gray-200 rounded w-full"></div>
                                <div className="h-10 bg-gray-200 rounded w-full"></div>
                                <div className="h-10 bg-gray-200 rounded w-full"></div>
                            </div>
                        </div>
                    }>
                        <ConsultantSignUpForm 
                            className="bg-white p-8 rounded-xl shadow-md"
                            buttonText="Créer mon profil gratuitement"
                        />
                    </Suspense>
                </div>
            </div>
        </div>
    );
} 