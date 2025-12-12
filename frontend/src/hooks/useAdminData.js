import { useState, useCallback } from 'react';
import useApi from './useApi';


const useAdminData = (activeTab) => {
    const { get, post, put, del } = useApi();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const getEndpoint = useCallback((tab) => {
        const endpoints = {
            bookings: '/bookings',
            courts: '/courts',
            equipment: '/equipment',
            coaches: '/coaches',
            rules: '/pricing-rules'
        };
        return endpoints[tab] || '';
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const endpoint = getEndpoint(activeTab);
            if (endpoint) {
                const res = await get(endpoint);
                setData(res);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [activeTab, get, getEndpoint]);

    const createItem = useCallback(async (itemData) => {
        const endpoint = getEndpoint(activeTab);
        if (!endpoint) throw new Error('Invalid tab');

        const response = await post(endpoint, itemData);
        await fetchData(); // Refresh data
        return response;
    }, [activeTab, post, getEndpoint, fetchData]);

    const updateItem = useCallback(async (id, itemData) => {
        try {
            const endpoint = getEndpoint(activeTab);
            if (!endpoint) throw new Error('Invalid tab');

            console.log(`Updating item ${id} at ${endpoint}`, itemData);
            const response = await put(`${endpoint}/${id}`, itemData);
            console.log('Update success, refreshing data...');
            await fetchData(); // Refresh data
            return response;
        } catch (err) {
            console.error('Error in updateItem:', err);
            throw err;
        }
    }, [activeTab, put, getEndpoint, fetchData]);

    const deleteItem = useCallback(async (id, endpointOverride = null) => {
        const endpoint = endpointOverride || getEndpoint(activeTab);
        console.log('deleteItem called with id:', id, 'activeTab:', activeTab, 'endpoint:', endpoint);
        if (!endpoint) throw new Error('Invalid tab');

        const deleteUrl = `${endpoint}/${id}`; // Ensure no double slashes or missing slashes if endpoint already has them
        // Ideally getEndpoint returns string starting with /, so this is fine.
        // If endpointOverride is full path, we might need adjustment, but looking at AdminDashboard it sends relative path.

        console.log('Calling DELETE:', deleteUrl);
        await del(deleteUrl);
        console.log('Delete API call successful, refreshing data...');
        await fetchData(); // Refresh data
    }, [activeTab, del, getEndpoint, fetchData]);

    return {
        data,
        loading,
        fetchData,
        createItem,
        updateItem,
        deleteItem
    };
};

export default useAdminData;
