import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavigationBar from "./home/NavigationBar";

const Home = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [movies, setMovies] = useState([]);
    const [randomLoading, setRandomLoading] = useState(false);

    // List of popular movies with their IMDb IDs
    const popularMovies = [
        'tt0468569', // The Dark Knight
        'tt0111161', // The Shawshank Redemption
        'tt0068646', // The Godfather
        'tt0167260', // LOTR
        'tt0137523', // Fight Club
        'tt0109830', // Forrest Gump
        'tt0133093', // The Matrix
        'tt0110912', // Pulp Fiction
        'tt0120737', // LOTR: Fellowship
        'tt0167261', // LOTR: Two Towers
        'tt0080684', // Star Wars: Empire Strikes Back
        'tt0073486', // One Flew Over the Cuckoo's Nest
    ];

    useEffect(() => {
        const fetchMovies = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                // Get 6 random movies for initial display
                const shuffled = [...popularMovies].sort(() => 0.5 - Math.random());
                const selectedMovies = shuffled.slice(0, 6);

                const moviePromises = selectedMovies.map(id =>
                    axios.get(`http://www.omdbapi.com/?apikey=db914358&i=${id}`)
                );

                const responses = await Promise.all(moviePromises);
                const movieData = responses
                    .map(response => response.data)
                    .filter(movie => movie.Response === "True");

                setMovies(movieData);
            } catch (error) {
                console.error("Error fetching movies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [navigate]);

    const handleRandomMovie = async () => {
        try {
            setRandomLoading(true);
            const randomId = popularMovies[Math.floor(Math.random() * popularMovies.length)];
            const response = await axios.get(`http://www.omdbapi.com/?apikey=db914358&i=${randomId}`);
            if (response.data.Response === "True") {
                navigate(`/movie/${response.data.imdbID}`);
            }
        } catch (error) {
            console.error("Error getting random movie:", error);
        } finally {
            setRandomLoading(false);
        }
    };

    const handleMovieClick = (movieId) => {
        navigate(`/movie/${movieId}`);
    };

    return (
        <>
            <NavigationBar />
            <div className="home-container">
                <div className="content-wrapper">
                    {loading ? (
                        <div className="card shadow-sm mb-5">
                            <div className="card-body">
                                <div className="loading-skeleton">
                                    {[1, 2, 3, 4, 5, 6].map((item) => (
                                        <div key={item} className="skeleton-card">
                                            <div className="skeleton-image"></div>
                                            <div className="skeleton-text"></div>
                                            <div className="skeleton-text short"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Gallery Section */}
                            <div className="card shadow-sm mb-5">
                                <div className="card-body">
                                    <div className="gallery-section p-4">
                                        <h2 className="text-center mb-4">Popular Movies</h2>
                                        <div className="movie-grid">
                                            {movies.map((movie) => (
                                                <div 
                                                    key={movie.imdbID} 
                                                    className="movie-card"
                                                    onClick={() => handleMovieClick(movie.imdbID)}
                                                >
                                                    <img 
                                                        src={movie.Poster !== "N/A" ? movie.Poster : '/api/placeholder/300/400'}
                                                        alt={movie.Title}
                                                        className="movie-poster"
                                                    />
                                                    <div className="movie-info">
                                                        <h3>{movie.Title}</h3>
                                                        <div className="movie-meta">
                                                            <span className="year">{movie.Year}</span>
                                                            <span className="rating">★ {movie.imdbRating}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Random Movie Section */}
                            <div className="card shadow-sm mb-5">
                                <div className="card-body text-center p-5">
                                    <h2 className="mb-4">Discover Something New</h2>
                                    <p className="text-muted mb-4">Let us surprise you with a random movie selection</p>
                                    <button 
                                        className="discover-btn"
                                        onClick={handleRandomMovie}
                                        disabled={randomLoading}
                                    >
                                        {randomLoading ? 'Finding a movie...' : 'Get Random Movie'}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <style jsx="true">{`
                body {
                    margin: 0;
                    padding: 0;
                }

                .home-container {
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

                .card {
                    background: white;
                    border-radius: 12px;
                    border: none;
                }

                .movie-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 20px;
                }

                .movie-card {
                    background: white;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    transition: transform 0.2s;
                    cursor: pointer;
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
                    align-items: center;
                }

                .rating {
                    color: #f59e0b;
                    font-weight: 500;
                }

                .year {
                    color: #6b7280;
                }

                .discover-btn {
                    background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 25px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: transform 0.2s;
                    min-width: 200px;
                }

                .discover-btn:not(:disabled):hover {
                    transform: translateY(-2px);
                }

                .discover-btn:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }

                .loading-skeleton {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 20px;
                    padding: 20px;
                }

                .skeleton-card {
                    background: white;
                    border-radius: 10px;
                    overflow: hidden;
                }

                .skeleton-image {
                    width: 100%;
                    height: 300px;
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: loading 1.5s infinite;
                }

                .skeleton-text {
                    height: 20px;
                    margin: 10px;
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: loading 1.5s infinite;
                }

                .skeleton-text.short {
                    width: 60%;
                }

                @keyframes loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }

                @media (max-width: 768px) {
                    .home-container {
                        padding: 10px;
                    }

                    .movie-grid {
                        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                        gap: 15px;
                    }

                    .movie-poster {
                        height: 225px;
                    }

                    .movie-info h3 {
                        font-size: 14px;
                    }

                    .discover-btn {
                        width: 100%;
                        min-width: unset;
                    }
                }
            `}</style>
        </>
    );
};

export default Home;