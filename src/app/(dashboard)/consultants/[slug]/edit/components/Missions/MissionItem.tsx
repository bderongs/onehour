// Purpose: Component for displaying and editing a single mission
// This component handles the display and editing of a single mission

import { Edit2, Trash2 } from 'lucide-react';
import type { ConsultantMission } from '@/types/consultant';

type MissionItemProps = {
    mission: ConsultantMission;
    index: number;
    isEditing: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onUpdate: (updatedMission: ConsultantMission) => void;
};

export function MissionItem({
    mission,
    index,
    isEditing,
    onEdit,
    onDelete,
    onUpdate
}: MissionItemProps) {
    if (isEditing) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">Mission {index + 1}</h3>
                    <button
                        type="button"
                        onClick={onDelete}
                        className="text-red-500 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                        aria-label={`Supprimer la mission ${mission.title || `${index + 1}`}`}
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor={`mission-title-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Titre de la mission
                        </label>
                        <input
                            type="text"
                            id={`mission-title-${index}`}
                            value={mission.title}
                            onChange={(e) => onUpdate({ ...mission, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            aria-describedby={`mission-title-desc-${index}`}
                        />
                        <p id={`mission-title-desc-${index}`} className="mt-1 text-xs text-gray-500">
                            Intitulé de votre mission ou projet
                        </p>
                    </div>
                    <div>
                        <label htmlFor={`mission-company-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Entreprise
                        </label>
                        <input
                            type="text"
                            id={`mission-company-${index}`}
                            value={mission.company}
                            onChange={(e) => onUpdate({ ...mission, company: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            aria-describedby={`mission-company-desc-${index}`}
                        />
                        <p id={`mission-company-desc-${index}`} className="mt-1 text-xs text-gray-500">
                            Nom de l'entreprise cliente
                        </p>
                    </div>
                    <div>
                        <label htmlFor={`mission-duration-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Durée
                        </label>
                        <input
                            type="text"
                            id={`mission-duration-${index}`}
                            value={mission.duration}
                            onChange={(e) => onUpdate({ ...mission, duration: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            placeholder="Ex: 3 mois"
                            aria-describedby={`mission-duration-desc-${index}`}
                        />
                        <p id={`mission-duration-desc-${index}`} className="mt-1 text-xs text-gray-500">
                            Durée de la mission (ex: 3 mois, 1 an)
                        </p>
                    </div>
                    <div>
                        <label htmlFor={`mission-date-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                        </label>
                        <input
                            type="date"
                            id={`mission-date-${index}`}
                            value={mission.date.split('T')[0]}
                            onChange={(e) => onUpdate({ ...mission, date: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            aria-describedby={`mission-date-desc-${index}`}
                        />
                        <p id={`mission-date-desc-${index}`} className="mt-1 text-xs text-gray-500">
                            Date de début de la mission
                        </p>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor={`mission-description-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id={`mission-description-${index}`}
                            value={mission.description}
                            onChange={(e) => onUpdate({ ...mission, description: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            aria-describedby={`mission-description-desc-${index}`}
                        />
                        <p id={`mission-description-desc-${index}`} className="mt-1 text-xs text-gray-500">
                            Description détaillée de la mission et de vos réalisations (100-300 caractères recommandés)
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div 
            className="space-y-4 cursor-pointer hover:bg-gray-50 -m-4 p-4 rounded-lg transition-colors"
            onClick={onEdit}
            tabIndex={0}
            role="button"
            aria-label={`Modifier la mission ${mission.title}`}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onEdit();
                }
            }}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-medium text-gray-900">{mission.title}</h3>
                    <p className="text-sm text-gray-500">
                        {mission.company} {mission.company && mission.duration && '•'} {mission.duration}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        className="text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        aria-label={`Modifier la mission ${mission.title}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                    >
                        <Edit2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
            <p className="text-gray-600 text-sm">{mission.description}</p>
            <p className="text-sm text-gray-500">
                {new Date(mission.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long'
                })}
            </p>
        </div>
    );
} 