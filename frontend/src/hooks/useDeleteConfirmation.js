import { useState, useCallback } from 'react';

const useDeleteConfirmation = (onConfirm) => {
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteError, setDeleteError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const openDeleteModal = useCallback((item, label, endpoint) => {
        setDeleteError('');
        setDeleteTarget({
            id: item._id,
            label,
            endpoint
        });
    }, []);

    const closeDeleteModal = useCallback(() => {
        setDeleteTarget(null);
        setDeleteError('');
    }, []);

    const confirmDelete = useCallback(async () => {
        if (!deleteTarget) return;

        try {
            setIsDeleting(true);
            setDeleteError('');
            // Pass the deleteTarget to the callback so it has access to the item
            await onConfirm(deleteTarget);
            setDeleteTarget(null);
        } catch (err) {
            setDeleteError(err.response?.data?.message || 'Failed to delete. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    }, [deleteTarget, onConfirm]);

    return {
        deleteTarget,
        deleteError,
        isDeleting,
        openDeleteModal,
        closeDeleteModal,
        confirmDelete
    };
};

export default useDeleteConfirmation;
