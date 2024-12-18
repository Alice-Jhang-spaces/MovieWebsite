import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavigationBar from '../home/NavigationBar';

const BookingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [theaters] = useState([
        {
            _id: '1',
            name: 'AMC Theater',
            location: 'Downtown Boston',
            screens: [{ number: 1, capacity: 100 }]
        },
        {
            _id: '2',
            name: 'Regal Cinemas',
            location: 'Cambridge',
            screens: [{ number: 1, capacity: 150 }]
        }
    ]);
    const [selectedTheater, setSelectedTheater] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedSeats, setSelectedSeats] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Available dates (next 7 days)
    const availableDates = Array.from({length: 7}, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return date.toISOString().split('T')[0];
    });

    // Available showtimes
    const availableShowtimes = ['10:00', '13:00', '16:00', '19:00', '22:00'];

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(`http://www.omdbapi.com/?apikey=db914358&i=${id}&plot=full`);
                if (response.data.Response === "True") {
                    setMovie({
                        id: response.data.imdbID,
                        title: response.data.Title,
                        description: response.data.Plot,
                        poster: response.data.Poster !== "N/A" ? response.data.Poster : null,
                        rating: response.data.imdbRating,
                        duration: response.data.Runtime,
                        releaseDate: response.data.Released
                    });
                }
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id, navigate]);

    const handleBooking = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const bookingData = {
                movieId: id,
                theaterId: selectedTheater,
                showTime: `${selectedDate}T${selectedTime}`,
                seats: selectedSeats,
                totalPrice: selectedSeats * 12.00
            };

            const selectedTheaterData = theaters.find(t => t._id === selectedTheater);

            //save booking data to the server
            // await axios.post('http://localhost:5002/api/bookings', bookingData);

            navigate('/payment', { 
                state: { 
                    bookingDetails: {
                        ...bookingData,
                        theaterName: selectedTheaterData?.name,
                        theaterLocation: selectedTheaterData?.location,
                        screenNumber: 1
                    } 
                }
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        }
    };

    if (loading) {
        return (
            <div>
                <NavigationBar />
                <div className="d-flex justify-content-center mt-5">
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
            <div className="booking-container">
                <div className="container">
                    {/* Movie Information Card */}
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-3">
                                    <img 
                                        src={movie?.poster || '/api/placeholder/200/300'} 
                                        alt={movie?.title}
                                        className="img-fluid rounded"
                                    />
                                </div>
                                <div className="col-md-9">
                                    <h2 className="mb-3">{movie?.title}</h2>
                                    <div className="d-flex mb-3">
                                        <span className="badge bg-primary me-2">{movie?.rating} ★</span>
                                        <span className="badge bg-secondary me-2">{movie?.duration}</span>
                                    </div>
                                    <p className="text-muted">{movie?.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div className="card mb-4">
                        <div className="card-body">
                            <h3 className="card-title mb-4">Book Tickets</h3>
                            
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <div className="row g-3">
                                {/* Theater Selection */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Select Theater</label>
                                    <select 
                                        className="form-select"
                                        value={selectedTheater}
                                        onChange={(e) => setSelectedTheater(e.target.value)}
                                    >
                                        <option value="">Choose a theater...</option>
                                        {theaters.map((theater) => (
                                            <option key={theater._id} value={theater._id}>
                                                {theater.name} - {theater.location}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Date Selection */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Select Date</label>
                                    <select 
                                        className="form-select"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                    >
                                        <option value="">Choose a date...</option>
                                        {availableDates.map((date) => (
                                            <option key={date} value={date}>
                                                {new Date(date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Show Time Selection */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Select Show Time</label>
                                    <select 
                                        className="form-select"
                                        value={selectedTime}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                    >
                                        <option value="">Choose a time...</option>
                                        {availableShowtimes.map((time) => (
                                            <option key={time} value={time}>
                                                {time}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Number of Seats */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Number of Seats</label>
                                    <div className="input-group">
                                        <button 
                                            className="btn btn-outline-secondary" 
                                            type="button"
                                            onClick={() => setSelectedSeats(prev => Math.max(1, prev - 1))}
                                        >
                                            -
                                        </button>
                                        <input 
                                            type="number" 
                                            className="form-control text-center"
                                            value={selectedSeats}
                                            readOnly
                                        />
                                        <button 
                                            className="btn btn-outline-secondary" 
                                            type="button"
                                            onClick={() => setSelectedSeats(prev => Math.min(10, prev + 1))}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Price Summary */}
                            <div className="card bg-light mt-4 mb-4">
                                <div className="card-body">
                                    <h5 className="card-title">Price Summary</h5>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Tickets ({selectedSeats} × $12.00)</span>
                                        <span>${(selectedSeats * 12).toFixed(2)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between border-top pt-2">
                                        <strong>Total Amount</strong>
                                        <strong>${(selectedSeats * 12).toFixed(2)}</strong>
                                    </div>
                                </div>
                            </div>

                            {/* Book Button */}
                            <button
                                className="btn btn-primary w-100 py-2"
                                onClick={handleBooking}
                                disabled={!selectedTheater || !selectedDate || !selectedTime || !selectedSeats}
                            >
                                Confirm Booking
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx="true">{`
                body {
                    margin: 0;
                    padding: 0;
                    min-height: 100vh;
                }
                
                .booking-container {
                    padding: 20px;
                    overflow-y: auto;
                    height: calc(100vh - 56px);
                    position: relative;
                    background-color: #f5f5f5;
                }

                .container {
                    margin-bottom: 40px;
                }

                .card {
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    border: none;
                }

                .form-select, .form-control {
                    height: 45px;
                }

                .btn-primary {
                    background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
                    border: none;
                    height: 45px;
                }

                .btn-primary:disabled {
                    background: #ccc;
                }

                @media (max-width: 768px) {
                    .booking-container {
                        padding: 10px;
                    }
                }

                /* Enable smooth scrolling */
                html {
                    scroll-behavior: smooth;
                }

                /* Fix for iOS momentum scrolling */
                .booking-container {
                    -webkit-overflow-scrolling: touch;
                }
            `}</style>
        </>
    );
};

export default BookingPage;