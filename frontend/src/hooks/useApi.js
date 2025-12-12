import { useState, useCallback } from 'react';
import api from '../services/api';

const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (method, url, data = undefined, config = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.request({ method, url, data, ...config });
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Request failed');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const get = useCallback((url, config) => request('get', url, null, config), [request]);
    const post = useCallback((url, data, config) => request('post', url, data, config), [request]);
    const put = useCallback((url, data, config) => request('put', url, data, config), [request]);
    const del = useCallback((url, config) => request('delete', url, undefined, config), [request]);

    return {
        loading,
        error,
        setError,
        get,
        post,
        put,
        del,
    };
};

export default useApi;

