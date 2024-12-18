const express = require('express');
const router = express.Router();
const theaterController = require('../controllers/theaterController');
const authMiddleware = require('../middleware/auth');

// Get theaters showing a specific movie
router.get('/movie/:movieId', authMiddleware, theaterController.getTheatersForMovie);

// Get all theaters
router.get('/', authMiddleware, theaterController.getAllTheaters);

module.exports = router;