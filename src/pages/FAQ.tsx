import React from 'react';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FAQItem {
    question: string;
    answer: string | React.ReactNode;
}

export function FAQ() {
    const navigate = useNavigate();

    const faqs: FAQItem[] = [
        {
            question: "Qu'est-ce que Sparkier ?",
            answer: "Sparkier est un service de micro-consulting qui vous met en relation avec des experts qualifiés pour des sessions de conseil d'une heure. Notre plateforme permet de résoudre rapidement vos problématiques professionnelles avec l'aide d'experts triés sur le volet."
        },
        {
            question: "Comment fonctionne le service ?",
            answer: (
                <ol className="list-decimal list-inside space-y-2">
                    <li>Décrivez votre problématique via notre formulaire</li>
                    <li>Notre IA vous aide à préciser vos besoins</li>
                    <li>Réservez un créneau d'une heure avec un expert</li>
                    <li>Connectez-vous pour votre session de conseil</li>
                    <li>Recevez un compte-rendu détaillé après la session</li>
                </ol>
            )
        },
        {
            question: "Combien coûte une session ?",
            answer: "Chaque session de conseil coûte 150€ TTC pour une heure. Ce tarif unique comprend la session de conseil, la préparation de l'expert, et le compte-rendu détaillé généré par notre IA."
        },
        {
            question: "Qui sont vos experts ?",
            answer: "Nos experts sont des professionnels avec au minimum 10 ans d'expérience dans leur domaine. Ils sont rigoureusement sélectionnés (moins de 5% des candidats sont retenus) et maintiennent une note minimale de 4.8/5 basée sur les retours clients."
        },
        {
            question: "Quels types de problématiques peuvent être traités ?",
            answer: "Nous couvrons un large éventail de sujets professionnels, notamment : le choix de solutions logicielles, l'intégration de l'IA dans votre entreprise, le recrutement technique, et bien d'autres domaines. Si votre problématique est spécifique, nous vous mettrons en relation avec l'expert le plus pertinent."
        },
        {
            question: "Comment se déroule une session de conseil ?",
            answer: "Les sessions se déroulent en visioconférence via notre plateforme sécurisée. Pendant l'heure de conseil, vous interagissez directement avec l'expert pendant que notre IA prend des notes. Après la session, vous recevez un compte-rendu détaillé avec les points clés et les actions recommandées."
        },
        {
            question: "Que se passe-t-il si je ne suis pas satisfait ?",
            answer: "Nous garantissons la qualité de nos sessions de conseil. Si vous n'êtes pas satisfait, nous vous proposons soit une nouvelle session avec un autre expert, soit un remboursement intégral."
        },
        {
            question: "Comment sont sélectionnés les experts ?",
            answer: (
                <ul className="list-disc list-inside space-y-2">
                    <li>Minimum 10 ans d'expérience professionnelle</li>
                    <li>Vérification approfondie des références</li>
                    <li>Entretiens techniques poussés</li>
                    <li>Évaluation continue via les retours clients</li>
                    <li>Maintien d'une note minimale de 4.8/5</li>
                </ul>
            )
        },
        {
            question: "Puis-je choisir mon expert ?",
            answer: "Oui, après avoir décrit votre problématique, vous aurez accès aux profils des experts disponibles et pertinents pour votre cas. Vous pourrez choisir celui qui vous semble le plus adapté en fonction de son expertise et de ses disponibilités."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Retour à l'accueil
                    </button>
                </div>

                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <HelpCircle className="h-12 w-12 text-indigo-600" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Questions Fréquentes
                    </h1>
                    <p className="text-xl text-gray-600">
                        Tout ce que vous devez savoir sur Sparkier
                    </p>
                </div>

                {/* FAQ Items */}
                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                        >
                            <h3 className="text-xl font-semibold mb-3 text-gray-900">
                                {faq.question}
                            </h3>
                            <div className="text-gray-600 leading-relaxed">
                                {faq.answer}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact Section */}
                <div className="mt-12 text-center">
                    <p className="text-gray-600">
                        Vous ne trouvez pas la réponse à votre question ?
                    </p>
                    <p className="mt-2">
                        <a
                            href="mailto:contact@sparkier.io"
                            className="text-indigo-600 hover:text-indigo-700 font-semibold"
                        >
                            Contactez-nous
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
} 