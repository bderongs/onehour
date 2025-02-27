// Purpose: Component for managing the list of consultant reviews
// This component handles the reviews section of the consultant profile edit page

import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { ConsultantProfile, ConsultantReview } from '@/types/consultant';
import { ReviewItem } from './ReviewItem';

type ReviewsListProps = {
    consultant: ConsultantProfile | null;
    formData: Partial<ConsultantProfile> & {
        reviews?: ConsultantReview[];
    };
    setFormData: React.Dispatch<React.SetStateAction<Partial<ConsultantProfile> & {
        reviews?: ConsultantReview[];
    }>>;
    onRequestDelete: (type: 'review', index: number) => void;
};

export function ReviewsList({
    consultant,
    formData,
    setFormData,
    onRequestDelete
}: ReviewsListProps) {
    const [editingReviewIndex, setEditingReviewIndex] = useState<number | null>(null);

    const handleAddReview = () => {
        const newReview = {
            id: `temp-${Date.now()}`,
            consultant_id: consultant?.id || '',
            client_name: '',
            client_role: '',
            client_company: '',
            review_text: '',
            rating: 5,
            created_at: new Date().toISOString()
        };
        setFormData(prev => ({
            ...prev,
            reviews: [...(prev.reviews || []), newReview]
        }));
        setEditingReviewIndex((formData.reviews?.length || 0));
    };

    const handleUpdateReview = (index: number, updatedReview: ConsultantReview) => {
        setFormData(prev => ({
            ...prev,
            reviews: prev.reviews?.map((review, i) => 
                i === index ? updatedReview : review
            )
        }));
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Avis clients</h2>
            <p className="text-sm text-gray-500 mb-4">
                Les avis de vos clients sont essentiels pour établir votre crédibilité. Ajoutez des témoignages pertinents qui mettent en valeur vos compétences et votre impact.
            </p>
            <div className="space-y-4">
                {formData.reviews?.map((review, index) => (
                    <div key={review.id} className="border rounded-lg p-4">
                        <ReviewItem 
                            review={review}
                            index={index}
                            isEditing={editingReviewIndex === index}
                            onEdit={() => setEditingReviewIndex(index)}
                            onDelete={() => onRequestDelete('review', index)}
                            onUpdate={(updatedReview) => handleUpdateReview(index, updatedReview)}
                        />
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleAddReview}
                    className="w-full flex items-center justify-center gap-2 p-4 text-blue-600 hover:text-blue-700 border-2 border-dashed border-gray-200 hover:border-blue-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="Ajouter un nouvel avis client"
                >
                    <Plus className="h-4 w-4" />
                    Ajouter un avis
                </button>
                <p className="mt-2 text-xs text-gray-500 italic text-center">
                    Note: Si vous remplissez un champ, le nom du client et le texte de l'avis deviennent obligatoires pour l'enregistrement. Les avis complètement vides seront ignorés.
                </p>
            </div>
        </div>
    );
} 