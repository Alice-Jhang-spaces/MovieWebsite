const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
    movieId: { type: String, ref: 'Movie', required: true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // showtimeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
    theaterId: { type: String, required: true },
    theaterLocation: { type: String, required: true },
    theaterName: { type: String, required: true },
    showTime: { type: Date, required: true },
    seats: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    bookingDate: { type: Date, default: Date.now },
    screenNumber: { type: Number, required: true },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    paymentId: {type: String},
    paymentDate: {type: Date},
    totalPrice: { type: Number, required: true }
});

module.exports = mongoose.model('Booking', bookingSchema);
