/**
 * PriceBreakdown Component
 * Displays booking price breakdown with itemized costs
 */
const PriceBreakdown = ({ priceEstimate }) => {
    if (!priceEstimate) return null;

    return (
        <div className="bg-gray-50 p-4 rounded mb-6 text-sm">
            <div className="flex justify-between mb-1">
                <span>Base Price:</span>
                <span>${priceEstimate.basePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1">
                <span>Resources:</span>
                <span>${priceEstimate.resourceCharges.toFixed(2)}</span>
            </div>
            {priceEstimate.ruleAdjustments.map((r, i) => (
                <div key={i} className="flex justify-between text-blue-600 mb-1">
                    <span>{r.ruleName}:</span>
                    <span>{r.amount}</span>
                </div>
            ))}
            <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${priceEstimate.finalTotal.toFixed(2)}</span>
            </div>
        </div>
    );
};

export default PriceBreakdown;
