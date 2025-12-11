const isTimeOverlap = (start1, end1, start2, end2) => {
    return start1 < end2 && start2 < end1;
};

const calculatePrice = (bookingDetails, rules, courtBasePrice, coachRate, equipmentRates) => {
  
    const start = new Date(bookingDetails.startTime);
    const end = new Date(bookingDetails.endTime);
    const durationHours = (end - start) / (1000 * 60 * 60);

    // 1. Calculate Base Court Price
    let currentCourtRate = courtBasePrice;
    const breakdown = {
        basePrice: courtBasePrice * durationHours,
        resourceCharges: 0,
        ruleAdjustments: [],
        finalTotal: 0
    };

    let multipliers = 1;
    let fixedAdds = 0;

    rules.forEach(rule => {
        // Check conditions
        let applies = true;

        // Day condition
        if (rule.conditions.days && rule.conditions.days.length > 0) {
            if (!rule.conditions.days.includes(bookingDetails.dayOfWeek)) applies = false;
        }

        // time condition (Simple overlap check for the rule window)
        if (applies && rule.conditions.startTime && rule.conditions.endTime) {
            
            const bookingHour = start.getHours();
            const [ruleStartHour] = rule.conditions.startTime.split(':').map(Number);
            const [ruleEndHour] = rule.conditions.endTime.split(':').map(Number);

            // Simple check: Is booking start hour >= rule start and < rule end
            if (!(bookingHour >= ruleStartHour && bookingHour < ruleEndHour)) {
                applies = false;
            }
        }

        // Court Type condition
        if (applies && rule.conditions.courtType) {
            if (rule.conditions.courtType !== bookingDetails.courtType) applies = false;
        }

        if (applies) {
            if (rule.type === 'multiplier') {
                multipliers *= rule.value;
                breakdown.ruleAdjustments.push({ ruleName: rule.name, amount: `x${rule.value}` });
            } else if (rule.type === 'fixed_add') {
                fixedAdds += rule.value;
                breakdown.ruleAdjustments.push({ ruleName: rule.name, amount: `+${rule.value}` });
            }
        }
    });

    // Calculate adjusted court price
    const adjustedCourtPrice = (breakdown.basePrice * multipliers) + fixedAdds;

    // 3. Resource Charges
    // Equipment (Assume price is per hour per item)
    const racketCost = (equipmentRates.rackets || 0) * (bookingDetails.rackets || 0) * durationHours;
    const shoeCost = (equipmentRates.shoes || 0) * (bookingDetails.shoes || 0) * durationHours;

    // Coach
    const coachCost = (coachRate || 0) * durationHours;

    breakdown.resourceCharges = racketCost + shoeCost + coachCost;

    breakdown.finalTotal = adjustedCourtPrice + breakdown.resourceCharges;

    return breakdown;
};

module.exports = { calculatePrice };
