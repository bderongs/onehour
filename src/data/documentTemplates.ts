import type { DocumentTemplate } from '../types/chat';

export const DOCUMENT_TEMPLATES: Record<string, DocumentTemplate> = {
    spark_finder: {
        id: 'spark_finder',
        name: 'Brief de recherche',
        placeholderMessage: "Commencez la conversation pour trouver votre Spark idéal.",
        continueConversationMessage: "Continuez à me parler de votre besoin pour que je puisse identifier le Spark le plus adapté",
        documentCompleteMessage: "J'ai toutes les informations pour vous proposer le meilleur Spark !",
        fields: [
            {
                key: 'challenge',
                label: 'Problématique',
                description: 'Description de votre besoin ou problématique',
                required: true,
                type: 'text'
            },
            {
                key: 'context',
                label: 'Contexte',
                description: 'Contexte de votre entreprise et de votre besoin',
                required: true,
                type: 'text'
            },
            {
                key: 'urgency',
                label: 'Urgence',
                description: 'Niveau d\'urgence et délais souhaités',
                required: true,
                type: 'text'
            },
            {
                key: 'domain',
                label: 'Domaine',
                description: 'Domaine d\'expertise principal concerné',
                required: true,
                type: 'text'
            },
            {
                key: 'expectations',
                label: 'Attentes',
                description: 'Vos attentes principales pour cette consultation',
                required: true,
                type: 'text'
            }
        ]
    },
    consultant_qualification: {
        id: 'consultant_qualification',
        name: 'Brief de projet',
        placeholderMessage: "Expliquez votre projet à l'assistant pour voir apparaître un résumé de votre besoin ici.",
        continueConversationMessage: "Continuez à me décrire votre projet pour qu'Arnaud puisse préparer au mieux votre consultation",
        documentCompleteMessage: "Excellent ! J'ai tous les détails nécessaires pour préparer votre consultation avec Arnaud",
        fields: [
            {
                key: 'challenge',
                label: 'Défi',
                description: 'Description du défi principal ou du projet',
                required: true,
                type: 'text'
            },
            {
                key: 'currentSituation',
                label: 'Situation Actuelle',
                description: 'État actuel et contexte',
                required: true,
                type: 'text'
            },
            {
                key: 'desiredOutcome',
                label: 'Objectifs',
                description: 'Résultats souhaités et critères de succès',
                required: true,
                type: 'text'
            },
            {
                key: 'constraints',
                label: 'Contraintes',
                description: 'Budget, délais et contraintes techniques',
                required: true,
                type: 'text'
            },
            {
                key: 'stakeholders',
                label: 'Parties Prenantes',
                description: 'Personnes clés impliquées',
                required: true,
                type: 'text'
            },
            {
                key: 'previousAttempts',
                label: 'Solutions Tentées',
                description: 'Solutions ou tentatives précédentes',
                required: true,
                type: 'text'
            }
        ]
    },
    automation_assessment: {
        id: 'automation_assessment',
        name: 'Évaluation technique',
        placeholderMessage: "Commencez la conversation pour évaluer vos besoins en automatisation.",
        continueConversationMessage: "Continuez à décrire vos processus pour que nous puissions évaluer précisément le potentiel d'automatisation",
        documentCompleteMessage: "Parfait ! J'ai toutes les informations pour préparer votre évaluation technique",
        fields: [
            {
                key: 'processes',
                label: 'Processus',
                description: 'Liste des processus à automatiser',
                required: true,
                type: 'list'
            },
            {
                key: 'currentTools',
                label: 'Outils Actuels',
                description: 'Outils et systèmes actuellement utilisés',
                required: true,
                type: 'text'
            },
            {
                key: 'volume',
                label: 'Volume',
                description: 'Volume et fréquence des tâches',
                required: true,
                type: 'text'
            },
            {
                key: 'constraints',
                label: 'Contraintes',
                description: 'Contraintes techniques ou métier',
                required: true,
                type: 'text'
            },
            {
                key: 'expectedBenefits',
                label: 'Bénéfices Attendus',
                description: 'Bénéfices attendus et ROI',
                required: true,
                type: 'text'
            },
            {
                key: 'complexity',
                label: 'Complexité',
                description: 'Complexité estimée (FAIBLE, MOYENNE, HAUTE)',
                required: true,
                type: 'text',
                validation: {
                    pattern: '^(FAIBLE|MOYENNE|HAUTE)$'
                }
            }
        ]
    }
}; 