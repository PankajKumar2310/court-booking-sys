
const BookingHistoryTable = ({ bookings }) => {
    if (bookings.length === 0) {
        return <p className="text-gray-500 text-sm">No bookings yet.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead>
                    <tr className="text-left text-gray-500">
                        <th className="py-2 pr-4">Court</th>
                        <th className="py-2 pr-4">Date</th>
                        <th className="py-2 pr-4">Time</th>
                        <th className="py-2 pr-4">Total</th>
                        <th className="py-2 pr-4">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map(b => (
                        <tr key={b._id} className="border-t">
                            <td className="py-2 pr-4 font-medium">{b.court?.name || 'Court'}</td>
                            <td className="py-2 pr-4">{new Date(b.startTime).toLocaleDateString()}</td>
                            <td className="py-2 pr-4">
                                {new Date(b.startTime).getHours()}:00 - {new Date(b.endTime).getHours()}:00
                            </td>
                            <td className="py-2 pr-4">${b.totalPrice?.toFixed(2)}</td>
                            <td className="py-2 pr-4">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${b.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                        b.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'}`}>
                                    {b.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookingHistoryTable;
