const PricingRule = require('../models/PricingRule');

const getRules = async (req, res) => {
    try {
        const rules = await PricingRule.find({});
        res.json(rules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createRule = async (req, res) => {
    try {
        const rule = new PricingRule(req.body);
        const createdRule = await rule.save();
        res.status(201).json(createdRule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateRule = async (req, res) => {
    try {
        const rule = await PricingRule.findById(req.params.id);
        if (rule) {
            Object.assign(rule, req.body);
            const updatedRule = await rule.save();
            res.json(updatedRule);
        } else {
            res.status(404).json({ message: 'Rule not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteRule = async (req, res) => {
    try {
        const rule = await PricingRule.findByIdAndDelete(req.params.id);
        if (rule) {
            res.json({ message: 'Rule removed', data: rule });
        } else {
            res.status(404).json({ message: 'Rule not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getRules, createRule, updateRule, deleteRule };
