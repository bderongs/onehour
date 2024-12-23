import React, { useState } from 'react';
import { Check, ArrowRight, CheckCircle } from 'lucide-react';
import { submitConsultantForm } from '../services/consultantFormSubmission';

export function PricingPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        linkedin: '',
        email: '',
        expertise: '',
        experience: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await submitConsultantForm(formData);
            setIsSubmitted(true);
            setFormData({ firstName: '', lastName: '', linkedin: '', email: '', expertise: '', experience: '' });
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const scrollToSignup = () => {
        document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const tiers = [
        {
            name: 'Starter',
            price: '0€',
            period: '/mois',
            description: 'Parfait pour démarrer et tester la plateforme',
            features: [
                'Page de profil basique',
                'Assistant IA de qualification (100 messages/mois)',
                '1 offre packagée',
                'Agenda en ligne',
                'Paiements sécurisés',
            ],
            cta: 'Commencer gratuitement',
            highlight: false,
            action: scrollToSignup
        },
        {
            name: 'Pro',
            price: '49€',
            period: '/mois',
            description: 'Pour les consultants qui veulent développer leur activité',
            features: [
                'Page de profil personnalisée',
                'Assistant IA illimité',
                'Offres packagées illimitées',
                'Agenda en ligne',
                'Paiements sécurisés',
                'Analytics avancés',
                'Support prioritaire',
                'Intégration calendrier',
            ],
            cta: 'Démarrer l\'essai gratuit',
            highlight: true,
            action: scrollToSignup
        },
        {
            name: 'Enterprise',
            price: '199€',
            period: '/mois',
            description: 'Pour les cabinets de conseil et les équipes',
            features: [
                'Tout ce qui est inclus dans Pro',
                'Pages de profil pour 5 consultants',
                'Assistant IA personnalisé',
                'Marque blanche possible',
                'Account manager dédié',
                'API access',
                'SSO & contrôles admin',
                'Formation personnalisée',
            ],
            cta: 'Contacter les ventes',
            highlight: false,
            action: () => { window.location.href = 'mailto:contact@onehour.consulting'; }
        }
    ];

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Des prix simples et transparents
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Choisissez le plan qui correspond à vos besoins. Commencez gratuitement et évoluez à votre rythme.
                    </p>
                </div>

                {/* Pricing Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {tiers.map((tier, index) => (
                        <div 
                            key={tier.name}
                            className={`bg-white rounded-2xl shadow-xl p-8 relative ${
                                tier.highlight ? 'ring-2 ring-blue-600' : ''
                            }`}
                        >
                            {tier.highlight && (
                                <div className="absolute -top-5 left-0 right-0 mx-auto w-fit">
                                    <span className="bg-blue-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                                        Le plus populaire
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
                            <ul className="space-y-4 mb-8">
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
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="mt-24">
                    <h2 className="text-3xl font-bold text-center mb-12">Questions fréquentes</h2>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Puis-je changer de plan à tout moment ?</h3>
                            <p className="text-gray-600">Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements seront effectifs à votre prochaine période de facturation.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Y a-t-il un engagement de durée ?</h3>
                            <p className="text-gray-600">Non, tous nos plans sont sans engagement. Vous pouvez annuler à tout moment.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Comment fonctionne l'essai gratuit ?</h3>
                            <p className="text-gray-600">L'essai gratuit du plan Pro dure 14 jours et vous donne accès à toutes les fonctionnalités. Aucune carte bancaire n'est requise.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Quels moyens de paiement acceptez-vous ?</h3>
                            <p className="text-gray-600">Nous acceptons les cartes de crédit (Visa, Mastercard, AMEX) et les prélèvements SEPA pour les entreprises en Europe.</p>
                        </div>
                    </div>
                </div>

                {/* Sign Up Form */}
                <div id="signup-form" className="max-w-2xl mx-auto mt-24">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Créez votre profil maintenant
                        </h2>
                        <p className="text-gray-600">
                            Commencez gratuitement et développez votre activité de conseil
                        </p>
                    </div>

                    {isSubmitted ? (
                        <div className="bg-green-50 text-green-800 p-6 rounded-xl text-center">
                            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
                            <h3 className="text-xl font-semibold mb-2">Merci pour votre inscription !</h3>
                            <p>Notre équipe va vous contacter dans les 24h pour finaliser la création de votre profil et vous accompagner dans la prise en main de la plateforme.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md">
                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Prénom
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nom
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Domaine d'expertise
                                    </label>
                                    <select
                                        name="expertise"
                                        value={formData.expertise}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Sélectionnez votre domaine</option>
                                        <option value="digital">Transformation Digitale</option>
                                        <option value="strategy">Stratégie & Management</option>
                                        <option value="marketing">Marketing & Communication</option>
                                        <option value="hr">Ressources Humaines</option>
                                        <option value="finance">Finance & Gestion</option>
                                        <option value="tech">Technologies & IT</option>
                                        <option value="other">Autre</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Années d'expérience
                                    </label>
                                    <select
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Sélectionnez votre expérience</option>
                                        <option value="1-3">1-3 ans</option>
                                        <option value="4-7">4-7 ans</option>
                                        <option value="8-12">8-12 ans</option>
                                        <option value="13+">13+ ans</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        LinkedIn (optionnel)
                                    </label>
                                    <input
                                        type="url"
                                        name="linkedin"
                                        value={formData.linkedin}
                                        onChange={handleChange}
                                        placeholder="https://linkedin.com/in/votre-profil"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email professionnel
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 group"
                                >
                                    Créer mon profil gratuitement
                                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                            <p className="mt-4 text-sm text-gray-500 text-center">
                                En créant votre profil, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PricingPage; 