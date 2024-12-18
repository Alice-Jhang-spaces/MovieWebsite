const axios = require('axios');
const OMDB_CONFIG = {
    API_KEY: 'db914358',
    BASE_URL: 'http://www.omdbapi.com'
};

exports.getAllMovies = async (req, res) => {
    try {
        const response = await axios.get(`${OMDB_CONFIG.BASE_URL}/?apikey=${OMDB_CONFIG.API_KEY}&s=movie&type=movie`);
        if (response.data.Response === "True") {
            const movies = response.data.Search.map(movie => ({
                id: movie.imdbID,
                title: movie.Title,
                poster: movie.Poster !== "N/A" ? movie.Poster : null,
                year: movie.Year
            }));
            res.status(200).json({ results: movies });
        } else {
            res.status(200).json({ results: [] });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.searchMovies = async (req, res) => {
    const { query } = req.query;
    try {
        const response = await axios.get(`${OMDB_CONFIG.BASE_URL}/?apikey=${OMDB_CONFIG.API_KEY}&s=${query}&type=movie`);
        if (response.data.Response === "True") {
            const movies = response.data.Search.map(movie => ({
                id: movie.imdbID,
                title: movie.Title,
                poster: movie.Poster !== "N/A" ? movie.Poster : null,
                year: movie.Year
            }));
            res.status(200).json({ results: movies });
        } else {
            res.status(200).json({ results: [] });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMovieById = async (req, res) => {
    try {
        const movieId = req.params.id;
        const response = await axios.get(`${OMDB_CONFIG.BASE_URL}/?apikey=${OMDB_CONFIG.API_KEY}&i=${movieId}&plot=full`);
        
        if (response.data.Response === "True") {
            const movieData = response.data;
            const movie = {
                id: movieData.imdbID,
                title: movieData.Title,
                description: movieData.Plot,
                poster: movieData.Poster !== "N/A" ? movieData.Poster : null,
                rating: movieData.imdbRating,
                duration: movieData.Runtime,
                releaseDate: movieData.Released,
                language: movieData.Language,
                category: movieData.Genre
            };
            res.status(200).json(movie);
        } else {
            res.status(404).json({ message: 'Movie not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRandomMovie = async (req, res) => {
    try {
        // List of some popular movie IMDb IDs
        const popularMovieIds = [
            'tt0111161', 'tt0068646', 'tt0071562', 'tt0468569', 
            'tt0050083', 'tt0108052', 'tt0167260', 'tt0110912'
        ];
        const randomId = popularMovieIds[Math.floor(Math.random() * popularMovieIds.length)];
        
        const response = await axios.get(`${OMDB_CONFIG.BASE_URL}/?apikey=${OMDB_CONFIG.API_KEY}&i=${randomId}`);
        
        if (response.data.Response === "True") {
            const movieData = response.data;
            const movie = {
                id: movieData.imdbID,
                title: movieData.Title,
                description: movieData.Plot,
                poster: movieData.Poster !== "N/A" ? movieData.Poster : null,
                rating: movieData.imdbRating,
                duration: movieData.Runtime,
                releaseDate: movieData.Released,
                language: movieData.Language,
                category: movieData.Genre
            };
            res.status(200).json(movie);
        } else {
            res.status(404).json({ message: 'Movie not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createMovie = async (req, res) => {
    res.status(501).json({ message: 'Create movie functionality not available with OMDB API' });
};