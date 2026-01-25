'use client';

import { useState } from 'react';
import { GrowthLog, deleteGrowthLog } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

export interface UseGrowthLogActionsReturn {
    selectedLog: GrowthLog | null;
    isActionSheetOpen: boolean;
    isEditOpen: boolean;
    deletingId: string | null;
    handleItemClick: (log: GrowthLog) => void;
    handleEditClick: () => void;
    handleDeleteClick: () => void;
    handleDeleteConfirm: () => Promise<void>;
    closeActionSheet: () => void;
    closeEditDialog: () => void;
    closeDeleteDialog: () => void;
}

/**
 * Custom hook to manage CRUD actions for GrowthLog entries.
 * Handles selection, action sheet, edit dialog, and delete confirmation states.
 */
export function useGrowthLogActions(): UseGrowthLogActionsReturn {
    const router = useRouter();
    const [selectedLog, setSelectedLog] = useState<GrowthLog | null>(null);
    const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleItemClick = (log: GrowthLog) => {
        setSelectedLog(log);
        setIsActionSheetOpen(true);
    };

    const handleEditClick = () => {
        setIsActionSheetOpen(false);
        setIsEditOpen(true);
    };

    const handleDeleteClick = () => {
        setIsActionSheetOpen(false);
        if (selectedLog) {
            setDeletingId(selectedLog.id);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deletingId) return;
        try {
            await deleteGrowthLog(deletingId);
            setDeletingId(null);
            setSelectedLog(null);
            router.refresh();
        } catch (error) {
            console.error('Failed to delete log', error);
            alert('Failed to delete log');
        }
    };

    const closeActionSheet = () => {
        setIsActionSheetOpen(false);
    };

    const closeEditDialog = () => {
        setIsEditOpen(false);
        setSelectedLog(null);
    };

    const closeDeleteDialog = () => {
        setDeletingId(null);
    };

    return {
        selectedLog,
        isActionSheetOpen,
        isEditOpen,
        deletingId,
        handleItemClick,
        handleEditClick,
        handleDeleteClick,
        handleDeleteConfirm,
        closeActionSheet,
        closeEditDialog,
        closeDeleteDialog,
    };
}
