const axios = require('axios');
const OMDB_CONFIG = require('../config/omdb');

// Create axios instance with token interceptor
const createAxiosInstance = (token) => {
    const instance = axios.create({
        baseURL: OMDB_CONFIG.BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return instance;
};

const movieService = {
    getMovies: async (token, searchTerm = '') => {
        try {
            // First verify the token with your backend
            const authAxios = createAxiosInstance(token);
            await authAxios.get('http://localhost:5000/api/users/validate');

            // Then make the OMDB API call
            const response = await axios.get(`${OMDB_CONFIG.BASE_URL}/?apikey=${OMDB_CONFIG.API_KEY}&s=${searchTerm}`);
            if (response.data.Response === "True") {
                return response.data.Search.map(movie => ({
                    id: movie.imdbID,
                    title: movie.Title,
                    poster: movie.Poster !== "N/A" ? movie.Poster : null,
                    year: movie.Year,
                    type: movie.Type
                }));
            }
            return [];
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Unauthorized');
            }
            console.error('Error fetching movies:', error);
            return [];
        }
    },

    getMovieDetails: async (token, id) => {
        try {
            // First verify the token
            const authAxios = createAxiosInstance(token);
            await authAxios.get('http://localhost:5000/api/users/validate');

            // Then fetch movie details
            const response = await axios.get(`${OMDB_CONFIG.BASE_URL}/?apikey=${OMDB_CONFIG.API_KEY}&i=${id}&plot=full`);
            if (response.data.Response === "True") {
                return {
                    id: response.data.imdbID,
                    title: response.data.Title,
                    description: response.data.Plot,
                    poster: response.data.Poster !== "N/A" ? response.data.Poster : null,
                    rating: response.data.imdbRating,
                    duration: response.data.Runtime.split(' ')[0],
                    releaseDate: response.data.Released,
                    language: response.data.Language,
                    category: response.data.Genre
                };
            }
            return null;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Unauthorized');
            }
            console.error('Error fetching movie details:', error);
            return null;
        }
    },

    searchMovies: async (token, query) => {
        return movieService.getMovies(token, query);
    },

    getRandomMovie: async (token) => {
        const popularMovieIds = [
            'tt0111161', 'tt0068646', 'tt0071562', 'tt0468569', 
            'tt0050083', 'tt0108052', 'tt0167260', 'tt0110912'
        ];
        const randomId = popularMovieIds[Math.floor(Math.random() * popularMovieIds.length)];
        return movieService.getMovieDetails(token, randomId);
    }
};

module.exports = movieService;