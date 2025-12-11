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
        const endpoint = getEndpoint(activeTab);
        if (!endpoint) throw new Error('Invalid tab');

        const response = await put(`${endpoint}/${id}`, itemData);
        await fetchData(); // Refresh data
        return response;
    }, [activeTab, put, getEndpoint, fetchData]);

    const deleteItem = useCallback(async (id) => {
        const endpoint = getEndpoint(activeTab);
        if (!endpoint) throw new Error('Invalid tab');

        await del(`${endpoint}/${id}`);
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
