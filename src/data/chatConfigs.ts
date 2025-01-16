import { ChatConfig } from '../types/chat';
import { DOCUMENT_TEMPLATES } from './documentTemplates';
import { generateSystemPrompt, generateSummaryInstructions } from '../services/promptGenerators';

export const CHAT_CONFIGS: Record<string, ChatConfig> = {
    spark_finder: {
        initialMessage: {
            role: 'assistant',
            content: "Bonjour ! Je peux vous aider à trouver le Spark qui correspond à votre besoin. Décrivez-moi votre problématique."
        },
        title: "Rechercher un Spark",
        subtitle: "Notre assistant IA vous aide à trouver le Spark qu'il vous faut",
        roleDescription: `Vous êtes un assistant spécialisé dans l'aide au choix de Sparks, des modules de conseil courts et ciblés.
Votre rôle est d'aider les utilisateurs à identifier le Spark le plus adapté à leur besoin.
Vous devez comprendre leur contexte et leurs attentes pour proposer le Spark le plus pertinent.`,
        systemPrompt: "",  // Will be set after initialization
        summaryInstructions: "",  // Will be set after initialization
        submitMessage: "Trouver mon Spark",
        confirmationMessage: DOCUMENT_TEMPLATES.spark_finder.documentCompleteMessage || "J'ai trouvé le Spark qui correspond à votre besoin !",
        onConnect: () => {}
    },
    consultant_qualification: {
        initialMessage: {
            role: 'assistant',
            content: "Bonjour ! Je suis l'assistant virtuel d'Arnaud. Mon rôle est de vous aider à clarifier votre brief avant votre échange avec lui. Plus je comprends précisément votre besoin, plus Arnaud pourra préparer des solutions pertinentes. Pouvez-vous me parler de votre projet ?"
        },
        title: "Brief de projet",
        subtitle: "Notre assistant IA vous aide à préparer votre consultation",
        roleDescription: `Vous êtes un assistant spécialisé dans la qualification des besoins clients avant une consultation avec Arnaud.
Votre rôle est d'aider les utilisateurs à clarifier et structurer leur besoin pour optimiser la session avec l'expert.
Vous devez obtenir une vision complète de leur projet pour permettre à Arnaud de préparer des solutions pertinentes.`,
        systemPrompt: "",  // Will be set after initialization
        summaryInstructions: "",  // Will be set after initialization
        submitMessage: "Réserver ma consultation",
        confirmationMessage: DOCUMENT_TEMPLATES.consultant_qualification.documentCompleteMessage || "Excellent ! J'ai tous les détails nécessaires pour préparer votre consultation avec Arnaud",
        onConnect: () => {}
    }
};

// Initialize dynamic fields
Object.entries(CHAT_CONFIGS).forEach(([key, config]) => {
    const template = DOCUMENT_TEMPLATES[key as keyof typeof DOCUMENT_TEMPLATES];
    if (template) {
        config.systemPrompt = generateSystemPrompt(template, config.roleDescription);
        config.summaryInstructions = generateSummaryInstructions(template);
    }
}); 