import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavigationBar from './home/NavigationBar';

const MyTickets = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cancellingId, setCancellingId] = useState(null);
console.log('Tickets:', tickets);

    useEffect(() => {
        const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            const fetchTickets = async () => {
                try {
                    const response = await axios.get('http://localhost:5002/api/bookings/user/history', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    
                    const bookings = response.data.bookings;
                   
                    
                    setTickets(bookings);
                } catch (error) {
                    setError('Failed to fetch tickets. Please try again later.');
                    console.error('Error fetching tickets:', error);
                    
                }
            }

            // setLoading(false);

            fetchTickets();
    }, []);

    // 

    const handleCancelTicket = async (ticketId) => {
        try {
            setCancellingId(ticketId);
            // Mock cancellation - replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
            
            setTickets(prevTickets =>
                prevTickets.map(ticket =>
                    ticket.id === ticketId
                        ? { ...ticket, status: 'cancelled' }
                        : ticket
                )
            );
        } catch (err) {
            setError('Failed to cancel ticket. Please try again.');
            console.error('Error cancelling ticket:', err);
        } finally {
            setCancellingId(null);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }).format(date);
    };

    return (
        <>
            <NavigationBar />
            <div className="tickets-container">
                <div className="content-wrapper">
                    <h1 className="page-title">My Tickets</h1>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                            <p>Loading your tickets...</p>
                        </div>
                    ) : tickets.length > 0 ? (
                        <div className="tickets-list">
                            {tickets.map((ticket) => (
                                
                                <div key={ticket.id} className={`ticket-card ${ticket.paymentStatus === 'cancelled' ? 'cancelled' : ''}`}>
                                    <div className="ticket-header">
                                        <h2>Movie ID: {ticket.movieId}</h2>
                                        <span className={`status-badge ${ticket.paymentStatus}`}>
                                            {ticket.paymentStatus.charAt(0).toUpperCase() + ticket.paymentStatus.slice(1)}
                                        </span>
                                    </div>
                                    
                                    <div className="ticket-details">
                                        <div className="detail-group">
                                            <span className="label">Theater:</span>
                                            <span className="value">{ticket.theaterName}</span>
                                        </div>
                                        <div className="detail-group">
                                            <span className="label">Location:</span>
                                            <span className="value">{ticket.theaterLocation}</span>
                                        </div>
                                        <div className="detail-group">
                                            <span className="label">Show Time:</span>
                                            <span className="value">{formatDate(ticket.showTime)}</span>
                                        </div>
                                        <div className="detail-group">
                                            <span className="label">Seats:</span>
                                            <span className="value">{ticket.seats}</span>
                                        </div>
                                        <div className="detail-group">
                                            <span className="label">Total Price:</span>
                                            <span className="value price">${ticket.totalPrice.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {ticket.status === 'active' && (
                                        <button 
                                            className="cancel-button"
                                            onClick={() => handleCancelTicket(ticket.id)}
                                            disabled={cancellingId === ticket.id}
                                        >
                                            {cancellingId === ticket.id ? 'Cancelling...' : 'Cancel Ticket'}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-tickets">
                            <p>You haven't booked any tickets yet.</p>
                            <button 
                                className="browse-button"
                                onClick={() => navigate('/home')}
                            >
                                Browse Movies
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style jsx="true">{`
                .tickets-container {
                    height: calc(100vh - 56px);
                    overflow-y: auto;
                    background-color: #f5f5f5;
                    padding: 20px;
                    -webkit-overflow-scrolling: touch;
                }

                .content-wrapper {
                    max-width: 800px;
                    margin: 0 auto;
                    padding-bottom: 40px;
                }

                .page-title {
                    font-size: 24px;
                    color: #2d3748;
                    margin-bottom: 24px;
                }

                .tickets-list {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .ticket-card {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .ticket-card.cancelled {
                    opacity: 0.7;
                }

                .ticket-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #e2e8f0;
                }

                .ticket-header h2 {
                    font-size: 18px;
                    margin: 0;
                    color: #2d3748;
                }

                .status-badge {
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 500;
                }

                .status-badge.active {
                    background: #c6f6d5;
                    color: #2f855a;
                }

                .status-badge.cancelled {
                    background: #fed7d7;
                    color: #c53030;
                }

                .ticket-details {
                    display: grid;
                    gap: 12px;
                }

                .detail-group {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .label {
                    color: #718096;
                    font-size: 14px;
                }

                .value {
                    color: #2d3748;
                    font-weight: 500;
                }

                .price {
                    color: #4facfe;
                }

                .cancel-button {
                    width: 100%;
                    padding: 10px;
                    margin-top: 15px;
                    border: none;
                    border-radius: 8px;
                    background: #fc8181;
                    color: white;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                .cancel-button:hover:not(:disabled) {
                    background: #f56565;
                }

                .cancel-button:disabled {
                    background: #cbd5e0;
                    cursor: not-allowed;
                }

                .no-tickets {
                    text-align: center;
                    padding: 40px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .browse-button {
                    margin-top: 15px;
                    padding: 10px 20px;
                    background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
                    color: white;
                    border: none;
                    border-radius: 25px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: transform 0.2s;
                }

                .browse-button:hover {
                    transform: translateY(-2px);
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
                    margin-bottom: 20px;
                }

                @media (max-width: 768px) {
                    .tickets-container {
                        padding: 10px;
                    }

                    .ticket-card {
                        padding: 15px;
                    }

                    .ticket-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 10px;
                    }

                    .detail-group {
                        font-size: 14px;
                    }
                }
            `}</style>
        </>
    );
};

export default MyTickets;
