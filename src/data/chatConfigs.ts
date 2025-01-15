import { ChatConfig } from '../types/chat';

export const CHAT_CONFIGS: Record<string, ChatConfig> = {
    spark_finder: {
        initialMessage: {
            role: 'assistant',
            content: "Bonjour ! Je peux vous aider à trouver le Spark qui correspond à votre besoin. Décrivez-moi votre problématique."
        },
        title: "Rechercher un Spark",
        subtitle: "Notre assistant IA vous aide à trouver le Spark qu'il vous faut",
        systemPrompt: `Vous êtes un assistant spécialisé dans l'aide au choix de Sparks, des modules de conseil courts et ciblés.
Votre rôle est d'aider les utilisateurs à identifier le Spark le plus adapté à leur besoin.
Posez des questions pertinentes pour comprendre leur contexte et leurs attentes.
Une fois que vous avez suffisamment d'informations, proposez le Spark le plus adapté en expliquant pourquoi.`,
        summaryInstructions: `Résumez les informations clés du besoin de l'utilisateur pour identifier le Spark le plus adapté.
Incluez :
- La problématique principale
- Le contexte de l'entreprise
- L'urgence et les délais
- Le domaine d'expertise requis
- Les attentes principales`,
        submitMessage: "Trouver mon Spark",
        confirmationMessage: "J'ai trouvé le Spark qui correspond à votre besoin !",
        onConnect: () => {}
    },
    consultant_qualification: {
        initialMessage: {
            role: 'assistant',
            content: "Bonjour ! Je suis l'assistant virtuel d'Arnaud. Mon rôle est de vous aider à clarifier votre brief avant votre échange avec lui. Plus je comprends précisément votre besoin, plus Arnaud pourra préparer des solutions pertinentes. Pouvez-vous me parler de votre projet ?"
        },
        title: "Brief de projet",
        subtitle: "Notre assistant IA vous aide à préparer votre consultation",
        systemPrompt: `Vous êtes un assistant spécialisé dans la qualification des besoins clients avant une consultation avec un expert.
Votre rôle est d'aider les utilisateurs à clarifier et structurer leur besoin pour optimiser la session avec l'expert.
Posez des questions pertinentes pour comprendre :
- Le défi principal ou le projet
- La situation actuelle et le contexte
- Les objectifs et résultats souhaités
- Les contraintes (budget, délais, techniques)
- Les parties prenantes impliquées
- Les solutions déjà tentées

Une fois que vous avez suffisamment d'informations, confirmez que vous avez bien compris le besoin en le résumant.`,
        summaryInstructions: `Résumez les informations clés du projet pour préparer la consultation.
Incluez :
- Le défi principal
- La situation actuelle
- Les objectifs visés
- Les contraintes
- Les parties prenantes
- Les solutions tentées`,
        submitMessage: "Réserver ma consultation",
        confirmationMessage: "Excellent ! J'ai tous les détails nécessaires pour préparer votre consultation avec Arnaud",
        onConnect: () => {}
    }
} 