const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    screens: [{
        number: { type: Number, required: true },
        capacity: { type: Number, required: true },
        showTimes: [{
            movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
            time: { type: Date, required: true },
            availableSeats: { type: Number, required: true },
            price: { type: Number, required: true }
        }]
    }]
});

module.exports = mongoose.model('Theater', theaterSchema);