const express = require('express');
const bookingsRoutes = require('./bookingsRoutes');
const moviesRoutes = require('./moviesRoutes');
const showTimeRoutes = require('./showTimeRoutes');
const userRoutes = require('./userRoutes');
const theaterRoutes = require('./theaterRoutes');


const router = express.Router();

// Import routes

// Use routes
router.use('/bookings', bookingsRoutes);
router.use('/movies', moviesRoutes);
router.use('/showtimes', showTimeRoutes);
router.use('/users', userRoutes);
router.use('/theaters', theaterRoutes);

module.exports = router;