const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/', paymentController.createPayment);
router.get('/booking/:bookingId', paymentController.getPaymentByBooking);

module.exports = router;
