import React, { useState } from 'react';
import { submitConsultantForm } from '../services/consultantFormSubmission';
import { BadgeCheck, CheckCircle, ArrowRight, Star, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const ConsultantPage = () => {
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

    const features = [
        {
            title: "Agenda intelligent",
            description: "Synchronisez votre calendrier, définissez vos disponibilités et laissez vos clients réserver en toute autonomie. Fini les allers-retours d'emails !",
            metrics: "Gain de 5h/semaine sur la gestion"
        },
        {
            title: "Paiements automatisés",
            description: "Facturation automatique, paiements sécurisés et suivi des revenus en temps réel. Plus besoin de courir après les paiements.",
            metrics: "Paiement J+3 garanti"
        },
        {
            title: "Tableau de bord personnalisé",
            description: "Visualisez vos métriques clés : taux de conversion, revenus, satisfaction client, et optimisez votre activité avec des insights actionnables.",
            metrics: "Pilotage en temps réel"
        }
    ];

    const successStories = [
        {
            name: "Claire Moreau",
            role: "Consultante Marketing Digital",
            revenue: "15K€/mois",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
            quote: "J'ai doublé mon chiffre d'affaires en 6 mois grâce à la visibilité offerte par la plateforme."
        },
        {
            name: "Pierre Fabre",
            role: "Expert Transformation Digitale",
            revenue: "20K€/mois",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
            quote: "La qualité des leads et la simplicité de gestion m'ont permis de me concentrer sur mes missions à forte valeur ajoutée."
        },
        {
            name: "Anne Rousseau",
            role: "Consultante RH",
            revenue: "12K€/mois",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
            quote: "Le système de réservation automatisé m'a permis d'optimiser mon planning et d'augmenter mes revenus de 50%."
        }
    ];

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                        Développez votre activité de consultant<br />avec l'aide de l'IA
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        Un assistant IA intelligent qui qualifie vos prospects 24/7 et une page de profil qui convertit. Créez des offres packagées et laissez l'IA matcher les bonnes solutions à vos clients.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button 
                            onClick={() => document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' })} 
                            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2 group"
                        >
                            Créer mon profil gratuitement
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </button>
                        <button 
                            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} 
                            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors border border-blue-600"
                        >
                            Découvrir les fonctionnalités
                        </button>
                    </div>
                </div>

                {/* Success Metrics */}
                <div className="bg-white rounded-xl p-8 shadow-md mb-16">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-blue-600 mb-2">+50%</div>
                            <div className="text-gray-600">de revenus en moyenne<br />après 6 mois</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-blue-600 mb-2">300+</div>
                            <div className="text-gray-600">consultants utilisent<br />notre plateforme</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
                            <div className="text-gray-600">de taux de satisfaction<br />client</div>
                        </div>
                    </div>
                </div>

                {/* AI Assistant Demo Section */}
                <div className="mb-16 bg-white rounded-xl p-8 shadow-md">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                                    <Sparkles className="h-4 w-4" />
                                    Fonctionnalité phare #1
                                </div>
                                <Link 
                                    to="/profile" 
                                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    Voir un exemple <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                            <h2 className="text-3xl font-bold mb-6">Assistant IA conversationnel</h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-blue-600 font-semibold">1</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Qualification intelligente 24/7</h3>
                                        <p className="text-gray-600">L'assistant engage la conversation avec vos prospects, comprend leurs enjeux et qualifie leurs besoins, même pendant votre sommeil.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-blue-600 font-semibold">2</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Personnalisation contextuelle</h3>
                                        <p className="text-gray-600">L'IA adapte la conversation en fonction de votre expertise et de vos offres, créant une expérience sur-mesure pour chaque prospect.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-blue-600 font-semibold">3</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Conversion naturelle</h3>
                                        <p className="text-gray-600">Une fois le besoin qualifié, l'assistant guide naturellement vers vos offres les plus pertinentes et facilite la prise de rendez-vous.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-6">
                            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                        <Sparkles className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="font-medium text-gray-900">Assistant IA</div>
                                </div>
                                <p className="text-gray-600 mb-3">Bonjour ! Je suis là pour comprendre vos enjeux et vous orienter vers les meilleures solutions. Quel défi souhaitez-vous relever ?</p>
                                <div className="space-y-2">
                                    <button className="w-full text-left px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600">
                                        Améliorer notre transformation digitale
                                    </button>
                                    <button className="w-full text-left px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600">
                                        Optimiser nos processus internes
                                    </button>
                                    <button className="w-full text-left px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600">
                                        Former nos équipes à l'agilité
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 text-center">Exemple d'interaction avec l'assistant IA</p>
                        </div>
                    </div>
                </div>

                {/* Package Creation Demo Section */}
                <div className="mb-16 bg-white rounded-xl p-8 shadow-md">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="bg-gray-50 rounded-xl p-6">
                            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                                <h3 className="font-semibold text-gray-900 mb-4">Diagnostic Flash Transformation Digitale</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <CheckCircle className="h-5 w-5 text-blue-600" />
                                        <span>Audit de maturité digitale</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <CheckCircle className="h-5 w-5 text-blue-600" />
                                        <span>Identification des quick wins</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <CheckCircle className="h-5 w-5 text-blue-600" />
                                        <span>Plan d'action priorisé</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <CheckCircle className="h-5 w-5 text-blue-600" />
                                        <span>1 200€ HT</span>
                                    </div>
                                </div>
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-600">
                                        <span className="font-semibold">Matching IA :</span> Recommandé pour les PME en début de transformation digitale, avec un besoin de vision claire et un budget limité
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 text-center">Exemple d'offre packagée avec matching IA</p>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                                    <Sparkles className="h-4 w-4" />
                                    Fonctionnalité phare #2
                                </div>
                                <Link 
                                    to="/profile" 
                                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    Voir un exemple <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                            <h2 className="text-3xl font-bold mb-6">Offres packagées intelligentes</h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-blue-600 font-semibold">1</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Standardisation efficace</h3>
                                        <p className="text-gray-600">Créez des offres packagées avec des livrables clairs, des critères d'éligibilité et des prix fixes. Gagnez en productivité en standardisant vos services les plus demandés.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-blue-600 font-semibold">2</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Matching automatique</h3>
                                        <p className="text-gray-600">L'IA analyse les besoins qualifiés et recommande automatiquement vos offres les plus pertinentes, avec une explication claire du matching.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-blue-600 font-semibold">3</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Vente simplifiée</h3>
                                        <p className="text-gray-600">Réduisez votre cycle de vente grâce à des offres précises et des prix transparents. Plus besoin de passer des heures à rédiger des propositions commerciales.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div id="features" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                            <p className="text-gray-600 mb-4">{feature.description}</p>
                            <div className="flex items-center gap-2 text-blue-600">
                                <BadgeCheck className="h-5 w-5" />
                                <span className="text-sm font-medium">{feature.metrics}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Success Stories */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12">Ils ont réussi avec nous</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {successStories.map((story, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                                <div className="flex items-center gap-4 mb-4">
                                    <img 
                                        src={story.image} 
                                        alt={story.name} 
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{story.name}</h4>
                                        <p className="text-sm text-gray-600">{story.role}</p>
                                        <p className="text-sm font-semibold text-blue-600">{story.revenue}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600">"{story.quote}"</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sign Up Form */}
                <div id="signup-form" className="max-w-2xl mx-auto">
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
};

export default ConsultantPage;