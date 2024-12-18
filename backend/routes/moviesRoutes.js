const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const authMiddleware = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Define routes
router.get('/', movieController.getAllMovies);
router.get('/search', movieController.searchMovies);
router.get('/random', movieController.getRandomMovie);
router.get('/:id', movieController.getMovieById);
router.post('/', movieController.createMovie);

module.exports = router;