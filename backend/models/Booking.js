const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
   
    user: {
        name: { type: String, required: true },
        email: { type: String, required: true }
    },

    court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },

    resources: {
        rackets: { type: Number, default: 0 },
        shoes: { type: Number, default: 0 },
        coach: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach' }
    },

    totalPrice: { type: Number, required: true },

    pricingBreakdown: {
        basePrice: Number,
        resourceCharges: Number,
        ruleAdjustments: [
            {
                ruleName: String,
                amount: String
            }
        ],
        finalTotal: Number
    },

    status: { type: String, enum: ['confirmed', 'cancelled', 'pending'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
