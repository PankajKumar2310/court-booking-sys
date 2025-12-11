import { useState, useEffect } from 'react';

const AdminFormModal = ({ isOpen, activeTab, coaches, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({});

    // Initialize form data with default values when modal opens
    useEffect(() => {
        if (isOpen) {
            // Set default values based on activeTab
            const defaults = {};

            if (activeTab === 'courts') {
                defaults.type = 'indoor'; // Default court type
            } else if (activeTab === 'equipment') {
                defaults.type = 'racket'; // Default equipment type
            } else if (activeTab === 'rules') {
                defaults.type = 'multiplier'; // Default rule type
                defaults.isActive = true; // Default active state
            }

            setFormData(defaults);
        }
    }, [isOpen, activeTab]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data being submitted:', formData);

        // Validate that we have data
        if (!formData.name || formData.name.trim() === '') {
            alert('Please fill in the Name field');
            return;
        }

        // Submit the form data
        onSubmit(formData);
        // Don't clear immediately - let the parent handle closing the modal
        // which will trigger handleClose
    };

    const handleClose = () => {
        setFormData({});
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl border border-blue-50 relative">
                <button
                    type="button"
                    onClick={handleClose}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                    aria-label="Close"
                >
                    ✕
                </button>
                <div className="mb-4">
                    <p className="text-xs uppercase tracking-widest text-blue-500 font-semibold">Create</p>
                    <h2 className="text-2xl font-bold capitalize text-slate-800">Add {activeTab}</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium">Name</label>
                        <input
                            className="w-full border p-2 rounded"
                            required
                            value={formData.name || ''}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>


                    {activeTab === 'courts' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium">Type</label>
                                <select
                                    className="w-full border p-2 rounded"
                                    value={formData.type || 'indoor'}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="indoor">Indoor</option>
                                    <option value="outdoor">Outdoor</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Base Price ($/hr)</label>
                                <input
                                    type="number"
                                    className="w-full border p-2 rounded"
                                    value={formData.basePrice || ''}
                                    onChange={e => setFormData({ ...formData, basePrice: e.target.value })}
                                />
                            </div>
                        </>
                    )}


                    {activeTab === 'equipment' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium">Type</label>
                                <select
                                    className="w-full border p-2 rounded"
                                    value={formData.type || 'racket'}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="racket">Racket</option>
                                    <option value="shoe">Shoe</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Total Stock</label>
                                <input
                                    type="number"
                                    className="w-full border p-2 rounded"
                                    value={formData.totalStock || ''}
                                    onChange={e => setFormData({ ...formData, totalStock: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Price Per Hour</label>
                                <input
                                    type="number"
                                    className="w-full border p-2 rounded"
                                    value={formData.pricePerHour || ''}
                                    onChange={e => setFormData({ ...formData, pricePerHour: e.target.value })}
                                />
                            </div>
                        </>
                    )}

                    {/* Coaches specific fields */}
                    {activeTab === 'coaches' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium">Hourly Rate</label>
                                <input
                                    type="number"
                                    className="w-full border p-2 rounded"
                                    value={formData.hourlyRate || ''}
                                    onChange={e => setFormData({ ...formData, hourlyRate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Description</label>
                                <textarea
                                    className="w-full border p-2 rounded"
                                    value={formData.description || ''}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </>
                    )}

                    {/* Pricing Rules specific fields */}
                    {activeTab === 'rules' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium">Type</label>
                                <select
                                    className="w-full border p-2 rounded"
                                    value={formData.type || 'multiplier'}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="multiplier">Multiplier</option>
                                    <option value="fixed_add">Fixed Add</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Value</label>
                                <input
                                    type="number"
                                    className="w-full border p-2 rounded"
                                    value={formData.value || ''}
                                    onChange={e => setFormData({ ...formData, value: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Days (comma separated, 0=Sun)</label>
                                <input
                                    className="w-full border p-2 rounded"
                                    placeholder="0,6 for weekend"
                                    value={formData.days || ''}
                                    onChange={e => setFormData({ ...formData, days: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-medium">Start Time (HH:MM)</label>
                                    <input
                                        className="w-full border p-2 rounded"
                                        placeholder="18:00"
                                        value={formData.startTime || ''}
                                        onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">End Time (HH:MM)</label>
                                    <input
                                        className="w-full border p-2 rounded"
                                        placeholder="21:00"
                                        value={formData.endTime || ''}
                                        onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Court Type</label>
                                <select
                                    className="w-full border p-2 rounded"
                                    value={formData.courtType || ''}
                                    onChange={e => setFormData({ ...formData, courtType: e.target.value })}
                                >
                                    <option value="">Any</option>
                                    <option value="indoor">Indoor</option>
                                    <option value="outdoor">Outdoor</option>
                                </select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive ?? true}
                                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                />
                                <label htmlFor="isActive" className="text-sm font-medium">Active</label>
                            </div>
                        </>
                    )}

                    <div className="flex justify-end space-x-2 mt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminFormModal;
