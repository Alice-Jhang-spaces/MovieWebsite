const mongoose = require('mongoose');
const showtimeSchema = new mongoose.Schema({
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    theaterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
    time: { type: Date, required: true },
    screen: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    price: { type: Number, required: true },
});

module.exports = mongoose.model('Showtime', showtimeSchema);
