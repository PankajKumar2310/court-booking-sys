const Court = require('../models/Court');


const getCourts = async (req, res) => {
    try {
        const courts = await Court.find({});
        res.json(courts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createCourt = async (req, res) => {
    try {
        const { name, type, basePrice } = req.body;
        const court = new Court({ name, type, basePrice });
        const createdCourt = await court.save();
        res.status(201).json(createdCourt);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const updateCourt = async (req, res) => {
    try {
        const court = await Court.findById(req.params.id);
        if (court) {
            court.name = req.body.name || court.name;
            court.type = req.body.type || court.type;
            court.basePrice = req.body.basePrice || court.basePrice;
            if (req.body.isActive !== undefined) court.isActive = req.body.isActive;

            const updatedCourt = await court.save();
            res.json(updatedCourt);
        } else {
            res.status(404).json({ message: 'Court not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const deleteCourt = async (req, res) => {
    try {
        const court = await Court.findByIdAndDelete(req.params.id);
        if (court) {
            res.json({ message: 'Court removed', data: court });
        } else {
            res.status(404).json({ message: 'Court not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCourts, createCourt, updateCourt, deleteCourt };
