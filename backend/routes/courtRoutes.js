const express = require('express');
const router = express.Router();
const { getCourts, createCourt, updateCourt, deleteCourt } = require('../controllers/courtController');

router.route('/').get(getCourts).post(createCourt);
router.route('/:id').put(updateCourt).delete(deleteCourt);

module.exports = router;
