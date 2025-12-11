const Coach = require('../models/Coach');

const getCoaches = async (req, res) => {
    try {
        const coaches = await Coach.find({});
        res.json(coaches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createCoach = async (req, res) => {
    try {
        const coach = new Coach(req.body);
        const createdCoach = await coach.save();
        res.status(201).json(createdCoach);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateCoach = async (req, res) => {
    try {
        const coach = await Coach.findById(req.params.id);
        if (coach) {
            Object.assign(coach, req.body);
            const updatedCoach = await coach.save();
            res.json(updatedCoach);
        } else {
            res.status(404).json({ message: 'Coach not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteCoach = async (req, res) => {
    try {
        const coach = await Coach.findByIdAndDelete(req.params.id);
        if (coach) {
            res.json({ message: 'Coach removed', data: coach });
        } else {
            res.status(404).json({ message: 'Coach not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCoaches, createCoach, updateCoach, deleteCoach };
