import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie }) => {
    
    const navigate = useNavigate();

    return (
        <div 
            className="card h-100 shadow-sm hover-card"
            onClick={() => navigate(`/movie/${movie.id}`)}
            style={{ cursor: 'pointer' }}
        >
            <img 
                src={movie.poster || `/api/placeholder/300/400`}
                className="card-img-top"
                alt={movie.title}
                style={{
                    height: '300px',
                    objectFit: 'cover'
                }}
            />
            <div className="card-body">
                <h5 className="card-title text-truncate">{movie.title}</h5>
                <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                        {new Date(movie.releaseDate).getFullYear()}
                    </small>
                    <span className="badge bg-warning">
                        <i className="bi bi-star-fill"></i> {movie.rating}
                    </span>
                </div>
            </div>

            <style jsx>{`
                .hover-card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    border: none;
                    border-radius: 10px;
                }
                .hover-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }
            `}</style>
        </div>
    );
};

export default MovieCard;