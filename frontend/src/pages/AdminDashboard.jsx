import { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import useAdminData from '../hooks/useAdminData';
import useDeleteConfirmation from '../hooks/useDeleteConfirmation';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import AdminFormModal from '../components/AdminFormModal';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('bookings');
    const [showForm, setShowForm] = useState(false);
    const [coaches, setCoaches] = useState([]);

    const { get, put } = useApi();
    const { data, loading, fetchData, createItem, deleteItem } = useAdminData(activeTab);
    const {
        deleteTarget,
        deleteError,
        isDeleting,
        openDeleteModal,
        closeDeleteModal,
        confirmDelete
    } = useDeleteConfirmation(async (endpoint) => {
        await deleteItem(deleteTarget.id);
    });

    useEffect(() => {
        fetchData();
        setShowForm(false);
    }, [activeTab, fetchData]);

    useEffect(() => {
        // Fetch coaches for form dropdown
        const fetchCoaches = async () => {
            try {
                const coachesData = await get('/coaches');
                setCoaches(coachesData);
            } catch (err) {
                console.error('Failed to fetch coaches:', err);
            }
        };
        fetchCoaches();
    }, [get]);

    const handleDelete = (item) => {
        let label = 'this item';
        if (activeTab === 'bookings') {
            label = `booking for ${item.court?.name || 'Unknown Court'}`;
        } else {
            label = item.name || item.title || 'this item';
        }

        const endpoint = `/${activeTab === 'rules' ? 'pricing-rules' : activeTab}/${item._id}`;
        openDeleteModal(item, label, endpoint);
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await put(`/bookings/${id}`, { status });
            fetchData();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleSubmit = async (formData) => {
        try {
            // Convert numeric fields and prepare payload
            const payload = { ...formData };

            if (activeTab === 'courts') {
                if (payload.basePrice) payload.basePrice = Number(payload.basePrice);
            } else if (activeTab === 'equipment') {
                if (payload.totalStock) payload.totalStock = Number(payload.totalStock);
                if (payload.pricePerHour) payload.pricePerHour = Number(payload.pricePerHour);
            } else if (activeTab === 'coaches') {
                if (payload.hourlyRate) payload.hourlyRate = Number(payload.hourlyRate);
            } else if (activeTab === 'rules') {
                if (payload.value) payload.value = Number(payload.value);

                // Build conditions object
                const conditions = {};
                if (payload.days) {
                    const parsedDays = payload.days
                        .split(',')
                        .map(d => Number(d.trim()))
                        .filter(n => !Number.isNaN(n));
                    if (parsedDays.length) conditions.days = parsedDays;
                }
                if (payload.startTime) conditions.startTime = payload.startTime;
                if (payload.endTime) conditions.endTime = payload.endTime;
                if (payload.courtType) conditions.courtType = payload.courtType;
                if (Object.keys(conditions).length > 0) {
                    payload.conditions = conditions;
                }
                payload.isActive = payload.isActive !== false;

                // Remove form-only helper fields
                delete payload.days;
                delete payload.startTime;
                delete payload.endTime;
                delete payload.courtType;
            }

            await createItem(payload);
            setShowForm(false);
        } catch (err) {
            alert('Failed to create. Check console for details.');
            console.error(err);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                {activeTab !== 'bookings' && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 cursor-pointer shadow"
                    >
                        + Add New {activeTab}
                    </button>
                )}
            </div>

            <div className="flex space-x-4 mb-6 border-b pb-2 overflow-x-auto">
                {['bookings', 'courts', 'equipment', 'coaches', 'rules'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`capitalize px-4 py-2 font-medium cursor-pointer ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {loading ? <p>Loading...</p> : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {activeTab === 'bookings' ? 'Booking Details' : 'Name'}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.map((item) => (
                                <tr key={item._id}>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {activeTab === 'bookings' ? (
                                            <div>
                                                <div className="font-bold">{item.court?.name || 'Unknown Court'}</div>
                                                <div className="text-xs text-gray-500">
                                                    {new Date(item.startTime).toLocaleDateString()} @ {new Date(item.startTime).getHours()}:00
                                                </div>
                                                <div className="text-xs text-gray-400">User: {item.user?.name}</div>
                                            </div>
                                        ) : item.name}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {activeTab === 'bookings' && (
                                            <div>
                                                <div>Total: ${item.totalPrice}</div>
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${item.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'}`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        )}
                                        {activeTab === 'courts' && `$${item.basePrice}/hr (${item.type})`}
                                        {activeTab === 'equipment' && `Stock: ${item.totalStock}`}
                                        {activeTab === 'coaches' && `$${item.hourlyRate}/hr`}
                                        {activeTab === 'rules' && `${item.type}: ${item.value}`}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {activeTab === 'bookings' ? (
                                            <div className="flex justify-end space-x-2">
                                                {item.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(item._id, 'confirmed')}
                                                            className="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-xs cursor-pointer"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(item._id, 'cancelled')}
                                                            className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-xs cursor-pointer"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(item)}
                                                    className="text-red-600 hover:text-red-900 cursor-pointer"
                                                    title="Delete booking"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleDelete(item)}
                                                className="text-red-600 hover:text-red-900 cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <AdminFormModal
                isOpen={showForm}
                activeTab={activeTab}
                coaches={coaches}
                onSubmit={handleSubmit}
                onClose={() => setShowForm(false)}
            />

            <DeleteConfirmationModal
                isOpen={!!deleteTarget}
                itemLabel={deleteTarget?.label}
                onConfirm={confirmDelete}
                onCancel={closeDeleteModal}
                isDeleting={isDeleting}
                error={deleteError}
            />
        </div>
    );
};

export default AdminDashboard;
