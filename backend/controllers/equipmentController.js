const Equipment = require('../models/Equipment');

const getEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.find({});
        res.json(equipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createEquipment = async (req, res) => {
    try {
        const item = new Equipment(req.body);
        const createdItem = await item.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateEquipment = async (req, res) => {
    try {
        const item = await Equipment.findById(req.params.id);
        if (item) {
            Object.assign(item, req.body);
            const updatedItem = await item.save();
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Equipment not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteEquipment = async (req, res) => {
    try {
        const item = await Equipment.findByIdAndDelete(req.params.id);
        if (item) {
            res.json({ message: 'Equipment removed', data: item });
        } else {
            res.status(404).json({ message: 'Equipment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getEquipment, createEquipment, updateEquipment, deleteEquipment };
