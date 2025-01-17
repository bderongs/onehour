import { Spark } from '../types/spark';

const generateUrl = (title: string): string => {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

export const sparks: Spark[] = [
    {
        consultant: 'arnaud',
        title: "Appel Découverte",
        duration: "30 minutes",
        price: "Gratuit",
        description: "Un premier échange pour comprendre vos enjeux et évaluer comment je peux vous accompagner dans votre transformation.",
        benefits: [
            "Présentation de votre contexte",
            "Identification des challenges",
            "Évaluation des besoins",
            "Recommandations initiales"
        ],
        prefillText: "J'aimerais discuter de mes enjeux de transformation.",
        highlight: "Sans engagement",
        url: generateUrl("Appel Découverte"),
        deliverables: [
            "Présentation de votre contexte",
            "Identification des challenges",
            "Évaluation des besoins",
            "Recommandations initiales"
        ]
    },
    {
        consultant: 'arnaud',
        title: "Consultation Flash",
        duration: "1 heure",
        price: "250€",
        description: "Session de conseil rapide pour débloquer une situation ou obtenir un avis expert sur un sujet précis.",
        benefits: [
            "Analyse de la problématique",
            "Solutions concrètes",
            "Recommandations pratiques",
            "Compte-rendu synthétique"
        ],
        prefillText: "J'ai besoin d'un avis expert rapide sur une situation.",
        highlight: "Solution rapide",
        url: generateUrl("Consultation Flash"),
        deliverables: [
            "Analyse de la problématique",
            "Solutions concrètes",
            "Recommandations pratiques",
            "Compte-rendu synthétique"
        ]
    },
    {
        consultant: 'arnaud',
        title: "Session Stratégique",
        duration: "90 minutes",
        price: "375€",
        description: "Session approfondie pour élaborer une stratégie ou résoudre un défi complexe avec un plan d'action détaillé.",
        benefits: [
            "Analyse approfondie",
            "Plan d'action détaillé",
            "Identification des risques",
            "Priorisation des actions"
        ],
        prefillText: "Je souhaite élaborer une stratégie pour un défi complexe.",
        highlight: "Best-seller",
        url: generateUrl("Session Stratégique"),
        deliverables: [
            "Analyse approfondie",
            "Plan d'action détaillé",
            "Identification des risques",
            "Priorisation des actions"
        ]
    },
    {
        consultant: 'arnaud',
        title: "Workshop Innovation",
        duration: "2 heures",
        price: "500€",
        description: "Session collaborative pour générer des idées innovantes et définir une vision produit avec votre équipe.",
        benefits: [
            "Animation d'atelier créatif",
            "Génération d'idées",
            "Priorisation des concepts",
            "Synthèse et next steps"
        ],
        prefillText: "Je veux organiser un atelier d'innovation avec mon équipe.",
        highlight: "Collaboration",
        url: generateUrl("Workshop Innovation"),
        deliverables: [
            "Animation d'atelier créatif",
            "Génération d'idées",
            "Priorisation des concepts",
            "Synthèse et next steps"
        ]
    },
    {
        consultant: 'arnaud',
        title: "Diagnostic Express",
        duration: "2 heures",
        price: "500€",
        description: "Évaluation rapide de votre maturité digitale ou agile avec recommandations concrètes.",
        benefits: [
            "Audit express",
            "Quick wins identifiés",
            "Recommandations prioritaires",
            "Plan d'action immédiat"
        ],
        prefillText: "Je souhaite évaluer rapidement notre maturité digitale.",
        highlight: "Diagnostic",
        url: generateUrl("Diagnostic Express"),
        deliverables: [
            "Audit express",
            "Quick wins identifiés",
            "Recommandations prioritaires",
            "Plan d'action immédiat"
        ]
    },
    {
        title: "Check-up stratégique express",
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
        url: generateUrl("Check-Up Stratégique Express"),
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
        title: "Boost commercial express",
        duration: "1h",
        price: "400€ HT",
        description: "Identifier une opportunité immédiate pour augmenter vos ventes, que ce soit à travers une nouvelle approche client ou une optimisation de vos pratiques existantes.",
        benefits: [
            "Analyse de votre processus de vente",
            "Identification d'opportunités rapides",
            "Plan d'action concret"
        ],
        prefillText: "Je cherche à booster rapidement nos ventes.",
        highlight: "Commerce",
        url: generateUrl("Boost Commercial Express"),
        detailedDescription: `Le Boost Commercial Express est conçu pour les entreprises qui souhaitent rapidement identifier et saisir des opportunités d'augmentation de leurs ventes. Cette session intensive d'une heure se concentre sur l'analyse de vos pratiques commerciales actuelles pour détecter des leviers d'amélioration immédiatement actionnables.

En une heure, nous examinerons vos processus de vente, vos indicateurs clés et vos points de friction actuels pour identifier les opportunités les plus prometteuses. Vous repartirez avec un plan d'action concret et des recommandations pratiques à mettre en œuvre dès le lendemain.

Cette session est particulièrement utile si vous :
• Constatez une stagnation ou une baisse de vos ventes
• Souhaitez optimiser votre processus commercial
• Cherchez à améliorer votre taux de conversion
• Voulez tester de nouvelles approches commerciales`,
        methodology: [
            "Analyse rapide de vos KPIs commerciaux actuels",
            "Identification des goulots d'étranglement dans votre tunnel de vente",
            "Évaluation de vos outils et processus de vente",
            "Benchmark rapide avec les meilleures pratiques du secteur",
            "Définition d'actions concrètes à fort impact"
        ],
        targetAudience: [
            "Directeurs commerciaux cherchant un regard externe",
            "Entrepreneurs souhaitant booster leurs ventes",
            "Responsables de business development",
            "Équipes commerciales en quête de nouvelles approches"
        ],
        prerequisites: [
            "Accès à vos principaux indicateurs commerciaux",
            "Description de votre processus de vente actuel",
            "Exemples de situations commerciales typiques",
            "Identification des principaux freins à la vente"
        ],
        deliverables: [
            "Diagnostic flash de votre performance commerciale",
            "2-3 opportunités d'amélioration à impact rapide",
            "Plan d'action détaillé sur 30 jours",
            "Outils et templates pour optimiser vos process",
            "Recommandations pour le suivi des résultats"
        ],
        expertProfile: {
            expertise: [
                "Développement commercial",
                "Sales enablement",
                "Négociation",
                "CRM et outils de vente"
            ],
            experience: "12+ ans d'expérience en direction commerciale et conseil en vente"
        },
        faq: [
            {
                question: "Quels résultats puis-je espérer ?",
                answer: "L'objectif est d'identifier au moins une action qui peut générer une augmentation de 10-20% de vos ventes dans les 30 prochains jours."
            },
            {
                question: "Comment se préparer au mieux ?",
                answer: "Préparez vos chiffres clés des 3-6 derniers mois et une liste de vos principaux défis commerciaux. Notre IA vous guidera dans cette préparation."
            },
            {
                question: "La session est-elle adaptée aux grands comptes ?",
                answer: "Oui, nous adaptons l'approche selon votre contexte, que ce soit pour des ventes B2B complexes ou des cycles de vente plus courts."
            }
        ],
        testimonials: [
            {
                text: "Les recommandations étaient immédiatement applicables et ont généré une augmentation de 15% de nos ventes dès le premier mois.",
                author: "Thomas Laurent",
                role: "Directeur Commercial",
                company: "SalesForce"
            },
            {
                text: "La session m'a permis d'identifier un point de friction majeur dans notre processus de vente que nous avons pu corriger rapidement.",
                author: "Sophie Martin",
                role: "CEO",
                company: "GrowthTech"
            }
        ],
        nextSteps: [
            "Mise en place des actions prioritaires identifiées",
            "Suivi des KPIs sur 30 jours",
            "Session de review des résultats (optionnel)",
            "Ajustement du plan d'action selon les premiers retours"
        ]
    },
    {
        title: "Processus de recrutement",
        duration: "1h30",
        price: "600€ HT",
        description: "Réviser une stratégie de recrutement ou un processus d'entretien pour attirer et sélectionner les meilleurs talents.",
        benefits: [
            "Audit de votre processus actuel",
            "Optimisation de la stratégie",
            "Outils de sélection efficaces"
        ],
        prefillText: "J'ai besoin d'aide pour améliorer notre processus de recrutement.",
        highlight: "RH",
        url: generateUrl("Processus de Recrutement"),
        detailedDescription: `La session Processus deRecrutement est conçue pour les entreprises qui souhaitent optimiser leur approche du recrutement afin d'attirer et de sélectionner les meilleurs talents de manière plus efficace et plus fiable.

En 1h30, nous analyserons en profondeur votre processus de recrutement actuel, depuis la définition des besoins jusqu'à l'intégration des nouveaux collaborateurs. Vous repartirez avec des outils concrets et des méthodologies éprouvées pour améliorer significativement la qualité et l'efficacité de vos recrutements.

Cette session est particulièrement utile si vous :
• Rencontrez des difficultés à attirer les bons profils
• Souhaitez réduire votre temps de recrutement
• Voulez améliorer votre taux de conversion
• Cherchez à optimiser vos coûts de recrutement`,
        methodology: [
            "Audit complet de votre processus de recrutement actuel",
            "Analyse de vos canaux de sourcing",
            "Évaluation de vos méthodes de sélection",
            "Optimisation de votre marque employeur",
            "Structuration du processus d'entretien"
        ],
        targetAudience: [
            "DRH et RRH en quête d'amélioration continue",
            "Managers impliqués dans le recrutement",
            "Startups en phase de croissance rapide",
            "PME souhaitant professionnaliser leur recrutement"
        ],
        prerequisites: [
            "Description de votre processus de recrutement actuel",
            "Statistiques basiques de vos recrutements récents",
            "Exemples de vos supports de recrutement",
            "Identification de vos principaux défis"
        ],
        deliverables: [
            "Diagnostic détaillé de votre processus actuel",
            "Plan d'optimisation sur mesure",
            "Boîte à outils de recrutement (grilles d'entretien, tests...)",
            "Guide des meilleures pratiques",
            "Templates de communication candidats"
        ],
        expertProfile: {
            expertise: [
                "Recrutement et talent acquisition",
                "Assessment et évaluation",
                "Marque employeur",
                "SIRH et outils RH"
            ],
            experience: "10+ ans d'expérience en recrutement et conseil RH"
        },
        faq: [
            {
                question: "La session peut-elle couvrir plusieurs types de postes ?",
                answer: "Oui, nous adaptons les recommandations selon vos besoins spécifiques, qu'il s'agisse de profils techniques, commerciaux ou managériaux."
            },
            {
                question: "Quels outils sont recommandés ?",
                answer: "Nous vous conseillons sur les meilleurs outils adaptés à votre contexte, de l'ATS aux plateformes d'évaluation, en tenant compte de votre budget et de vos contraintes."
            },
            {
                question: "Comment mesurer les résultats ?",
                answer: "Nous définissons ensemble des KPIs clairs : temps de recrutement, coût par recrutement, qualité des candidatures, taux de conversion, etc."
            }
        ],
        testimonials: [
            {
                text: "Nous avons réduit notre temps de recrutement de 40% tout en améliorant la qualité des profils sélectionnés.",
                author: "Claire Dubois",
                role: "DRH",
                company: "TechCorp"
            },
            {
                text: "Les outils fournis nous ont permis de structurer nos entretiens et d'être beaucoup plus efficaces dans notre sélection.",
                author: "Marc Leroy",
                role: "Responsable Recrutement",
                company: "InnovGroup"
            }
        ],
        nextSteps: [
            "Implémentation des nouveaux outils et processus",
            "Formation des équipes aux nouvelles méthodes",
            "Suivi des indicateurs de performance",
            "Session de review après 3 mois (optionnel)"
        ]
    },
    {
        title: "Sprint ia",
        duration: "1h30",
        price: "600€ HT",
        description: "Identifier un cas d'usage concret pour intégrer l'intelligence artificielle dans vos processus métiers.",
        benefits: [
            "Analyse de vos processus",
            "Identification des opportunités IA",
            "Recommandations pratiques"
        ],
        prefillText: "Je souhaite identifier des cas d'usage concrets de l'IA dans mon entreprise.",
        highlight: "IA",
        url: generateUrl("Sprint IA")
    },
    {
        title: "Optimisation des process",
        duration: "1h",
        price: "400€ HT",
        description: "Analyser un processus interne pour identifier des opportunités de simplification ou d'amélioration.",
        benefits: [
            "Cartographie du processus",
            "Identification des inefficacités",
            "Solutions d'optimisation"
        ],
        prefillText: "Je veux optimiser nos processus internes.",
        highlight: "Process",
        url: generateUrl("Optimisation des Process")
    },
    {
        title: "Validation produit-marché",
        duration: "1h30",
        price: "600€ HT",
        description: "Tester rapidement si votre produit ou service correspond aux attentes du marché.",
        benefits: [
            "Analyse du marché cible",
            "Évaluation du fit produit",
            "Recommandations d'ajustement"
        ],
        prefillText: "Je souhaite valider l'adéquation de mon produit avec le marché.",
        highlight: "Produit",
        url: generateUrl("Validation Produit-Marché")
    },
    {
        title: "Quick wins marketing",
        duration: "1h",
        price: "400€ HT",
        description: "Trouver une ou deux actions marketing immédiates pour augmenter votre visibilité ou votre engagement client.",
        benefits: [
            "Audit marketing rapide",
            "Actions à impact immédiat",
            "Plan d'exécution simple"
        ],
        prefillText: "Je cherche des actions marketing rapides à mettre en place.",
        highlight: "Marketing",
        url: generateUrl("Quick Wins Marketing")
    },
    {
        title: "Navigation de crise",
        duration: "1h30",
        price: "600€ HT",
        description: "Discuter d'une crise ou d'un problème spécifique pour élaborer une réponse rapide et efficace.",
        benefits: [
            "Analyse de la situation",
            "Plan d'action immédiat",
            "Stratégie de communication"
        ],
        prefillText: "J'ai besoin d'aide pour gérer une situation de crise.",
        highlight: "Urgence",
        url: generateUrl("Navigation de Crise")
    },
    {
        title: "Dynamique d'équipe",
        duration: "1h",
        price: "400€ HT",
        description: "Identifier un blocage dans la dynamique d'équipe et proposer des pistes pour améliorer la collaboration.",
        benefits: [
            "Diagnostic d'équipe",
            "Solutions pratiques",
            "Plan d'amélioration"
        ],
        prefillText: "Je souhaite améliorer la dynamique de mon équipe.",
        highlight: "Management",
        url: generateUrl("Dynamique d'Équipe")
    },
    {
        title: "Diagnostic financier express",
        duration: "1h30",
        price: "600€ HT",
        description: "Examiner rapidement vos finances pour identifier une priorité immédiate : gestion des coûts, trésorerie, ou marges.",
        benefits: [
            "Analyse financière rapide",
            "Identification des priorités",
            "Recommandations concrètes"
        ],
        prefillText: "J'aimerais faire un check-up rapide de nos finances.",
        highlight: "Finance",
        url: generateUrl("Diagnostic Financier Express")
    }
]; 