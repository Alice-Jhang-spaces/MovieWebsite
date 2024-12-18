import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { orderBy } from 'lodash';
import NavigationBar from '../home/NavigationBar';

const Search = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [detailedMovies, setDetailedMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingDetails, setFetchingDetails] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [searchType, setSearchType] = useState('title');
    const query = searchParams.get('q') || '';

    useEffect(() => {
        if (query) {
            setSearchTerm(query);
            handleSearch(query);
        }
    }, [query]);

    const fetchMovieDetails = async (movies) => {
        setFetchingDetails(true);
        try {
            const detailedResults = await Promise.all(
                movies.map(async (movie) => {
                    const response = await axios.get(
                        `http://www.omdbapi.com/?apikey=db914358&i=${movie.imdbID}&plot=short`
                    );
                    return response.data;
                })
            );
            setDetailedMovies(detailedResults);
            applySort(detailedResults, searchType);
        } catch (error) {
            console.error("Error fetching movie details:", error);
        } finally {
            setFetchingDetails(false);
        }
    };

    const handleSearch = async (term = searchTerm) => {
        if (!term.trim()) return;

        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get(`http://www.omdbapi.com/?apikey=db914358&s=${term}&type=movie`);
            
            if (response.data.Response === "True") {
                setMovies(response.data.Search);
                await fetchMovieDetails(response.data.Search);
            } else {
                setMovies([]);
                setDetailedMovies([]);
                setFilteredMovies([]);
                if (response.data.Error) {
                    setError(response.data.Error);
                }
            }
        } catch (error) {
            console.error("Error searching movies:", error);
            setError("Failed to search movies. Please try again.");
            setMovies([]);
            setDetailedMovies([]);
            setFilteredMovies([]);
        } finally {
            setLoading(false);
        }
    };

    const applySort = (moviesToSort = detailedMovies, sortType) => {
        let sorted;
        switch (sortType) {
            case 'rank':
                sorted = orderBy(moviesToSort, [(movie) => parseFloat(movie.imdbRating) || 0], ['desc']);
                break;
            case 'year':
                sorted = orderBy(moviesToSort, [(movie) => parseInt(movie.Year) || 0], ['desc']);
                break;
            case 'title':
                sorted = orderBy(moviesToSort, ['Title'], ['asc']);
                break;
            default:
                sorted = moviesToSort;
        }
        setFilteredMovies(sorted);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            handleSearch(searchTerm.trim());
        }
    };

    const handleFilterClick = (type) => {
        setSearchType(type);
        applySort(detailedMovies, type);
    };

    useEffect(() => {
        if (detailedMovies.length > 0) {
            applySort(detailedMovies, searchType);
        }
    }, [detailedMovies, searchType]);

    return (
        <>
            <NavigationBar />
            <div className="search-page-container">
                <div className="content-wrapper">
                    <div className="search-section">
                        <form onSubmit={handleSearchSubmit}>
                            <div className="search-input-group">
                                <input 
                                    type="text" 
                                    className="search-input"
                                    placeholder="Search movies..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button 
                                    type="submit"
                                    className="search-button"
                                    disabled={loading || fetchingDetails}
                                >
                                    {loading ? 'Searching...' : 'Search'}
                                </button>
                            </div>
                        </form>

                        <div className="filter-buttons">
                            <button 
                                className={`filter-btn ${searchType === 'rank' ? 'active' : ''}`}
                                onClick={() => handleFilterClick('rank')}
                            >
                                By Rating
                            </button>
                            <button 
                                className={`filter-btn ${searchType === 'year' ? 'active' : ''}`}
                                onClick={() => handleFilterClick('year')}
                            >
                                By Year
                            </button>
                            <button 
                                className={`filter-btn ${searchType === 'title' ? 'active' : ''}`}
                                onClick={() => handleFilterClick('title')}
                            >
                                By Title
                            </button>
                        </div>
                    </div>

                    <div className="results-section">
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        {(loading || fetchingDetails) ? (
                            <div className="loading-spinner">
                                <div className="spinner"></div>
                                <p>{fetchingDetails ? 'Loading movie details...' : 'Searching for movies...'}</p>
                            </div>
                        ) : (
                            <div className="movies-grid">
                                {filteredMovies.map((movie) => (
                                    <div key={movie.imdbID} className="movie-card">
                                        <img 
                                            src={movie.Poster !== "N/A" ? movie.Poster : '/api/placeholder/300/400'}
                                            alt={movie.Title}
                                            className="movie-poster"
                                            loading="lazy"
                                        />
                                        <div className="movie-info">
                                            <h3>{movie.Title}</h3>
                                            <div className="movie-meta">
                                                <span className="year">{movie.Year}</span>
                                                <span className="rating">★ {movie.imdbRating || 'N/A'}</span>
                                            </div>
                                            <button 
                                                className="view-details-button"
                                                onClick={() => navigate(`/movie/${movie.imdbID}`)}
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!loading && !fetchingDetails && filteredMovies.length === 0 && searchTerm && (
                            <div className="no-results">
                                <p>No movies found for "{searchTerm}"</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx="true">{`
                body {
                    margin: 0;
                    padding: 0;
                }

                .search-page-container {
                    height: calc(100vh - 56px);
                    overflow-y: auto;
                    background-color: #f5f5f5;
                    padding: 20px;
                    -webkit-overflow-scrolling: touch;
                }

                .content-wrapper {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding-bottom: 40px;
                }

                .search-section {
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    margin-bottom: 20px;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }

                .search-input-group {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 15px;
                }

                .search-input {
                    flex: 1;
                    padding: 12px 20px;
                    border: 1px solid #ddd;
                    border-radius: 25px;
                    font-size: 16px;
                    outline: none;
                    transition: border-color 0.2s;
                }

                .search-input:focus {
                    border-color: #4facfe;
                }

                .search-button {
                    padding: 12px 30px;
                    background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
                    border: none;
                    border-radius: 25px;
                    color: white;
                    font-weight: 500;
                    cursor: pointer;
                    transition: transform 0.2s;
                }

                .search-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                }

                .search-button:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }

                .filter-buttons {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }

                .filter-btn {
                    padding: 8px 16px;
                    border: 1px solid #ddd;
                    border-radius: 20px;
                    background: white;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 14px;
                }

                .filter-btn:hover {
                    border-color: #4facfe;
                }

                .filter-btn.active {
                    background: #4facfe;
                    color: white;
                    border-color: #4facfe;
                }

                .movies-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 20px;
                    padding: 20px 0;
                }

                .movie-card {
                    background: white;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    transition: transform 0.2s;
                }

                .movie-card:hover {
                    transform: translateY(-5px);
                }

                .movie-poster {
                    width: 100%;
                    height: 300px;
                    object-fit: cover;
                }

                .movie-info {
                    padding: 15px;
                }

                .movie-info h3 {
                    margin: 0 0 8px 0;
                    font-size: 16px;
                    color: #2d3748;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    min-height: 40px;
                }

                .movie-meta {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 12px;
                    font-size: 0.9rem;
                }

                .rating {
                    color: #f59e0b;
                    font-weight: 500;
                }

                .year {
                    color: #6b7280;
                }

                .view-details-button {
                    width: 100%;
                    padding: 8px;
                    background: #f8f9fa;
                    border: 1px solid #e2e8f0;
                    border-radius: 5px;
                    color: #4a5568;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                .view-details-button:hover {
                    background-color: #edf2f7;
                }

                .loading-spinner {
                    text-align: center;
                    padding: 40px;
                }

                .spinner {
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #4facfe;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .error-message {
                    background: #fee2e2;
                    color: #dc2626;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 20px 0;
                }

                .no-results {
                    text-align: center;
                    padding: 40px;
                    color: #718096;
                }

                @media (max-width: 768px) {
                    .search-page-container {
                        padding: 10px;
                    }

                    .movies-grid {
                        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                        gap: 15px;
                    }

                    .movie-poster {
                        height: 225px;
                    }

                    .movie-info h3 {
                        font-size: 14px;
                        min-height: 35px;
                    }

                    .filter-buttons {
                        overflow-x: auto;
                        padding-bottom: 5px;
                        flex-wrap: nowrap;
                    }

                    .filter-btn {
                        flex-shrink: 0;
                    }
                }

                @media (max-width: 480px) {
                    .search-input-group {
                        flex-direction: column;
                    }

                    .search-button {
                        width: 100%;
                    }
                }
            `}</style>
        </>
    );
};

export default Search;