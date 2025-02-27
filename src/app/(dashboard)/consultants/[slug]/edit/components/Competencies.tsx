// Purpose: Component for managing consultant competencies
// This component handles the competencies section of the consultant profile edit page

import { useState } from 'react';
import { X } from 'lucide-react';
import type { ConsultantProfile } from '@/types/consultant';

type CompetenciesProps = {
    formData: Partial<ConsultantProfile> & {
        keyCompetenciesInput?: string;
    };
    handleAddCompetency: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    handleRemoveCompetency: (competency: string) => void;
    setFormData?: React.Dispatch<React.SetStateAction<Partial<ConsultantProfile> & {
        keyCompetenciesInput?: string;
    }>>;
    addCompetency?: (competency: string) => boolean | undefined;
};

export function Competencies({
    formData,
    handleAddCompetency,
    handleRemoveCompetency,
    setFormData,
    addCompetency
}: CompetenciesProps) {
    const [newCompetency, setNewCompetency] = useState('');

    const handleAddCompetencyButton = () => {
        if (!newCompetency.trim() || !addCompetency) return;
        
        // Use the centralized addCompetency function from the hook
        if (addCompetency(newCompetency)) {
            setNewCompetency('');
        }
    };

    // Custom handler for key down events in the competency input
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission
            e.stopPropagation(); // Stop event from bubbling up
            
            // Use the centralized addCompetency function from the hook
            if (newCompetency.trim() && addCompetency) {
                if (addCompetency(newCompetency)) {
                    setNewCompetency('');
                }
            }
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Compétences clés</h2>
            <p className="text-sm text-gray-500 mb-4">
                Ajoutez vos principales compétences qui seront affichées sous forme de badges sur votre profil.
            </p>
            <div className="space-y-4">
                <div>
                    <label htmlFor="key_competencies" className="block text-sm font-medium text-gray-700 mb-1">
                        Nouvelle compétence
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            id="key_competencies"
                            value={newCompetency}
                            onChange={(e) => setNewCompetency(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            placeholder="Ex: Stratégie Digitale"
                            aria-describedby="competencies-description"
                        />
                        <button
                            type="button"
                            onClick={handleAddCompetencyButton}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            disabled={!newCompetency.trim()}
                        >
                            Ajouter
                        </button>
                    </div>
                    <p id="competencies-description" className="text-sm text-gray-500 mt-2">
                        Appuyez sur Entrée ou cliquez sur Ajouter pour chaque compétence.
                    </p>
                </div>
                
                {/* Competencies Tags */}
                <div className="flex flex-wrap gap-2 mt-4" role="list" aria-label="Compétences ajoutées">
                    {formData.keyCompetenciesInput?.split(',')
                        .map(competency => competency.trim())
                        .filter(Boolean)
                        .map((competency, index) => (
                            <div
                                key={`competency-${index}-${competency}`}
                                className="group flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                role="listitem"
                            >
                                {competency}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveCompetency(competency)}
                                    className="opacity-70 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                                    title={`Supprimer la compétence ${competency}`}
                                    aria-label={`Supprimer la compétence ${competency}`}
                                >
                                    <X className="h-4 w-4 hover:text-blue-600" />
                                </button>
                            </div>
                        ))}
                    {!formData.keyCompetenciesInput?.trim() && (
                        <p className="text-sm text-gray-500 italic">Aucune compétence ajoutée pour le moment.</p>
                    )}
                </div>
            </div>
        </div>
    );
} 