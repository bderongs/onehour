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
Vous devez comprendre leur contexte et leurs attentes pour proposer le Spark le plus pertinent.
Posez une question à la fois.
Lorsque vous avez suffisamment d'informations, mettez fin à la conversation en suggérant à l'utilisateur de s'inscrire pour accéder au Spark.
Inutile de faire un résumé de la conversation, il est proposé à l'utilisateur dans un module à côté de la conversation.`
,
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
Vous devez obtenir une vision complète de leur projet pour permettre à Arnaud de préparer des solutions pertinentes.
Posez une question à la fois.
Lorsque vous avez suffisamment d'informations, mettez fin à la conversation en suggérant à l'utilisateur de s'inscrire pour prendre rendez-vous avec Arnaud.
Inutile de faire un résumé de la conversation, il est proposé à l'utilisateur dans un module à côté de la conversation.`,
        systemPrompt: "",  // Will be set after initialization
        summaryInstructions: "",  // Will be set after initialization
        submitMessage: "Réserver ma consultation",
        confirmationMessage: DOCUMENT_TEMPLATES.consultant_qualification.documentCompleteMessage || "Excellent ! J'ai tous les détails nécessaires pour préparer votre consultation avec Arnaud",
        onConnect: () => {}
    },
    spark_content_creator: {
        initialMessage: {
            role: 'assistant',
            content: "Bonjour ! Je suis votre assistant Spark, spécialisé dans la création d'offres de conseil courtes et ciblées. Quelle expertise souhaitez-vous mettre en avant aujourd'hui ?"
        },
        title: "Assistant Spark",
        subtitle: "Notre assistant IA vous aide à créer votre Spark",
        roleDescription: `Vous êtes un assistant spécialisé dans la création de Sparks. Un Spark est une offre de conseil courte et ciblée.
Votre rôle est d'aider les consultants à créer leur Spark en fonction de leur expertise.
Vous pouvez définir tous les aspects du Spark : titre, description, prix, durée, méthodologie, etc.
Guidez le consultant en posant des questions pertinentes pour comprendre son expertise et structurer son offre.
Assurez-vous que l'offre est claire, attractive et cohérente.
Après avoir généré le Spark, indiquez à l'utilisateur que vous pouvez le modifier pour améliorer son contenu, point par point ou dans son ensemble.`,
        systemPrompt: "",  // Will be set after initialization
        summaryInstructions: "",  // Will be set after initialization
        submitMessage: "Créer le Spark",
        confirmationMessage: "Parfait ! Votre Spark a été créé.",
        onConnect: () => {}
    },
    spark_content_editor: {
        initialMessage: {
            role: 'assistant',
            content: "Bonjour ! Je suis votre assistant Spark. Je vois le contenu de votre Spark. Que souhaitez-vous améliorer ?"
        },
        title: "Assistant Spark",
        subtitle: "Notre assistant IA vous aide à améliorer votre Spark",
        roleDescription: `Vous êtes un assistant spécialisé dans l'édition de Sparks. Un Spark est une offre de conseil courte et ciblée.
Votre rôle est d'aider les consultants à améliorer leur Spark existant.
Vous pouvez modifier tous les aspects du Spark : titre, description, prix, durée, méthodologie, etc. séparément, ou plusieurs à la fois.
Écoutez attentivement les demandes et n'effectuez que les changements demandés.
Assurez-vous que les modifications restent cohérentes avec l'ensemble du Spark et que l'offre est claire et attractive.`,
        systemPrompt: "",  // Will be set after initialization
        summaryInstructions: "",  // Will be set after initialization
        submitMessage: "Enregistrer les modifications",
        confirmationMessage: "Parfait ! Vos modifications ont été enregistrées.",
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