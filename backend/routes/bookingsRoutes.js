const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/auth');

// Get available showtimes for a movie
router.get('/showtimes/:movieId', authMiddleware, bookingController.getShowtimes);

// Create a new booking
router.post('/', authMiddleware, bookingController.createBooking);

// Get booking details
router.get('/:bookingId', authMiddleware, bookingController.getBookingDetails);

// Get user's bookings
router.get('/user/history', authMiddleware, bookingController.getUserBookings);

router.post('/payment/confirm', authMiddleware, bookingController.confirmPayment);

module.exports = router;
