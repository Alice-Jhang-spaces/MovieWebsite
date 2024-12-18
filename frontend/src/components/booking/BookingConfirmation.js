import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavigationBar from '../home/NavigationBar';
import axios from 'axios';
import { useState } from 'react';
import { create } from '@mui/material/styles/createTransitions';

const BookingConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingDetails } = location.state || {};
    const [isBooked, setIsBooked] = useState(false);
    // console.log("Booking Details: ", bookingDetails);

    // useEffect(() => {
    //     console.log("USE EFFECT");
        
    //     const createBookingServerside = async () => {
    //         try {
    //             const bookingDetailsWithToken = {...bookingDetails, token: localStorage.getItem('token')};
    //             const token = localStorage.getItem('token');
    //             const response = await axios.post('http://localhost:5002/api/bookings', bookingDetailsWithToken, {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`
    //                 }
    //             });
                
    //             console.log("Booking created successfully: ", response.data);
                
    //         } catch (error) {
    //             console.error("Error creating booking: ", error);
    //         }
    //     };
    //     createBookingServerside();
    // }, []);

    useEffect(() => {
        if (isBooked) return;  // 如果已经创建过订单，就不再创建
    
        const createBookingServerside = async () => {
            try {
                const bookingDetailsWithToken = {...bookingDetails, token: localStorage.getItem('token')};
                const token = localStorage.getItem('token');
                const response = await axios.post('http://localhost:5002/api/bookings', bookingDetailsWithToken, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log("Booking created successfully: ", response.data);
                setIsBooked(true);  // 标记订单已创建
                
            } catch (error) {
                console.error("Error creating booking: ", error);
            }
        };
        createBookingServerside();
    }, [bookingDetails, isBooked]);
    
    if (!bookingDetails) {
        return (
            <div>
                <NavigationBar />
                <div className="container mx-auto px-4 py-8">
                    <div className="alert alert-danger">
                        No booking details found. Please try booking again.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <NavigationBar />
            <div className="confirmation-container">
                <div className="confirmation-card">
                    <div className="success-header">
                        <div className="success-icon">
                            <svg viewBox="0 0 24 24" className="checkmark">
                                <path 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    d="M3,12 l6,6 l12,-12"
                                />
                            </svg>
                        </div>
                        <h2>Booking Confirmed!</h2>
                        <p>Your tickets have been booked successfully</p>
                    </div>

                    <div className="booking-details">
                        <div className="detail-group">
                            <h3>Theater Information</h3>
                            <div className="detail-item">
                                <span className="label">Theater:</span>
                                <span className="value">{bookingDetails.theaterName}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Location:</span>
                                <span className="value">{bookingDetails.theaterLocation}</span>
                            </div>
                        </div>

                        <div className="detail-group">
                            <h3>Show Information</h3>
                            <div className="detail-item">
                                <span className="label">Date & Time:</span>
                                <span className="value">
                                    {new Date(bookingDetails.showTime).toLocaleString()}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Screen:</span>
                                <span className="value">Screen {bookingDetails.screenNumber}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Seats:</span>
                                <span className="value">{bookingDetails.seats}</span>
                            </div>
                        </div>

                        <div className="detail-group">
                            <h3>Payment Information</h3>
                            <div className="detail-item">
                                <span className="label">Total Amount:</span>
                                <span className="value price">${bookingDetails.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button 
                            className="btn-primary"
                            onClick={() => navigate('/home')}
                        >
                            Back to Home
                        </button>
                        <button 
                            className="btn-secondary"
                            onClick={() => window.print()}
                        >
                            Print Ticket
                        </button>
                    </div>
                </div>
            </div>

            <style jsx="true">{`
                .confirmation-container {
                    min-height: calc(100vh - 56px);
                    background-color: #f5f5f5;
                    padding: 40px 20px;
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                }

                .confirmation-card {
                    background: white;
                    border-radius: 16px;
                    padding: 30px;
                    max-width: 600px;
                    width: 100%;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }

                .success-header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding-bottom: 30px;
                    border-bottom: 1px solid #eee;
                }

                .success-icon {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 20px;
                    background: #4facfe;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .checkmark {
                    width: 40px;
                    height: 40px;
                    color: white;
                }

                .success-header h2 {
                    color: #2d3748;
                    font-size: 24px;
                    margin-bottom: 8px;
                }

                .success-header p {
                    color: #718096;
                    margin: 0;
                }

                .booking-details {
                    margin-bottom: 30px;
                }

                .detail-group {
                    margin-bottom: 25px;
                }

                .detail-group h3 {
                    font-size: 18px;
                    color: #2d3748;
                    margin-bottom: 15px;
                    padding-bottom: 8px;
                    border-bottom: 2px solid #4facfe;
                }

                .detail-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 12px;
                }

                .label {
                    color: #718096;
                    font-weight: 500;
                }

                .value {
                    color: #2d3748;
                    font-weight: 600;
                }

                .price {
                    color: #4facfe;
                    font-size: 18px;
                }

                .action-buttons {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                }

                .btn-primary, .btn-secondary {
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: transform 0.2s;
                    border: none;
                }

                .btn-primary {
                    background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
                    color: white;
                }

                .btn-secondary {
                    background: #f8f9fa;
                    color: #4a5568;
                    border: 1px solid #e2e8f0;
                }

                .btn-primary:hover, .btn-secondary:hover {
                    transform: translateY(-2px);
                }

                @media (max-width: 640px) {
                    .confirmation-container {
                        padding: 20px 10px;
                    }

                    .confirmation-card {
                        padding: 20px;
                        border-radius: 12px;
                    }

                    .action-buttons {
                        flex-direction: column;
                    }

                    .btn-primary, .btn-secondary {
                        width: 100%;
                    }
                }

                @media print {
                    .action-buttons {
                        display: none;
                    }
                }
            `}</style>
        </>
    );
};

export default BookingConfirmation;