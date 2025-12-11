const express = require('express');
const router = express.Router();
const { createBooking, getBookings, calculateBookingPrice, updateBookingStatus, deleteBooking } = require('../controllers/bookingController');


router.post('/calculate', calculateBookingPrice);
router.route('/').get(getBookings).post(createBooking);
router.route('/:id').put(updateBookingStatus).delete(deleteBooking);

module.exports = router;
