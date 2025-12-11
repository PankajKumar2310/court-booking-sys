const mongoose = require('mongoose');

const PricingRuleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: String,
    type: {
        type: String,
        enum: ['multiplier', 'fixed_add', 'override'], // multiplier (e.g., 1.5x), fixed_add (e.g., +$20), override (e.g., set to $50)
        required: true
    },
    value: { type: Number, required: true },
    conditions: {
        days: { type: [Number] }, // 0=Sunday, 6=Saturday. If empty, applies to all days.
        startTime: { type: String }, // "HH:MM", 24h format.
        endTime: { type: String },   // "HH:MM", 24h format.
        courtType: { type: String }  // "indoor" | "outdoor"
    },
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('PricingRule', PricingRuleSchema);
