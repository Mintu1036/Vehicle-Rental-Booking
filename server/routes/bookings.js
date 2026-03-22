const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/', bookingController.createBooking);
router.get('/user/:userId', bookingController.getUserBookings);
router.put('/:bookingId/status', bookingController.updateBookingStatus);

module.exports = router;
