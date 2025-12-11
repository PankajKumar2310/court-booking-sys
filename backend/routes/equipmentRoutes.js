const express = require('express');
const router = express.Router();
const { getEquipment, createEquipment, updateEquipment, deleteEquipment } = require('../controllers/equipmentController');

router.route('/').get(getEquipment).post(createEquipment);
router.route('/:id').put(updateEquipment).delete(deleteEquipment);

module.exports = router;
