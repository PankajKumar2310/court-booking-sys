const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['racket', 'shoe'], required: true },
    totalStock: { type: Number, required: true, min: 0 },
    pricePerHour: { type: Number, default: 0 }
});

module.exports = mongoose.model('Equipment', EquipmentSchema);
