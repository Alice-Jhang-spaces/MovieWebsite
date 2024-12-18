const axios = require('axios');
const TMDB_CONFIG = require('../config/tmdb');

const tmdbAxios = axios.create({
    baseURL: TMDB_CONFIG.BASE_URL,
    headers: {
        Authorization: `Bearer ${TMDB_CONFIG.ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
    }
});


const getMovies = async (page = 1) => {
    try {
        const response = await tmdbAxios.get('/discover/movie', {
            params: {
                page,
                sort_by: 'popularity.desc',
                'primary_release_date.gte': '2020-01-01',
                'primary_release_date.lte': '2024-12-31'
            }
        });
        
        return response.data.results.map(movie => ({
            id: movie.id,
            title: movie.title,
            poster: movie.poster_path 
                ? `${TMDB_CONFIG.IMAGE_BASE_URL}${movie.poster_path}`
                : null,
            rating: movie.vote_average,
            releaseDate: movie.release_date
        }));
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
};


const searchMovies = async (query) => {
    try {
        const response = await tmdbAxios.get('/search/movie', {
            params: {
                query,
                include_adult: false,
                language: 'en-US',
                'primary_release_date.gte': '2020-01-01',
                'primary_release_date.lte': '2024-12-31'
            }
        });
        
        return response.data.results.map(movie => ({
            id: movie.id,
            title: movie.title,
            poster: movie.poster_path 
                ? `${TMDB_CONFIG.IMAGE_BASE_URL}${movie.poster_path}`
                : null,
            rating: movie.vote_average,
            releaseDate: movie.release_date
        }));
    } catch (error) {
        console.error('Error searching movies:', error);
        return [];
    }
};


const getRankedMovies = async () => {
    try {
        const response = await tmdbAxios.get('/discover/movie', {
            params: {
                sort_by: 'vote_average.desc',
                'vote_count.gte': 1000, 
                'primary_release_date.gte': '2020-01-01',
                'primary_release_date.lte': '2024-12-31'
            }
        });
        
        return response.data.results.map(movie => ({
            id: movie.id,
            title: movie.title,
            poster: movie.poster_path 
                ? `${TMDB_CONFIG.IMAGE_BASE_URL}${movie.poster_path}`
                : null,
            rating: movie.vote_average,
            releaseDate: movie.release_date
        }));
    } catch (error) {
        console.error('Error fetching ranked movies:', error);
        return [];
    }
};


const getMoviesByDuration = async () => {
    try {
        const response = await tmdbAxios.get('/discover/movie', {
            params: {
                sort_by: 'runtime.desc',
                'primary_release_date.gte': '2020-01-01',
                'primary_release_date.lte': '2024-12-31',
                'with_runtime.gte': 0
            }
        });
        
        return response.data.results.map(movie => ({
            id: movie.id,
            title: movie.title,
            poster: movie.poster_path 
                ? `${TMDB_CONFIG.IMAGE_BASE_URL}${movie.poster_path}`
                : null,
            rating: movie.vote_average,
            releaseDate: movie.release_date
        }));
    } catch (error) {
        console.error('Error fetching movies by duration:', error);
        return [];
    }
};


const getMovieDetails = async (movieId) => {
    try {
        const response = await tmdbAxios.get(`/movie/${movieId}`);
        return {
            id: response.data.id,
            title: response.data.title,
            description: response.data.overview,
            poster: response.data.poster_path 
                ? `${TMDB_CONFIG.IMAGE_BASE_URL}${response.data.poster_path}`
                : null,
            rating: response.data.vote_average,
            duration: response.data.runtime,
            releaseDate: response.data.release_date,
            language: response.data.original_language,
            category: response.data.genres.map(genre => genre.name).join(', ')
        };
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
    }
};


const getMoviesByCategory = async (genreId) => {
    try {
        const response = await tmdbAxios.get('/discover/movie', {
            params: {
                with_genres: genreId,
                'primary_release_date.gte': '2020-01-01',
                'primary_release_date.lte': '2024-12-31',
                sort_by: 'popularity.desc'
            }
        });
        
        return response.data.results.map(movie => ({
            id: movie.id,
            title: movie.title,
            poster: movie.poster_path 
                ? `${TMDB_CONFIG.IMAGE_BASE_URL}${movie.poster_path}`
                : null,
            rating: movie.vote_average,
            releaseDate: movie.release_date
        }));
    } catch (error) {
        console.error('Error fetching movies by category:', error);
        return [];
    }
};

module.exports = { getMovies, searchMovies, getRankedMovies, getMoviesByDuration, getMovieDetails, getMoviesByCategory};