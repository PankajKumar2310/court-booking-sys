const Booking = require('../models/Booking');
const Court = require('../models/Court');
const Coach = require('../models/Coach');
const Equipment = require('../models/Equipment');
const PricingRule = require('../models/PricingRule');
const { calculatePrice } = require('../utils/priceCalculator');

// Helper to check overlap
const isOverlap = (startA, endA, startB, endB) => {
    return (startA < endB && startB < endA);
};

const createBooking = async (req, res) => {
    try {
        const { user, courtId, startTime, endTime, resources } = req.body;

        const start = new Date(startTime);
        const end = new Date(endTime);

        // 1. Validate Times
        if (start >= end) {
            return res.status(400).json({ message: 'Invalid time range' });
        }

        // 2. Fetch Resources to validate existence and get rates
        const court = await Court.findById(courtId);
        if (!court) return res.status(404).json({ message: 'Court not found' });

        let coach = null;
        if (resources.coach) {
            coach = await Coach.findById(resources.coach);
            if (!coach) return res.status(404).json({ message: 'Coach not found' });
        }

        
        const courtBookings = await Booking.find({
            court: courtId,
            status: 'confirmed',
            $or: [
                { startTime: { $lt: end, $gte: start } },
                { endTime: { $gt: start, $lte: end } },
                { startTime: { $lte: start }, endTime: { $gte: end } } // Covers wrapping 
            ]
        });

        if (courtBookings.length > 0) {
            return res.status(409).json({ message: 'Court is already booked for this slot' });
        }

        // 3b. Coach Availability
        if (resources.coach) {
            const coachBookings = await Booking.find({
                'resources.coach': resources.coach,
                status: 'confirmed',
                $or: [
                    { startTime: { $lt: end, $gte: start } },
                    { endTime: { $gt: start, $lte: end } },
                    { startTime: { $lte: start }, endTime: { $gte: end } }
                ]
            });
            if (coachBookings.length > 0) {
                return res.status(409).json({ message: 'Coach is unavailable for this slot' });
            }
        }

        
        const allOverlappingBookings = await Booking.find({
            status: 'confirmed',
            $or: [
                { startTime: { $lt: end, $gte: start } },
                { endTime: { $gt: start, $lte: end } },
                { startTime: { $lte: start }, endTime: { $gte: end } }
            ]
        });

        // Check Rackets
        if (resources.rackets > 0) {
            const racketStock = await Equipment.findOne({ type: 'racket' });
            if (racketStock) {
                const usedRackets = allOverlappingBookings.reduce((sum, b) => sum + (b.resources.rackets || 0), 0);
                if (usedRackets + resources.rackets > racketStock.totalStock) {
                    return res.status(409).json({ message: `Not enough rackets available. Available: ${racketStock.totalStock - usedRackets}` });
                }
            }
        }

        // Check Shoes
        if (resources.shoes > 0) {
            const shoeStock = await Equipment.findOne({ type: 'shoe' });
            if (shoeStock) {
                const usedShoes = allOverlappingBookings.reduce((sum, b) => sum + (b.resources.shoes || 0), 0);
                if (usedShoes + resources.shoes > shoeStock.totalStock) {
                    return res.status(409).json({ message: `Not enough shoes available. Available: ${shoeStock.totalStock - usedShoes}` });
                }
            }
        }

        // 4. Calculate Price
        const rules = await PricingRule.find({ isActive: true });

        // Fetch equipment rates
        const racketItem = await Equipment.findOne({ type: 'racket' });
        const shoeItem = await Equipment.findOne({ type: 'shoe' });
        const equipmentRates = {
            rackets: racketItem ? racketItem.pricePerHour : 0,
            shoes: shoeItem ? shoeItem.pricePerHour : 0
        };

        const bookingDetails = {
            startTime: start,
            endTime: end,
            courtType: court.type,
            dayOfWeek: start.getDay(),
            rackets: resources.rackets,
            shoes: resources.shoes
        };

        const pricing = calculatePrice(
            bookingDetails,
            rules,
            court.basePrice,
            coach ? coach.hourlyRate : 0,
            equipmentRates
        );

        // 5. Create Booking
        const newBooking = new Booking({
            user,
            court: courtId,
            startTime: start,
            endTime: end,
            resources: {
                rackets: resources.rackets,
                shoes: resources.shoes,
                coach: resources.coach
            },
            totalPrice: pricing.finalTotal,
            pricingBreakdown: pricing,
            status: 'pending' // Set as pending - requires admin approval
        });

        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('court').populate('resources.coach');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const calculateBookingPrice = async (req, res) => {
    try {
        const { courtId, startTime, endTime, resources } = req.body;

        const court = await Court.findById(courtId);
        if (!court) return res.status(404).json({ message: 'Court not found' });

        let coach = null;
        if (resources.coach) {
            coach = await Coach.findById(resources.coach);
        }

        const rules = await PricingRule.find({ isActive: true });

        const racketItem = await Equipment.findOne({ type: 'racket' });
        const shoeItem = await Equipment.findOne({ type: 'shoe' });
        const equipmentRates = {
            rackets: racketItem ? racketItem.pricePerHour : 0,
            shoes: shoeItem ? shoeItem.pricePerHour : 0
        };

        const start = new Date(startTime);
        const end = new Date(endTime);

        const bookingDetails = {
            startTime: start,
            endTime: end,
            courtType: court.type,
            dayOfWeek: start.getDay(),
            rackets: resources.rackets,
            shoes: resources.shoes
        };

        const pricing = calculatePrice(
            bookingDetails,
            rules,
            court.basePrice,
            coach ? coach.hourlyRate : 0,
            equipmentRates
        );

        res.json(pricing);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'confirmed' or 'cancelled'
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.status = status;
        const updatedBooking = await booking.save();
        res.json(updatedBooking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (booking) {
            res.json({ message: 'Booking removed', data: booking });
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createBooking, getBookings, calculateBookingPrice, updateBookingStatus, deleteBooking };
