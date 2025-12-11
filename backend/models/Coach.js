const mongoose = require('mongoose');

const CoachSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialties: { type: [String] }, // e.g., "Singles", "Doubles", "Training"
    hourlyRate: { type: Number, required: true },
    description: String,
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Coach', CoachSchema);
