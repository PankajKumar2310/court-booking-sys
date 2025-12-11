const express = require('express');
const router = express.Router();
const { getCoaches, createCoach, updateCoach, deleteCoach } = require('../controllers/coachController');

router.route('/').get(getCoaches).post(createCoach);
router.route('/:id').put(updateCoach).delete(deleteCoach);

module.exports = router;
