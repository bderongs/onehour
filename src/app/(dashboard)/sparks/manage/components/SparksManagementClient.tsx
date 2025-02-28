/**
 * SparksManagementClient.tsx
 * Client component for managing sparks with automatic data refresh when the page is focused
 * to ensure newly created sparks are visible after navigation.
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Spark } from '@/types/spark';
import { deleteSparkAction, refreshSparksAction } from '../actions';
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
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Refresh sparks data when the page is focused or loaded
    useEffect(() => {
        const refreshData = async () => {
            try {
                setIsRefreshing(true);
                const refreshedSparks = await refreshSparksAction();
                setSparks(refreshedSparks);
            } catch (error) {
                logger.error('Error refreshing sparks:', error);
            } finally {
                setIsRefreshing(false);
            }
        };

        // Refresh on initial load
        refreshData();

        // Refresh when the page regains focus (user navigates back)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                refreshData();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

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

            {isRefreshing && sparks.length === 0 ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : sparks.length === 0 ? (
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