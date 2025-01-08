import React, { useState, useEffect } from 'react';
import { submitConsultantForm } from '../services/consultantFormSubmission';
import { BadgeCheck, CheckCircle, ArrowRight, Star, Sparkles, Target, Users, ArrowRightCircle, FileText, Package2, User, BarChart, Clock, Euro } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SparksGrid } from '../components/SparksGrid';
import { consultantExpertCalls } from '../data/expertCalls';

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

const LandingConsultants = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        linkedin: '',
        email: '',
        expertise: '',
        experience: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [expandedCallIndex, setExpandedCallIndex] = useState<number | null>(null);

    useEffect(() => {
        // Always set the first Spark (index 0) to be expanded on load
        if (expandedCallIndex === null) {
            setExpandedCallIndex(0);
        }
    }, []);

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

    const handleSparkCreation = (prefillText: string) => {
        const element = document.getElementById('signup-form');
        const headerOffset = 120; // Increased offset to show more of the form header

        if (element) {
            // Small delay to ensure smooth animation
            setTimeout(() => {
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }

        console.log('Selected spark:', prefillText);
    };

    const features = [
        {
            title: "Dédié au conseil en stratégie",
            description: "Contrairement aux plateformes de freelancing low cost, Sparkier vous permet de renvoyer une image professionnelle, structurée autour de votre offre de conseil en stratégie.",
            icon: <Target className="h-6 w-6" />
        },
        {
            title: "Des clients qualifiés",
            description: "Sparkier vous assure des clients qualifiés, qui viennent uniquement chercher des prestations de conseil en stratégie. Le tarif minimum d'un Spark est de 500€ pour 30 minutes.",
            icon: <Users className="h-6 w-6" />
        },
        {
            title: "Un processus d'achat simple",
            description: "En structurant votre offre sous forme de modules Sparks, vous accédez au marché de la mission courte. Les clients peuvent naviguer votre offre plus facilement et prendre une décision d'achat plus rapide.",
            icon: <ArrowRightCircle className="h-6 w-6" />
        },
        {
            title: "Un brief précis",
            description: "Vos clients achètent un Spark et nous nous chargeons d'établir un brief très précis avec eux. Vous optimisez ainsi votre temps et augmentez votre valeur ajoutée.",
            icon: <FileText className="h-6 w-6" />
        }
    ];

    const keyFeatures = [
        {
            title: "L'acquisition client simplifiée",
            description: "Le Spark est un module de conseil structuré et précis. Il vous permet de packager vos offres pour les vendre plus facilement. Il s'agit également d'un excellent moyen pour rencontrer de nouveaux clients avec qui créer une relation plus longue.",
            icon: <Target className="h-6 w-6" />
        },
        {
            title: "Pourquoi packager vos offres ?",
            description: "Transformer vos services en produits packagés vous permet d'augmenter la clarté de votre offre, et de vendre plus facilement, sans perdre de temps à négocier une lettre de mission. Chaque Spark est vendu au minimum 500€, vous pouvez en proposer 10 différents.",
            icon: <Package2 className="h-6 w-6" />
        },
        {
            title: "Votre page de profil",
            description: "En plus de la présence sur notre plateforme vous disposerez d'une page de conversion personnelle sur laquelle vos Sparks seront disponibles et réservables en ligne.",
            icon: <User className="h-6 w-6" />
        },
        {
            title: "Restez à l'écoute du marché",
            description: "Les fins de mission peuvent arriver soudainement et vous couter très cher, si vous n'avez pas pris le temps de garder une base commerciale active. Sparkier vous permet de cumuler vos missions longues avec des sessions de conseil très courtes, sans perdre de temps à faire du commerce, ce qui vous permet de flux continu d'opportunitées pour des missions plus longues.",
            icon: <BarChart className="h-6 w-6" />
        }
    ];

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
                        Packagez votre expertise
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8 sm:mb-12 px-2">
                        Vendez des modules de conseil à des clients qualifiés sous la forme de sessions de 30&nbsp;minutes à 2&nbsp;heures.
                    </p>

                    {/* Sparks Grid */}
                    <div className="mb-12 sm:mb-16">
                        <SparksGrid
                            expertCalls={consultantExpertCalls}
                            expandedCallIndex={expandedCallIndex}
                            setExpandedCallIndex={setExpandedCallIndex}
                            onCallClick={handleSparkCreation}
                            buttonText="Créer mon premier Spark"
                        />
                    </div>

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
                            <span className="whitespace-nowrap">Créer mes premiers Sparks</span>
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </motion.button>
                        <motion.div variants={fadeInUp} className="w-full sm:w-auto">
                            <Link
                                to="/profile"
                                className="w-full sm:w-auto bg-white text-blue-600 border-2 border-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center gap-2 group"
                            >
                                <span className="whitespace-nowrap">Voir un profil exemple</span>
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Key Features Section */}
                <div
                    id="key-features"
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-12 sm:mb-16"
                >
                    {keyFeatures.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="bg-white rounded-xl p-6 sm:p-8 shadow-md"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                                    <Sparkles className="h-4 w-4" />
                                    Fonctionnalité phare #{index + 1}
                                </div>
                            </div>
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
                        </motion.div>
                    ))}
                </div>

                {/* Features Grid with Title */}
                <div className="mb-12 sm:mb-16">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 px-2">
                            Pourquoi Sparkier ?
                        </h2>
                    </div>

                    <motion.div
                        id="features"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8"
                        variants={stagger}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                            >
                                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                                <p className="text-gray-600 mb-4">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Sign Up Form */}
                <motion.div
                    id="signup-form"
                    className="max-w-2xl mx-auto px-3 sm:px-0"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Créez votre profil maintenant
                        </h2>
                        <p className="text-gray-600">
                            Packagez vos services en Sparks et commencez à vendre
                        </p>
                    </div>

                    {isSubmitted ? (
                        <div className="bg-green-50 text-green-800 p-6 rounded-xl text-center">
                            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
                            <h3 className="text-xl font-semibold mb-2">Merci pour votre inscription !</h3>
                            <p>Notre équipe va vous contacter dans les 24h pour finaliser la création de votre profil et vous accompagner dans la prise en main de la plateforme.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
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
                                    Créer mes premiers Sparks
                                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                            <p className="mt-4 text-sm text-gray-500 text-center">
                                En créant votre profil, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                            </p>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default LandingConsultants;