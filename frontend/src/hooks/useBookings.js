import { useState, useCallback } from 'react';
import useApi from './useApi';


const useBookings = () => {
    const { get, post } = useApi();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            const data = await get('/bookings');
            setBookings(data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch bookings');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [get]);

    const createBooking = useCallback(async (bookingData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await post('/bookings', bookingData);
            await fetchBookings(); // Refresh bookings list
            return response;
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Booking failed';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [post, fetchBookings]);

    const calculatePrice = useCallback(async (priceData) => {
        try {
            const pricing = await post('/bookings/calculate', priceData);
            return pricing;
        } catch (err) {
            console.error('Price calculation failed:', err);
            throw err;
        }
    }, [post]);

    return {
        bookings,
        loading,
        error,
        fetchBookings,
        createBooking,
        calculatePrice,
        setError
    };
};

export default useBookings;
