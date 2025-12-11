
const DeleteConfirmationModal = ({
    isOpen,
    itemLabel,
    onConfirm,
    onCancel,
    isDeleting,
    error
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl border border-red-50 relative">
                <button
                    type="button"
                    onClick={onCancel}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                    aria-label="Close"
                >
                    ✕
                </button>
                <div className="mb-4">
                    <p className="text-xs uppercase tracking-widest text-red-500 font-semibold">Confirm delete</p>
                    <h2 className="text-xl font-bold text-slate-800">Delete {itemLabel}?</h2>
                    <p className="text-sm text-slate-500 mt-1">This action cannot be undone.</p>
                </div>
                {error && (
                    <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
                        {error}
                    </div>
                )}
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer ${isDeleting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
