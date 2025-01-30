import React, { useState, useEffect } from 'react';
import { signUpConsultantWithEmail } from '../services/auth';
import { CheckCircle, ArrowRight, Sparkles, Package2, Clock, Store } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SparksGrid } from '../components/SparksGrid';
import { getSparks } from '../services/sparks';
import type { Spark } from '../types/spark';
import { Notification } from '../components/Notification';
import '../styles/highlight.css';

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
    const navigate = useNavigate();
    const [sparks, setSparks] = useState<Spark[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        linkedin: '',
        email: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [expandedCallIndex, setExpandedCallIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchSparks = async () => {
            try {
                const fetchedSparks = await getSparks();
                setSparks(fetchedSparks);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching sparks:', err);
                setError('Failed to load sparks. Please try again later.');
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signUpConsultantWithEmail(formData);
            setIsSubmitted(true);
            setFormData({ firstName: '', lastName: '', linkedin: '', email: '' });
            setNotification({
                type: 'success',
                message: 'Inscription réussie ! Veuillez vérifier votre email pour finaliser votre inscription.'
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            setNotification({
                type: 'error',
                message: 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.'
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSparkCreation = () => {
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
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}
            
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
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-4 text-gray-600">Loading sparks...</p>
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
                                    navigate(`/sparks/${spark.url}`);
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
                            Comment ça <span className="highlight">fonctionne</span> ?
                        </h2>
                    </div>

                    <motion.div
                        id="features"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8"
                        variants={stagger}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
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
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                                        {index + 1}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                                </div>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Advantages Section */}
                <div className="mb-12 sm:mb-16">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 px-2">
                            Vos avantages clés
                        </h2>
                    </div>

                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8"
                        variants={stagger}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {[
                            "Maximisez votre rentabilité en éliminant les phases commerciales chronophages",
                             "Augmentez votre taux de conversion grâce à des offres standardisées et prêtes à l'emploi",
                            "Gagnez du temps sur la préparation de vos offres",
                            "Proposez une expérience client fluide avec des briefs précis et une prise de rendez-vous simplifiée"
                           
                        ].map((advantage, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-start gap-3"
                            >
                                <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                                <p className="text-gray-600">{advantage}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* CTA Section */}
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
                            <p>Veuillez vérifier votre boîte mail pour confirmer votre adresse email. Une fois confirmée, vous pourrez accéder à la plateforme et commencer à créer vos Sparks et votre page de conversion.</p>
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
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 group"
                                >
                                    Créer mes premiers Sparks gratuitement
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