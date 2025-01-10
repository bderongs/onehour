import { Bot, Users, Package2, Target, Zap, Shield, Calendar, MessageSquare, FileText, Briefcase } from 'lucide-react';
import { ExpertCall } from '../types/expertCall';
import React from 'react';

// Create a function to generate the icon instead of directly embedding JSX
const createIcon = (Icon: any) => React.createElement(Icon, { className: "h-6 w-6" });

export const expertCalls: ExpertCall[] = [
    {
        icon: createIcon(Package2),
        title: "Choisir un CRM",
        duration: "1h",
        price: "400€ HT",
        description: "Un expert en solutions CRM vous aide à comparer et sélectionner la meilleure solution pour votre entreprise.",
        benefits: [
            "Analyse de vos besoins spécifiques",
            "Comparaison des solutions du marché",
            "Recommandations personnalisées"
        ],
        prefillText: "J'ai besoin d'aide pour choisir un CRM adapté à mon entreprise de 50 personnes."
    },
    {
        icon: createIcon(Bot),
        title: "Automatiser le support client",
        duration: "1h30",
        price: "600€ HT",
        description: "Optimisez votre service client grâce à l'IA. Un expert vous guide dans l'automatisation intelligente de vos processus.",
        benefits: [
            "Audit de vos processus actuels",
            "Identification des opportunités d'automatisation",
            "Plan d'implémentation détaillé"
        ],
        prefillText: "Je souhaite automatiser notre support client avec l'IA pour réduire le temps de réponse."
    },
    {
        icon: createIcon(Users),
        title: "Recruter un CTO",
        duration: "2h",
        price: "800€ HT",
        description: "Un expert en recrutement tech vous accompagne dans la définition du profil et la stratégie de recrutement de votre futur CTO.",
        benefits: [
            "Définition du profil idéal",
            "Stratégie de sourcing",
            "Grille d'évaluation technique"
        ],
        prefillText: "J'ai besoin d'aide pour recruter un CTO pour ma startup en série A."
    },
    {
        icon: createIcon(Target),
        title: "Définir ma stratégie marketing",
        duration: "1h30",
        price: "600€ HT",
        description: "Construisez une stratégie marketing efficace avec l'aide d'un expert qui analyse votre marché et vos objectifs.",
        benefits: [
            "Analyse de votre positionnement",
            "Identification des canaux prioritaires",
            "Plan d'action concret"
        ],
        prefillText: "Je cherche à définir ma stratégie marketing digital pour 2024."
    },
    {
        icon: createIcon(Zap),
        title: "Optimiser mes process",
        duration: "1h",
        price: "400€ HT",
        description: "Identifiez et éliminez les inefficacités dans vos processus avec l'aide d'un expert en optimisation opérationnelle.",
        benefits: [
            "Cartographie des processus",
            "Identification des points de friction",
            "Recommandations d'amélioration"
        ],
        prefillText: "Je veux optimiser les processus internes de mon entreprise."
    },
    {
        icon: createIcon(Shield),
        title: "Audit sécurité",
        duration: "2h",
        price: "800€ HT",
        description: "Évaluez la sécurité de votre infrastructure IT et identifiez les points d'amélioration avec un expert en cybersécurité.",
        benefits: [
            "Analyse des vulnérabilités",
            "Évaluation des risques",
            "Plan d'action prioritaire"
        ],
        prefillText: "J'aimerais faire un audit de sécurité de mon infrastructure IT."
    },
    {
        icon: createIcon(Calendar),
        title: "Planifier ma levée de fonds",
        duration: "1h30",
        price: "600€ HT",
        description: "Préparez votre levée de fonds avec un expert qui vous aide à structurer votre approche et maximiser vos chances de succès.",
        benefits: [
            "Évaluation de votre maturité",
            "Stratégie de pitch",
            "Planning détaillé"
        ],
        prefillText: "Je prépare une levée de fonds et j'ai besoin de conseils stratégiques."
    },
    {
        icon: createIcon(MessageSquare),
        title: "Améliorer mes ventes",
        duration: "1h",
        price: "400€ HT",
        description: "Boostez vos performances commerciales avec un expert qui analyse votre processus de vente et identifie les leviers de croissance.",
        benefits: [
            "Audit du tunnel de vente",
            "Optimisation du closing",
            "Techniques d'acquisition"
        ],
        prefillText: "Je cherche à améliorer la performance de mon équipe commerciale."
    },
    {
        icon: createIcon(FileText),
        title: "Rédiger mon business plan",
        duration: "2h",
        price: "800€ HT",
        description: "Structurez votre business plan avec l'aide d'un expert qui vous guide dans la construction d'un document convaincant.",
        benefits: [
            "Structure personnalisée",
            "Analyse financière",
            "Storytelling impactant"
        ],
        prefillText: "J'ai besoin d'aide pour structurer mon business plan."
    },
    {
        icon: createIcon(Briefcase),
        title: "Développer à l'international",
        duration: "1h30",
        price: "600€ HT",
        description: "Planifiez votre expansion internationale avec un expert qui vous aide à identifier les opportunités et éviter les pièges.",
        benefits: [
            "Analyse des marchés cibles",
            "Stratégie d'entrée",
            "Plan de déploiement"
        ],
        prefillText: "Je souhaite développer mon entreprise à l'international."
    }
];