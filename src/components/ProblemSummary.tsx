import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';

interface ProblemDetails {
    challenge?: string;
    currentSituation?: string;
    desiredOutcome?: string;
    constraints?: string[];
    additionalInfo?: string[];
}

interface ProblemSummaryProps {
    summary: ProblemDetails;
}

export function ProblemSummary({ summary }: ProblemSummaryProps) {
    const ensureString = (value: any): string => {
        if (typeof value === 'string') return value;
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value || '');
    };

    const hasSufficientInfo = summary.challenge && summary.currentSituation && summary.desiredOutcome;

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 text-left">
            <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900">Problem Summary</h2>
            </div>

            <div className="space-y-4 text-gray-800">
                {summary.challenge && (
                    <div>
                        <h3 className="font-medium text-indigo-600">Challenge</h3>
                        <p className="mt-1 text-left">{ensureString(summary.challenge)}</p>
                    </div>
                )}

                {summary.currentSituation && (
                    <div>
                        <h3 className="font-medium text-indigo-600">Current Situation</h3>
                        <p className="mt-1 text-left">{ensureString(summary.currentSituation)}</p>
                    </div>
                )}

                {summary.desiredOutcome && (
                    <div>
                        <h3 className="font-medium text-indigo-600">Desired Outcome</h3>
                        <p className="mt-1 text-left">{ensureString(summary.desiredOutcome)}</p>
                    </div>
                )}

                {Array.isArray(summary.constraints) && summary.constraints.length > 0 && (
                    <div>
                        <h3 className="font-medium text-indigo-600">Constraints</h3>
                        <ul className="mt-1 list-disc list-inside text-left">
                            {summary.constraints.map((constraint, index) => (
                                <li key={index}>{ensureString(constraint)}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {Array.isArray(summary.additionalInfo) && summary.additionalInfo.length > 0 && (
                    <div>
                        <h3 className="font-medium text-indigo-600">Additional Information</h3>
                        <ul className="mt-1 list-disc list-inside text-left">
                            {summary.additionalInfo.map((info, index) => (
                                <li key={index}>{ensureString(info)}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {hasSufficientInfo && (
                    <div className="mt-6 border-t pt-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                            <p className="text-green-800 font-medium">
                                Your problem is well defined and ready for expert consultation
                            </p>
                        </div>
                        <button
                            onClick={() => window.location.href = '/find-consultant'}
                            className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-md"
                        >
                            Connect with a Consultant
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>
                )}

                {Object.keys(summary).length === 0 && (
                    <p className="text-gray-500 italic text-left">
                        The summary will be updated as you provide more information...
                    </p>
                )}
            </div>
        </div>
    );
} 