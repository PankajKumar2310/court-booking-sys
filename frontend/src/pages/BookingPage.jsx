import { useState, useEffect } from 'react';
import { format, addHours } from 'date-fns';
import { Activity } from 'lucide-react';
import useApi from '../hooks/useApi';
import useBookings from '../hooks/useBookings';
import BookingHistoryTable from '../components/BookingHistoryTable';
import PriceBreakdown from '../components/PriceBreakdown';

const BookingPage = () => {
    const [courts, setCourts] = useState([]);
    const [coaches, setCoaches] = useState([]);
    const { get } = useApi();
    const { bookings, loading: bookingsLoading, error: bookingsError, fetchBookings, createBooking, calculatePrice, setError } = useBookings();

    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [selectedCourt, setSelectedCourt] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const [resources, setResources] = useState({
        rackets: 0,
        shoes: 0,
        coach: ''
    });

    const [priceEstimate, setPriceEstimate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [courtsRes, coachesRes] = await Promise.all([
                get('/courts'),
                get('/coaches')
            ]);
            setCourts(courtsRes);
            setCoaches(coachesRes);
            await fetchBookings();
        } catch (err) {
            console.error(err);
            setError('Failed to load data');
        }
    };

    const generateSlots = () => {
        const slots = [];
        for (let i = 6; i < 22; i++) {
            slots.push({
                start: i,
                end: i + 1,
                label: `${i}:00 - ${i + 1}:00`
            });
        }
        return slots;
    };

    const isSlotBooked = (courtId, startHour) => {
        const slotStart = new Date(`${selectedDate}T${String(startHour).padStart(2, '0')}:00:00`);
        const slotEnd = addHours(slotStart, 1);

        return bookings.some(b => {
            if (b.court._id !== courtId && b.court !== courtId) return false;
            const bStart = new Date(b.startTime);
            const bEnd = new Date(b.endTime);
            return (slotStart < bEnd && bStart < slotEnd);
        });
    };

    const handleSlotClick = (court, startHour) => {
        if (isSlotBooked(court._id, startHour)) return;

        setSelectedCourt(court);
        setSelectedSlot({
            start: `${selectedDate}T${String(startHour).padStart(2, '0')}:00:00`,
            end: `${selectedDate}T${String(startHour + 1).padStart(2, '0')}:00:00`,
            label: `${startHour}:00 - ${startHour + 1}:00`
        });
        setPriceEstimate(null);
    };

    useEffect(() => {
        if (selectedCourt && selectedSlot) {
            handleCalculatePrice();
        }
    }, [selectedCourt, selectedSlot, resources]);

    const handleCalculatePrice = async () => {
        try {
            const payload = {
                courtId: selectedCourt._id,
                startTime: selectedSlot.start,
                endTime: selectedSlot.end,
                resources: {
                    rackets: parseInt(resources.rackets),
                    shoes: parseInt(resources.shoes),
                    coach: resources.coach || null
                }
            };
            const pricing = await calculatePrice(payload);
            setPriceEstimate(pricing);
        } catch (err) {
            console.error(err);
        }
    };

    const handleBooking = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const payload = {
                user: { name: "Demo User", email: "demo@example.com" },
                courtId: selectedCourt._id,
                startTime: selectedSlot.start,
                endTime: selectedSlot.end,
                resources: {
                    rackets: parseInt(resources.rackets),
                    shoes: parseInt(resources.shoes),
                    coach: resources.coach || null
                }
            };
            const response = await createBooking(payload);
            setSuccess(`Booking submitted! Status: ${response.status}. Awaiting admin approval.`);
            setSelectedSlot(null);
            setSelectedCourt(null);
            setResources({ rackets: 0, shoes: 0, coach: '' });
        } catch (err) {
            
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="border p-2 rounded w-full"
                        />
                    </div>

                    <div className="space-y-4">
                        {courts.map(court => (
                            <div key={court._id} className="bg-white p-6 rounded-lg shadow">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold">{court.name} <span className="text-sm font-normal text-gray-500">({court.type})</span></h3>
                                    <span className="text-green-600 font-bold">${court.basePrice}/hr</span>
                                </div>

                                <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                    {generateSlots().map(slot => {
                                        const booked = isSlotBooked(court._id, slot.start);
                                        const isSelected = selectedCourt?._id === court._id && selectedSlot?.label === slot.label;

                                        return (
                                            <button
                                                key={slot.start}
                                                disabled={booked}
                                                onClick={() => handleSlotClick(court, slot.start)}
                                                className={`
                                        p-2 text-xs rounded border transition-colors
                                        ${booked ? 'bg-red-100 text-red-400 cursor-not-allowed border-red-200' :
                                                        isSelected ? 'bg-blue-600 text-white border-blue-600' :
                                                            'bg-gray-50 hover:bg-blue-50 border-gray-200'}
                                    `}
                                            >
                                                {slot.start}:00
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

              
                <div className="space-y-6">
                    {selectedCourt && selectedSlot ? (
                        <div className="bg-white p-6 rounded-lg shadow border-2 border-blue-100 stick top-4">
                            <h3 className="text-xl font-bold mb-4">Confirm Booking</h3>
                            <div className="mb-4 text-sm text-gray-600">
                                <p><strong>Court:</strong> {selectedCourt.name}</p>
                                <p><strong>Time:</strong> {selectedSlot.label}</p>
                                <p><strong>Date:</strong> {selectedDate}</p>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Rackets ($5/hr)</label>
                                    <input
                                        type="number" min="0"
                                        className="w-full border p-2 rounded"
                                        value={resources.rackets}
                                        onChange={(e) => setResources({ ...resources, rackets: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Shoes ($5/hr)</label>
                                    <input
                                        type="number" min="0"
                                        className="w-full border p-2 rounded"
                                        value={resources.shoes}
                                        onChange={(e) => setResources({ ...resources, shoes: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Coach</label>
                                    <select
                                        className="w-full border p-2 rounded"
                                        value={resources.coach}
                                        onChange={(e) => setResources({ ...resources, coach: e.target.value })}
                                    >
                                        <option value="">No Coach</option>
                                        {coaches.map(c => (
                                            <option key={c._id} value={c._id}>{c.name} (${c.hourlyRate}/hr)</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <PriceBreakdown priceEstimate={priceEstimate} />

                            {bookingsError && <div className="text-red-500 text-sm mb-4">{bookingsError}</div>}
                            {success && <div className="text-green-500 text-sm mb-4">{success}</div>}

                            <button
                                onClick={handleBooking}
                                disabled={loading || bookingsLoading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {loading || bookingsLoading ? 'Booking...' : 'Confirm Booking'}
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                            <p>Select a slot to start booking</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Booking history */}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center space-x-2 mb-4">
                    <Activity className="text-blue-600" size={18} />
                    <h3 className="text-lg font-bold">Recent Bookings</h3>
                </div>
                <BookingHistoryTable bookings={bookings} />
            </div>
        </div>
    );
};

export default BookingPage;
