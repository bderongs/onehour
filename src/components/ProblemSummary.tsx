import React from 'react';
import { CheckCircle, AlertCircle, MessageSquare, RefreshCw } from 'lucide-react';

interface ProblemSummaryProps {
    summary: {
        challenge?: string;
        currentSituation?: string;
        desiredOutcome?: string;
        constraints?: string;
        stakeholders?: string;
        previousAttempts?: string;
        readyForAssessment?: boolean;
    };
    onConnect: () => void;
    hasUserMessage: boolean;
    isLoading?: boolean;
}

export function ProblemSummary({ summary, onConnect, hasUserMessage, isLoading = false }: ProblemSummaryProps) {
    const sections = [
        { key: 'challenge', label: 'Challenge', value: summary.challenge },
        { key: 'currentSituation', label: 'Situation actuelle', value: summary.currentSituation },
        { key: 'desiredOutcome', label: 'Objectifs', value: summary.desiredOutcome },
        { key: 'constraints', label: 'Contraintes', value: summary.constraints },
        { key: 'stakeholders', label: 'Parties prenantes', value: summary.stakeholders },
        { key: 'previousAttempts', label: 'Solutions tentées', value: summary.previousAttempts },
    ];

    const filledSections = sections.filter(section => section.value);

    if (!hasUserMessage) {
        return (
            <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex flex-col items-center justify-center text-center py-6">
                    <MessageSquare className="h-8 w-8 text-gray-400 mb-3" />
                    <p className="text-gray-500 text-sm">
                        Expliquez votre projet à l'assistant pour voir apparaître un résumé de votre besoin ici.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Résumé de votre besoin</h3>
                {isLoading && (
                    <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
                )}
            </div>
            
            {filledSections.length === 0 ? (
                <p className="text-gray-500 text-sm">
                    Le résumé de votre besoin apparaîtra ici au fur et à mesure de notre conversation.
                </p>
            ) : (
                <div className={`space-y-4 transition-opacity duration-200 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                    {filledSections.map(section => (
                        <div key={section.key}>
                            <h4 className="text-sm font-medium text-gray-700">{section.label}</h4>
                            <p className="text-sm text-gray-600 mt-1">{section.value}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-6">
                {summary.readyForAssessment ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                            <CheckCircle className="h-4 w-4 flex-shrink-0" />
                            <span className="text-sm">Votre brief est complet ! Vous pouvez prendre rendez-vous ou continuer à ajouter des détails.</span>
                        </div>
                        <button
                            onClick={onConnect}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                            disabled={isLoading}
                        >
                            Planifier un rendez-vous
                        </button>
                    </div>
                ) : filledSections.length > 0 && (
                    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                        <AlertCircle className="h-5 w-5" />
                        <span className="text-sm">
                            Continuez la discussion pour compléter votre brief
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}