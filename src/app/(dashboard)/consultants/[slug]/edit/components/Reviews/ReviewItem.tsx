// Purpose: Component for displaying and editing a single review
// This component handles the display and editing of a single review

import { Edit2, Star, Trash2 } from 'lucide-react';
import type { ConsultantReview } from '@/types/consultant';

type ReviewItemProps = {
    review: ConsultantReview;
    index: number;
    isEditing: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onUpdate: (updatedReview: ConsultantReview) => void;
};

export function ReviewItem({
    review,
    index,
    isEditing,
    onEdit,
    onDelete,
    onUpdate
}: ReviewItemProps) {
    if (isEditing) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">Avis {index + 1}</h3>
                    <button
                        type="button"
                        onClick={onDelete}
                        className="text-red-500 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                        aria-label={`Supprimer l'avis de ${review.client_name}`}
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor={`client-name-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Nom du client
                        </label>
                        <input
                            type="text"
                            id={`client-name-${index}`}
                            value={review.client_name}
                            onChange={(e) => onUpdate({ ...review, client_name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            aria-describedby={`client-name-desc-${index}`}
                        />
                        <p id={`client-name-desc-${index}`} className="mt-1 text-xs text-gray-500">
                            Nom complet du client ayant laissé l'avis
                        </p>
                    </div>
                    <div>
                        <label htmlFor={`client-role-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Rôle du client
                        </label>
                        <input
                            type="text"
                            id={`client-role-${index}`}
                            value={review.client_role || ''}
                            onChange={(e) => onUpdate({ ...review, client_role: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            aria-describedby={`client-role-desc-${index}`}
                        />
                        <p id={`client-role-desc-${index}`} className="mt-1 text-xs text-gray-500">
                            Poste ou fonction du client (ex: Directeur Marketing)
                        </p>
                    </div>
                    <div>
                        <label htmlFor={`client-company-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Entreprise du client
                        </label>
                        <input
                            type="text"
                            id={`client-company-${index}`}
                            value={review.client_company || ''}
                            onChange={(e) => onUpdate({ ...review, client_company: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            aria-describedby={`client-company-desc-${index}`}
                        />
                        <p id={`client-company-desc-${index}`} className="mt-1 text-xs text-gray-500">
                            Nom de l'entreprise du client
                        </p>
                    </div>
                    <div>
                        <label htmlFor={`rating-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Note (1-5)
                        </label>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={`star-${index}-${star}`}
                                    type="button"
                                    onClick={() => onUpdate({ ...review, rating: star })}
                                    className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1 transition-colors"
                                    aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
                                >
                                    <Star 
                                        className={`h-6 w-6 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                    />
                                </button>
                            ))}
                            <span className="ml-2 text-sm text-gray-500">{review.rating}/5</span>
                        </div>
                        <p id={`rating-desc-${index}`} className="mt-1 text-xs text-gray-500">
                            Cliquez sur les étoiles pour attribuer une note
                        </p>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor={`review-text-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Texte de l'avis
                        </label>
                        <textarea
                            id={`review-text-${index}`}
                            value={review.review_text}
                            onChange={(e) => onUpdate({ ...review, review_text: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            aria-describedby={`review-text-desc-${index}`}
                        />
                        <p id={`review-text-desc-${index}`} className="mt-1 text-xs text-gray-500">
                            Témoignage complet du client (100-300 caractères recommandés)
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
            aria-label={`Modifier l'avis de ${review.client_name}`}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onEdit();
                }
            }}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-medium text-gray-900">{review.client_name}</h3>
                    <p className="text-sm text-gray-500">
                        {review.client_role} {review.client_role && review.client_company && '•'} {review.client_company}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        className="text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        aria-label={`Modifier l'avis de ${review.client_name}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                    >
                        <Edit2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
            <div className="flex items-center gap-1" aria-label={`Note: ${review.rating} sur 5`}>
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        aria-hidden="true"
                    />
                ))}
                <span className="ml-1 text-sm text-gray-500">{review.rating}/5</span>
            </div>
            <p className="text-gray-600 text-sm">{review.review_text}</p>
        </div>
    );
} 