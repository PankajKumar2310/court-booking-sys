const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Court = require('../models/Court');
const Coach = require('../models/Coach');
const Equipment = require('../models/Equipment');
const PricingRule = require('../models/PricingRule');

dotenv.config();   // teesting initial stage 

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/court-booking');
        console.log('MongoDB Connected');

        // Clear existing data
        await Court.deleteMany({});
        await Coach.deleteMany({});
        await Equipment.deleteMany({});
        await PricingRule.deleteMany({});

        // Courts
        const courts = await Court.insertMany([
            { name: 'Court 1 (Indoor)', type: 'indoor', basePrice: 20 },
            { name: 'Court 2 (Indoor)', type: 'indoor', basePrice: 20 },
            { name: 'Court 3 (Outdoor)', type: 'outdoor', basePrice: 15 },
            { name: 'Court 4 (Outdoor)', type: 'outdoor', basePrice: 15 },
        ]);
        console.log('Courts Seeded');

        // Equipment
        await Equipment.insertMany([
            { name: 'Yonex Racket', type: 'racket', totalStock: 10, pricePerHour: 5 },
            { name: 'Nike Court Shoes', type: 'shoe', totalStock: 5, pricePerHour: 5 },
        ]);
        console.log('Equipment Seeded');

        // Coaches
        await Coach.insertMany([
            { name: 'John Doe', specialties: ['Singles'], hourlyRate: 30, description: 'Expert in singles strategy.' },
            { name: 'Jane Smith', specialties: ['Doubles'], hourlyRate: 35, description: 'Former national champion.' },
            { name: 'Mike Johnson', specialties: ['Fitness'], hourlyRate: 25, description: 'Focus on conditioning.' },
        ]);
        console.log('Coaches Seeded');

        // Pricing Rules
        await PricingRule.insertMany([
            {
                name: 'Weekend Surge',
                type: 'multiplier',
                value: 1.2,
                conditions: { days: [0, 6] }
            },
            {
                name: 'Evening Peak',
                type: 'multiplier',
                value: 1.5,
                conditions: { startTime: '18:00', endTime: '21:00' }
            },
            {
                name: 'Indoor Premium',
                type: 'fixed_add',
                value: 10,
                conditions: { courtType: 'indoor' }
            }
        ]);
        console.log('Pricing Rules Seeded');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();

// only when a MongoDB connection is not established;
