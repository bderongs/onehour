import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';

interface ProblemDetails {
    challenge?: string;
    currentSituation?: string;
    desiredOutcome?: string;
    constraints?: string;
    additionalInfo?: string;
    hasSufficientInfo?: boolean;
}

interface ProblemSummaryProps {
    summary: ProblemDetails;
    onConnect: () => void;
}

export function ProblemSummary({ summary, onConnect }: ProblemSummaryProps) {
    const ensureString = (value: any): string => {
        if (typeof value === 'string') return value;
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value || '');
    };

    const handleConnectClick = () => {
        localStorage.setItem('problemSummary', JSON.stringify(summary));
        onConnect();
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 text-left">
            <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Résumé du Problème</h2>
            </div>

            <div className="space-y-4 text-gray-800">
                {summary.challenge && (
                    <div>
                        <h3 className="font-medium text-blue-600">Défi</h3>
                        <p className="mt-1 text-left">{ensureString(summary.challenge)}</p>
                    </div>
                )}

                {summary.currentSituation && (
                    <div>
                        <h3 className="font-medium text-blue-600">Situation Actuelle</h3>
                        <p className="mt-1 text-left">{ensureString(summary.currentSituation)}</p>
                    </div>
                )}

                {summary.desiredOutcome && (
                    <div>
                        <h3 className="font-medium text-blue-600">Résultat Souhaité</h3>
                        <p className="mt-1 text-left">{ensureString(summary.desiredOutcome)}</p>
                    </div>
                )}

                {summary.constraints && (
                    <div>
                        <h3 className="font-medium text-blue-600">Contraintes</h3>
                        <p className="mt-1 text-left">{ensureString(summary.constraints)}</p>
                    </div>
                )}

                {summary.additionalInfo && (
                    <div>
                        <h3 className="font-medium text-blue-600">Informations Supplémentaires</h3>
                        <p className="mt-1 text-left">{ensureString(summary.additionalInfo)}</p>
                    </div>
                )}

                {summary.hasSufficientInfo && (
                    <div className="mt-6 border-t pt-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <p className="text-blue-800 font-medium">
                                Votre problème est bien défini et prêt pour une consultation d'expert.
                            </p>
                        </div>
                        <button
                            onClick={handleConnectClick}
                            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md"
                        >
                            Se connecter avec un consultant
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>
                )}

                {Object.keys(summary).length === 0 && (
                    <p className="text-gray-500 italic text-left">
                        Le résumé sera mis à jour à mesure que vous fournissez plus d'informations...
                    </p>
                )}
            </div>
        </div>
    );
}