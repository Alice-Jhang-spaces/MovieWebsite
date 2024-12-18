import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingDetails } = location.state || {};

    if (!bookingDetails) {
        return navigate('/home');
    }

    return (
        <div className="container mt-5">
            <div className="card p-4">
                <h2 className="mb-4">Complete Payment</h2>
                
                <div className="booking-summary mb-4">
                    <h4>Booking Summary</h4>
                    <p>Movie: {bookingDetails.movieTitle}</p>
                    <p>Theater: {bookingDetails.theaterName}</p>
                    <p>Seats: {bookingDetails.seats}</p>
                    <p>Total: ${bookingDetails.totalPrice.toFixed(2)}</p>
                </div>

                <PayPalScriptProvider options={{ 
                    "client-id": "ASjUZUrejFD-kiARiTp3C1W3qPmwQSypG7IaywgnRpDiO6n0Lwi7p2fwUjO7emg2m84k0mFpI6IPFoZf" 
                }}>
                    <PayPalButtons 
                        createOrder={(data, actions) => {
                            return actions.order.create({
                                purchase_units: [
                                    {
                                        amount: {
                                            value: bookingDetails.totalPrice.toFixed(2)
                                        }
                                    }
                                ]
                            });
                        }}
                        onApprove={async (data, actions) => {
                            await actions.order.capture();
                            
                            navigate('/booking/confirmation', { 
                                state: { 
                                    bookingDetails: {
                                        ...bookingDetails,
                                        paymentStatus: 'completed'
                                    } 
                                }
                            });
                        }}
                    />
                </PayPalScriptProvider>
            </div>
        </div>
    );
};

export default PaymentPage;