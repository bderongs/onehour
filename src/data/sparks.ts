import { Spark } from '../types/spark';

export const sparks: Spark[] = [
    {
        title: "Check-Up Stratégique Express",
        duration: "1h",
        price: "400€ HT",
        description: "Faire un état des lieux rapide de votre stratégie actuelle et identifier un ou deux axes prioritaires d'amélioration.",
        benefits: [
            "Analyse de votre stratégie actuelle",
            "Identification des axes d'amélioration",
            "Recommandations prioritaires"
        ],
        prefillText: "J'aimerais faire un état des lieux de notre stratégie d'entreprise.",
        highlight: "Stratégie",
        detailedDescription: `Le Check-Up Stratégique Express est conçu pour les dirigeants et managers qui souhaitent rapidement évaluer leur stratégie actuelle et identifier les opportunités d'amélioration les plus impactantes.

En une heure, nous analyserons ensemble votre situation actuelle, vos objectifs, et les principaux défis auxquels vous faites face. À l'issue de la session, vous aurez une vision claire des actions prioritaires à mettre en place pour optimiser votre stratégie.

Cette session est particulièrement utile si vous :
• Sentez que votre stratégie actuelle n'est pas optimale
• Faites face à des changements dans votre marché
• Souhaitez valider vos intuitions stratégiques
• Cherchez à prioriser vos initiatives`,
        methodology: [
            "Analyse rapide de votre situation actuelle et de vos objectifs",
            "Identification des écarts entre la situation actuelle et désirée",
            "Évaluation des forces et faiblesses de votre stratégie",
            "Définition des axes d'amélioration prioritaires",
            "Recommandations concrètes et actionnables"
        ],
        targetAudience: [
            "Dirigeants d'entreprise en quête de clarté stratégique",
            "Managers confrontés à des choix stratégiques",
            "Startups en phase de croissance",
            "PME cherchant à optimiser leur positionnement"
        ],
        prerequisites: [
            "Une stratégie ou des objectifs existants à analyser",
            "Des données basiques sur votre marché et votre performance",
            "Une ouverture d'esprit pour remettre en question les approches actuelles"
        ],
        deliverables: [
            "Diagnostic synthétique de votre stratégie actuelle",
            "Identification de 2-3 axes d'amélioration prioritaires",
            "Plan d'action initial avec premières étapes concrètes",
            "Compte-rendu écrit de la session avec les points clés",
            "Recommandations pour les prochaines étapes"
        ],
        expertProfile: {
            expertise: [
                "Stratégie d'entreprise",
                "Développement commercial",
                "Management",
                "Innovation"
            ],
            experience: "15+ ans d'expérience en conseil stratégique auprès de PME et startups"
        },
        faq: [
            {
                question: "Comment se déroule concrètement la session ?",
                answer: "La session se déroule en visioconférence. Nous commençons par un rapide tour d'horizon de votre situation, puis nous analysons en détail 2-3 aspects clés de votre stratégie. Nous terminons par des recommandations concrètes et actionnables."
            },
            {
                question: "Que dois-je préparer avant la session ?",
                answer: "Il est utile de préparer un bref résumé de votre stratégie actuelle, vos principaux objectifs et les défis que vous rencontrez. Notre IA vous guidera dans cette préparation avant la session."
            },
            {
                question: "Comment maximiser la valeur de cette session ?",
                answer: "Pour tirer le meilleur parti de cette session, venez avec des questions précises et des points spécifiques que vous souhaitez aborder. Plus vos interrogations seront ciblées, plus nos recommandations seront pertinentes."
            }
        ],
        testimonials: [
            {
                text: "En une heure, j'ai obtenu une clarté que je cherchais depuis des mois. Les recommandations étaient concrètes et directement applicables.",
                author: "Marie Dubois",
                role: "CEO",
                company: "TechStart"
            },
            {
                text: "Le format court nous a forcés à aller à l'essentiel. Très efficace pour identifier rapidement les points d'amélioration critiques.",
                author: "Pierre Martin",
                role: "Directeur Commercial",
                company: "InnovCorp"
            }
        ],
        nextSteps: [
            "Mise en œuvre des recommandations prioritaires",
            "Session de suivi pour évaluer les progrès (optionnel)",
            "Accompagnement plus approfondi si nécessaire",
            "Documentation détaillée des points d'amélioration identifiés"
        ]
    },
    {
        title: "Boost Commercial Express",
        duration: "1h",
        price: "400€ HT",
        description: "Identifier une opportunité immédiate pour augmenter vos ventes, que ce soit à travers une nouvelle approche client ou une optimisation de vos pratiques existantes.",
        benefits: [
            "Analyse de votre processus de vente",
            "Identification d'opportunités rapides",
            "Plan d'action concret"
        ],
        prefillText: "Je cherche à booster rapidement nos ventes.",
        highlight: "Commerce"
    },
    {
        title: "Essentiels du Recrutement",
        duration: "1h30",
        price: "600€ HT",
        description: "Réviser une stratégie de recrutement ou un processus d'entretien pour attirer et sélectionner les meilleurs talents.",
        benefits: [
            "Audit de votre processus actuel",
            "Optimisation de la stratégie",
            "Outils de sélection efficaces"
        ],
        prefillText: "J'ai besoin d'aide pour améliorer notre processus de recrutement.",
        highlight: "RH"
    },
    {
        title: "Sprint IA",
        duration: "1h30",
        price: "600€ HT",
        description: "Identifier un cas d'usage concret pour intégrer l'intelligence artificielle dans vos processus métiers.",
        benefits: [
            "Analyse de vos processus",
            "Identification des opportunités IA",
            "Recommandations pratiques"
        ],
        prefillText: "Je souhaite identifier des cas d'usage concrets de l'IA dans mon entreprise.",
        highlight: "IA"
    },
    {
        title: "Optimisation des Process",
        duration: "1h",
        price: "400€ HT",
        description: "Analyser un processus interne pour identifier des opportunités de simplification ou d'amélioration.",
        benefits: [
            "Cartographie du processus",
            "Identification des inefficacités",
            "Solutions d'optimisation"
        ],
        prefillText: "Je veux optimiser nos processus internes.",
        highlight: "Process"
    },
    {
        title: "Validation Produit-Marché",
        duration: "1h30",
        price: "600€ HT",
        description: "Tester rapidement si votre produit ou service correspond aux attentes du marché.",
        benefits: [
            "Analyse du marché cible",
            "Évaluation du fit produit",
            "Recommandations d'ajustement"
        ],
        prefillText: "Je souhaite valider l'adéquation de mon produit avec le marché.",
        highlight: "Produit"
    },
    {
        title: "Quick Wins Marketing",
        duration: "1h",
        price: "400€ HT",
        description: "Trouver une ou deux actions marketing immédiates pour augmenter votre visibilité ou votre engagement client.",
        benefits: [
            "Audit marketing rapide",
            "Actions à impact immédiat",
            "Plan d'exécution simple"
        ],
        prefillText: "Je cherche des actions marketing rapides à mettre en place.",
        highlight: "Marketing"
    },
    {
        title: "Navigation de Crise",
        duration: "1h30",
        price: "600€ HT",
        description: "Discuter d'une crise ou d'un problème spécifique pour élaborer une réponse rapide et efficace.",
        benefits: [
            "Analyse de la situation",
            "Plan d'action immédiat",
            "Stratégie de communication"
        ],
        prefillText: "J'ai besoin d'aide pour gérer une situation de crise.",
        highlight: "Urgence"
    },
    {
        title: "Dynamique d'Équipe",
        duration: "1h",
        price: "400€ HT",
        description: "Identifier un blocage dans la dynamique d'équipe et proposer des pistes pour améliorer la collaboration.",
        benefits: [
            "Diagnostic d'équipe",
            "Solutions pratiques",
            "Plan d'amélioration"
        ],
        prefillText: "Je souhaite améliorer la dynamique de mon équipe.",
        highlight: "Management"
    },
    {
        title: "Diagnostic Financier Express",
        duration: "1h30",
        price: "600€ HT",
        description: "Examiner rapidement vos finances pour identifier une priorité immédiate : gestion des coûts, trésorerie, ou marges.",
        benefits: [
            "Analyse financière rapide",
            "Identification des priorités",
            "Recommandations concrètes"
        ],
        prefillText: "J'aimerais faire un check-up rapide de nos finances.",
        highlight: "Finance"
    }
]; 