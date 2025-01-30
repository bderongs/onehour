import { Check, ArrowRight } from 'lucide-react';
import { ConsultantSignUpForm } from '../components/ConsultantSignUpForm';

export function PricingPage() {
    const scrollToSignup = () => {
        document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const tiers = [
        {
            name: 'Lancement',
            price: '0€',
            period: '/mois',
            description: 'Accélérez votre croissance avec Sparkier',
            features: [
                'Page de profil professionnelle',
                'Assistant IA de qualification (100 messages/mois)',
                '10 Sparks pour présenter vos services',
            ],
            cta: 'Commencer gratuitement',
            highlight: true,
            action: scrollToSignup
        },
        {
            name: 'Premium',
            price: '49€',
            period: '/mois',
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
            action: () => {}
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
            action: () => {}
        }
    ];

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
                    {tiers.map((tier) => (
                        <div 
                            key={tier.name}
                            className={`bg-white rounded-2xl shadow-xl p-8 relative flex flex-col ${
                                tier.highlight ? 'ring-2 ring-blue-600' : ''
                            }`}
                        >
                            {tier.highlight && (
                                <div className="absolute -top-5 left-0 right-0 mx-auto w-fit">
                                    <span className="bg-blue-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                                        Disponible maintenant
                                    </span>
                                </div>
                            )}
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                                <p className="text-gray-600 mb-4">{tier.description}</p>
                                <div className="flex items-baseline">
                                    <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                                    <span className="text-gray-600 ml-1">{tier.period}</span>
                                </div>
                            </div>
                            <ul className="space-y-4 mb-8 flex-grow">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex items-start">
                                        <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                                        <span className="ml-3 text-gray-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button 
                                className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 group ${
                                    tier.highlight
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                                }`}
                                onClick={tier.action}
                            >
                                {tier.cta}
                                {tier.highlight && (
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                )}
                            </button>
                        </div>
                    ))}
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

                    <ConsultantSignUpForm 
                        className="bg-white p-8 rounded-xl shadow-md"
                        buttonText="Créer mon profil gratuitement"
                    />
                </div>
            </div>
        </div>
    );
}

export default PricingPage; 