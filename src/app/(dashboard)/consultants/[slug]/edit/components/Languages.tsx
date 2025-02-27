// Purpose: Component for managing consultant languages
// This component handles the languages section of the consultant profile edit page

import { useState } from 'react';
import { X } from 'lucide-react';
import type { ConsultantProfile } from '@/types/consultant';

type LanguagesProps = {
    formData: Partial<ConsultantProfile> & {
        languagesInput?: string;
    };
    handleAddLanguage: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    handleRemoveLanguage: (language: string) => void;
    setFormData?: React.Dispatch<React.SetStateAction<Partial<ConsultantProfile> & {
        languagesInput?: string;
    }>>;
    addLanguage?: (language: string) => boolean | undefined;
};

export function Languages({
    formData,
    handleAddLanguage,
    handleRemoveLanguage,
    setFormData,
    addLanguage
}: LanguagesProps) {
    const [newLanguage, setNewLanguage] = useState('');

    const handleAddLanguageButton = () => {
        if (!newLanguage.trim() || !addLanguage) return;
        
        // Use the centralized addLanguage function from the hook
        if (addLanguage(newLanguage)) {
            setNewLanguage('');
        }
    };

    // Custom handler for key down events in the language input
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission
            e.stopPropagation(); // Stop event from bubbling up
            
            // Use the centralized addLanguage function from the hook
            if (newLanguage.trim() && addLanguage) {
                if (addLanguage(newLanguage)) {
                    setNewLanguage('');
                }
            }
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Langues</h2>
            <p className="text-sm text-gray-500 mb-4">
                Ajoutez les langues que vous maîtrisez qui seront affichées sur votre profil.
            </p>
            <div className="space-y-4">
                <div>
                    <label htmlFor="languages" className="block text-sm font-medium text-gray-700 mb-1">
                        Nouvelle langue
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            id="languages"
                            value={newLanguage}
                            onChange={(e) => setNewLanguage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            placeholder="Ex: Français"
                            aria-describedby="languages-description"
                        />
                        <button
                            type="button"
                            onClick={handleAddLanguageButton}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            disabled={!newLanguage.trim()}
                        >
                            Ajouter
                        </button>
                    </div>
                    <p id="languages-description" className="text-sm text-gray-500 mt-2">
                        Appuyez sur Entrée ou cliquez sur Ajouter pour chaque langue.
                    </p>
                </div>
                
                {/* Languages Tags */}
                <div className="flex flex-wrap gap-2 mt-4" role="list" aria-label="Langues ajoutées">
                    {formData.languagesInput?.split(',')
                        .map(language => language.trim())
                        .filter(Boolean)
                        .map((language, index) => (
                            <div
                                key={`language-${index}-${language}`}
                                className="group flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                role="listitem"
                            >
                                {language}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveLanguage(language)}
                                    className="opacity-70 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                                    title={`Supprimer la langue ${language}`}
                                    aria-label={`Supprimer la langue ${language}`}
                                >
                                    <X className="h-4 w-4 hover:text-blue-600" />
                                </button>
                            </div>
                        ))}
                    {!formData.languagesInput?.trim() && (
                        <p className="text-sm text-gray-500 italic">Aucune langue ajoutée pour le moment.</p>
                    )}
                </div>
            </div>
        </div>
    );
} 