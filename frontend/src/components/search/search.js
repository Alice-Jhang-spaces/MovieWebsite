import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavigationBar from '../home/NavigationBar';


const Search = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchType, setSearchType] = useState('title');
    const query = searchParams.get('q') || '';

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        const searchMovies = async () => {
            setLoading(true);
            try {
                let endpoint;
                switch(searchType) {
                    case 'tag':
                        endpoint = `/genre`; 
                        break;
                    case 'rank':
                        endpoint = `/discover/movie?sort_by=vote_average.desc`; 
                        break;
                    default:
                        endpoint = `/search/movie?query=${query}`; 
                }
                
                const response = await axios.get(
                    `http://localhost:5001/api/movies${endpoint}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
    
                
                const formattedMovies = response.data.results.map(movie => ({
                    id: movie.id,
                    title: movie.title,
                    poster: movie.poster_path 
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : null,
                    rating: movie.vote_average.toFixed(1),
                    releaseDate: movie.release_date
                }));
    
                setMovies(formattedMovies);
                setLoading(false);
            } catch (error) {
                console.error("Error searching movies:", error);
                if (error.response?.status === 401) {
                    navigate("/login");
                }
                setLoading(false);
            }
        };
    
        searchMovies();
    }, [searchParams, searchType, navigate, query]);

    const handleFilterClick = (type) => {
        setSearchType(type);
    };

    return (
        <div>
            <NavigationBar />
            <div className="container-fluid container-md mt-4 px-3">
                {/* Search Section */}
                <div className="card shadow-sm mb-4">
                    <div className="card-body p-3 p-md-4">
                        <div className="row align-items-center mb-3 mb-md-4">
                            <div className="col">
                                <div className="input-group flex-nowrap">
                                    <input 
                                        type="text" 
                                        className="form-control"
                                        placeholder="Search movies..."
                                        defaultValue={query}
                                        style={{
                                            borderRadius: "20px 0 0 20px",
                                            border: "1px solid #ddd",
                                            fontSize: "16px" 
                                        }}
                                    />
                                    <button 
                                        className="btn btn-primary px-3 px-md-4"
                                        style={{
                                            borderRadius: "0 20px 20px 0",
                                            whiteSpace: "nowrap"
                                        }}
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Filter Buttons  */}
                        <div className="filter-scroll">
                            <div className="d-flex gap-2">
                                <button 
                                    className={`btn ${searchType === 'rank' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => handleFilterClick('rank')}
                                >
                                    Rank 排序
                                </button>
                                <button 
                                    className={`btn ${searchType === 'duration' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => handleFilterClick('duration')}
                                >
                                    时长排序
                                </button>
                                <button 
                                    className={`btn ${searchType === 'category' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => handleFilterClick('category')}
                                >
                                    分类
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                {loading ? (
                    <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3 g-md-4">
                        {movies.map(movie => (
                            <div key={movie.id} className="col">
                                <div className="card h-100 shadow-sm hover-card">
                                    <img 
                                        src={movie.poster || `/api/placeholder/300/400`}
                                        className="card-img-top"
                                        alt={movie.title}
                                        style={{
                                            height: "200px",
                                            objectFit: "cover",
                                            borderRadius: "10px 10px 0 0"
                                        }}
                                    />
                                    <div className="card-body">
                                        <h6 className="card-title text-truncate">{movie.title}</h6>
                                        <p className="card-text text-muted small">
                                            Rating: {movie.rating}/10
                                        </p>
                                        <button 
                                            className="btn btn-outline-primary btn-sm w-100"
                                            onClick={() => navigate(`/movie/${movie.id}`)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* No Results Message */}
                {!loading && movies.length === 0 && (
                    <div className="text-center py-4">
                        <h5>No results found</h5>
                        <p className="text-muted small">Try adjusting your search</p>
                    </div>
                )}
            </div>

            {/* Custom CSS */}
            <style jsx="true">{`
                .filter-scroll {
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                    padding-bottom: 5px;
                }
                .filter-scroll::-webkit-scrollbar {
                    display: none;
                }
                .filter-scroll .btn {
                    flex-shrink: 0;
                }
                .hover-card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    border-radius: 10px;
                    border: none;
                }
                @media (hover: hover) {
                    .hover-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
                    }
                }
                @media (max-width: 576px) {
                    .card-body {
                        padding: 0.75rem;
                    }
                    .btn {
                        padding: 0.4rem 0.75rem;
                        font-size: 0.875rem;
                    }
                }
                .btn-primary {
                    background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
                    border: none;
                }
                .text-truncate {
                    max-width: 100%;
                }
            `}</style>
        </div>
    );
};

export default Search;