import React from 'react';
import { CheckCircle, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import type { DocumentTemplate, DocumentSummary as DocumentSummaryType } from '../types/chat';

interface DocumentSummaryProps {
    template: DocumentTemplate;
    summary: DocumentSummaryType;
    onConnect?: () => void;
    hasUserMessage: boolean;
    isLoading?: boolean;
}

export function DocumentSummary({ template, summary, onConnect, hasUserMessage, isLoading }: DocumentSummaryProps) {
    const renderField = (field: DocumentTemplate['fields'][0]) => {
        const value = summary[field.key];
        
        if (!value) return null;
        
        return (
            <div key={field.key} className="py-3 last:border-b-0">
                <h4 className="text-sm font-medium text-gray-700 mb-1">{field.label}</h4>
                <p className="text-sm text-gray-600">
                    {field.type === 'list' 
                        ? (value as string[]).join(', ')
                        : field.type === 'boolean'
                            ? (value ? 'Oui' : 'Non')
                            : value as string
                    }
                </p>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
            </div>
            
            <div className="p-4">
                {isLoading ? (
                    <div className="flex items-center gap-2 text-gray-600">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Mise à jour en cours...</span>
                    </div>
                ) : hasUserMessage ? (
                    <div>
                        <div className="space-y-1 divide-y divide-gray-100 text-left">
                            {template.fields.map(field => renderField(field))}
                        </div>
                        
                        {summary.hasEnoughData ? (
                            <div className="mt-6">
                                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                                    <span className="text-sm font-medium">
                                        {template.documentCompleteMessage || "Document complet !"}
                                    </span>
                                </div>
                                <button
                                    onClick={onConnect}
                                    className="w-full mt-4 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Continuer
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg mt-4">
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                <span className="text-sm">
                                    {template.continueConversationMessage || "Continuez la conversation pour compléter le document"}
                                </span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-3 text-gray-500 py-8 justify-center">
                        <FileText className="h-5 w-5" />
                        <span className="text-sm">
                            {template.placeholderMessage || "Commencez la conversation pour générer le document."}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
} 