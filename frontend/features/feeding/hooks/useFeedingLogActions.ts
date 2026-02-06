import { useState } from 'react';
import { FeedingLog } from '@/lib/types';
import { feedingService } from '@/lib/services/feeding/feeding.service.client';
import { useRouter } from 'next/navigation';

export function useFeedingLogActions() {
    const router = useRouter();
    const [selectedLog, setSelectedLog] = useState<FeedingLog | null>(null);
    const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleItemClick = (log: FeedingLog) => {
        setSelectedLog(log);
        setIsActionSheetOpen(true);
    };

    const handleEditClick = (log: FeedingLog) => {
        setSelectedLog(log); // Ensure correct log is selected
        setIsActionSheetOpen(false); // Close sheet
        setIsEditOpen(true); // Open dialog
    };

    const handleDeleteClick = (log: FeedingLog) => {
        setDeletingId(log.id);
        setIsActionSheetOpen(false);
    };

    const handleDeleteConfirm = async () => {
        if (deletingId) {
            try {
                await feedingService.delete(deletingId);
                router.refresh();
                setDeletingId(null);
                setSelectedLog(null);
            } catch (error) {
                console.error("Failed to delete log", error);
                alert("Failed to delete record.");
            }
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
