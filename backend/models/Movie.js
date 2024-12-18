const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    //PROBLEM: movie ID taken from 3rd party Movie API database is a different format than the id assigned by mongoose
    // SOLUTION: populate the SELECT box inside the bookings form with the movie IDs from the mongo DB

    title: { type: String, required: true },
    description: { type: String },
    genres: [{ type: String }],
    cast: [{ type: String }],
    releaseDate: { type: Date },
    duration: { type: Number }, // in minutes
    rating: { type: Number }, // e.g., IMDb rating
    posterPath: { type: String }, // URL or file path to poster image
});

module.exports = mongoose.model('Movie', movieSchema);
