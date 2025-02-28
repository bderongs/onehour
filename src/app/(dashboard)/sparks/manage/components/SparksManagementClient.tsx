'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Spark } from '@/types/spark';
import { deleteSparkAction } from '../actions';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { SparksGrid } from '@/components/SparksGrid';
import { EmptyState } from '@/app/(dashboard)/sparks/manage/components/EmptyState';
import { useNotification } from '@/contexts/NotificationContext';
import logger from '@/utils/logger';

interface SparksManagementClientProps {
    initialSparks: Spark[];
}

export const SparksManagementClient = ({ initialSparks }: SparksManagementClientProps) => {
    const router = useRouter();
    const { showNotification } = useNotification();
    const [sparks, setSparks] = useState<Spark[]>(initialSparks);
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; sparkSlug: string | null }>({
        isOpen: false,
        sparkSlug: null
    });

    const handleCreateSpark = () => {
        router.push('/sparks/ai-create');
    };

    const handleEditSpark = (sparkSlug: string) => {
        router.push(`/sparks/edit/${sparkSlug}`);
    };

    const handleAIEditSpark = (sparkSlug: string) => {
        router.push(`/sparks/ai-edit/${sparkSlug}`);
    };

    const handlePreviewSpark = (sparkSlug: string) => {
        router.push(`/sparks/${sparkSlug}`);
    };

    const handleDeleteSpark = async (sparkSlug: string) => {
        setDeleteConfirm({ isOpen: true, sparkSlug });
    };

    const handleConfirmDelete = async () => {
        if (!deleteConfirm.sparkSlug) return;
        
        try {
            await deleteSparkAction(deleteConfirm.sparkSlug);
            setSparks(sparks.filter(spark => spark.slug !== deleteConfirm.sparkSlug));
            showNotification('success', 'Le Spark a été supprimé avec succès');
        } catch (error) {
            logger.error('Error deleting spark:', error);
            showNotification('error', 'Échec de la suppression du Spark. Veuillez réessayer.');
        } finally {
            setDeleteConfirm({ isOpen: false, sparkSlug: null });
        }
    };

    return (
        <>
            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                title="Supprimer le Spark"
                message="Êtes-vous sûr de vouloir supprimer ce spark ? Cette action est irréversible."
                confirmLabel="Supprimer"
                cancelLabel="Annuler"
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteConfirm({ isOpen: false, sparkSlug: null })}
                variant="danger"
            />

            {sparks.length === 0 ? (
                <EmptyState onCreateSpark={handleCreateSpark} />
            ) : (
                <SparksGrid
                    sparks={sparks}
                    onCreateSpark={handleCreateSpark}
                    onPreviewSpark={handlePreviewSpark}
                    onEditSpark={handleEditSpark}
                    onAIEditSpark={handleAIEditSpark}
                    onDeleteSpark={handleDeleteSpark}
                />
            )}
        </>
    );
}; 