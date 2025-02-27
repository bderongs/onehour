// Purpose: Component for managing the list of consultant missions
// This component handles the missions section of the consultant profile edit page

import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { ConsultantProfile, ConsultantMission } from '@/types/consultant';
import { MissionItem } from './MissionItem';

type MissionsListProps = {
    consultant: ConsultantProfile | null;
    formData: Partial<ConsultantProfile> & {
        missions?: ConsultantMission[];
    };
    setFormData: React.Dispatch<React.SetStateAction<Partial<ConsultantProfile> & {
        missions?: ConsultantMission[];
    }>>;
    onRequestDelete: (type: 'mission', index: number) => void;
};

export function MissionsList({
    consultant,
    formData,
    setFormData,
    onRequestDelete
}: MissionsListProps) {
    const [editingMissionIndex, setEditingMissionIndex] = useState<number | null>(null);

    const handleAddMission = () => {
        const newMission = {
            title: '',
            company: '',
            description: '',
            duration: '',
            date: new Date().toISOString().split('T')[0]
        };
        setFormData(prev => ({
            ...prev,
            missions: [...(prev.missions || []), newMission]
        }));
        setEditingMissionIndex((formData.missions?.length || 0));
    };

    const handleUpdateMission = (index: number, updatedMission: ConsultantMission) => {
        setFormData(prev => ({
            ...prev,
            missions: prev.missions?.map((mission, i) => 
                i === index ? updatedMission : mission
            )
        }));
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Missions</h2>
            <p className="text-sm text-gray-500 mb-4">
                Présentez vos missions les plus significatives pour démontrer votre expertise et votre expérience. Privilégiez la qualité à la quantité en mettant en avant les missions les plus pertinentes.
            </p>
            <div className="space-y-4">
                {formData.missions?.map((mission, index) => (
                    <div key={index} className="border rounded-lg p-4">
                        <MissionItem 
                            mission={mission}
                            index={index}
                            isEditing={editingMissionIndex === index}
                            onEdit={() => setEditingMissionIndex(index)}
                            onDelete={() => onRequestDelete('mission', index)}
                            onUpdate={(updatedMission) => handleUpdateMission(index, updatedMission)}
                        />
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleAddMission}
                    className="w-full flex items-center justify-center gap-2 p-4 text-blue-600 hover:text-blue-700 border-2 border-dashed border-gray-200 hover:border-blue-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="Ajouter une nouvelle mission"
                >
                    <Plus className="h-4 w-4" />
                    Ajouter une mission
                </button>
                <p className="mt-2 text-xs text-gray-500 italic text-center">
                    Note: Tous les champs sont obligatoires pour chaque mission.
                </p>
            </div>
        </div>
    );
} 