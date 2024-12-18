import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavigationBar from '../home/NavigationBar';

const COMMENTS_API_URL = process.env.REACT_APP_COMMENTS_API_URL;

const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const handleViewDetails = () => {
        if (!id) {
            console.error("No movie ID found, cannot navigate to comments.");
            return;
        }
        navigate(`/comments/${id}`);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(`http://www.omdbapi.com/?apikey=db914358&i=${id}&plot=full`);
                if (response.data.Response === "True") {
                    setMovie(response.data);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching movie details:", error);
                setLoading(false);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await axios.get(`${COMMENTS_API_URL}`, {
                    params: { movieId: id },
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, 
                });
                setComments(response.data.comments);
            } catch (error) {
                console.error("Error fetching comments:", error.response?.data || error.message);
            }
        };

        fetchMovieDetails();
        fetchComments();
    }, [id]);

    if (loading) {
        return (
            <div>
                <NavigationBar />
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <NavigationBar />
            <div className="movie-detail-container">
                <div className="content-wrapper">
                    <div className="movie-header">
                        <div className="movie-info">
                            <div className="poster-container">
                                <img 
                                    src={movie?.Poster !== "N/A" ? movie?.Poster : '/api/placeholder/300/400'}
                                    alt={movie?.Title}
                                    className="movie-poster"
                                />
                                <div className="movie-badges">
                                    <span className="badge genre">
                                        {movie?.Genre?.split(',')[0]}
                                    </span>
                                    <span className="badge rating">
                                        {movie?.imdbRating}/10
                                    </span>
                                </div>
                            </div>
                            <div className="movie-details">
                                <h1>{movie?.Title}</h1>
                                <div className="meta-info">
                                    <span>{movie?.Runtime}</span>
                                    <span>{movie?.Released}</span>
                                    <span>{movie?.Language}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="main-content">
                        <section className="synopsis-section">
                            <h2>Synopsis</h2>
                            <p>{movie?.Plot}</p>
                        </section>

                        <section className="comments-section">
                            <h2>Recent Comments</h2>
                            <div className="comments-list">
                                {comments.slice(0, 3).map((comment, index) => (
                                    <div key={index} className="comment-card">
                                        <div className="comment-header">
                                            <span className="username">{comment.username}</span>
                                            <span className="date">

                                                {new Date(comment.createdAt).toLocaleString()}

                                            </span>
                                        </div>
                                        <p className="comment-content">{comment.content}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="view-comments-container">
                                <button className="view-comments-btn" onClick={handleViewDetails}>
                                    {comments.length > 3 ? "View More Comments" : "Add Comment"}
                                </button>
                            </div>
                        </section>


                        <div className="booking-button-container">
                            <button 
                                className="book-tickets-btn"
                                onClick={() => navigate(`/booking/${movie?.imdbID}`)}
                            >
                                Book Tickets
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx="true">{`
                body {
                    margin: 0;
                    padding: 0;
                }

                .movie-detail-container {
                    height: calc(100vh - 56px);
                    overflow-y: auto;
                    background-color: #f5f5f5;
                    padding: 20px;
                }

                .content-wrapper {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding-bottom: 40px;
                }

                .movie-header {
                    background: white;
                    border-radius: 10px;
                    padding: 20px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .movie-info {
                    display: flex;
                    gap: 30px;
                }

                .poster-container {
                    position: relative;
                    flex-shrink: 0;
                    width: 300px;
                }

                .movie-poster {
                    width: 100%;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                }

                .movie-badges {
                    position: absolute;
                    bottom: 10px;
                    left: 10px;
                    display: flex;
                    gap: 10px;
                }

                .badge {
                    padding: 8px 12px;
                    border-radius: 20px;
                    color: white;
                    font-weight: 500;
                }

                .genre {
                    background: #4facfe;
                }

                .rating {
                    background: #f7b731;
                }

                .main-content {
                    background: white;
                    border-radius: 10px;
                    padding: 30px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .comments-section {
                    margin-bottom: 40px;
                }

                .comments-section h2 {
                    font-size: 1.5rem;
                    margin-bottom: 20px;
                    color: #333;
                }

                .comment-card {
                    background: #f8f9fa;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 15px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .comment-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }

                .username {
                    font-weight: 600;
                    color: #333;
                }

                .date {
                    color: #888;
                    font-size: 0.9rem;
                }

                .comment-content {
                    margin: 0;
                    color: #444;
                    line-height: 1.6;
                }

                .view-comments-container {
                    text-align: center;
                    margin-top: 20px;
                }

                    .view-comments-btn {
                    display: inline-block;
                    background: #4caf50; 
                    color: white;
                    border: none;
                    padding: 15px 40px; 
                    border-radius: 25px;
                    font-size: 1rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: transform 0.3s ease, background-color 0.3s ease;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
                    text-align: center;
                }

                .view-comments-btn:hover {
                    transform: scale(1.05);
                    background: #45a049;
                }

                .book-tickets-btn {
                    display: inline-block;
                    background: #ff5722; 
                    color: white;
                    border: none;
                    padding: 15px 40px; 
                    border-radius: 25px;
                    font-size: 1rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: transform 0.3s ease, background-color 0.3s ease;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
                    text-align: center;
                }

                .book-tickets-btn:hover {
                    transform: scale(1.05);
                    background: #e64a19; 
                }

                .view-comments-container,
                .booking-button-container {
                    text-align: center;
                    margin-top: 20px;
                }
                
            `}</style>
        </>
    );
};

export default MovieDetail;
