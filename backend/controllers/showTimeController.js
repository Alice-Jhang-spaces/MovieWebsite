const Showtime = require('../models/ShowTime');
// Get all movies
exports.getAllShowTimes = async (req, res) => {
    try {
        const showTimes = await Showtime.find();
        res.status(200).json(showTimes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createShowTimes = async (req, res) => {
    //const moviesData = MOVIES;
    if (!req.body) {
        return res.status(400).json({ message: 'Please provide showtime data' });
    }
    try {
        const newShowTimeData = new Showtime(req.body);
        //const newMovieData = await Movie.insertMany(moviesData);
        await newShowTimeData.save();
        res.status(201).json({ message: 'showtime added successfully', newShowTimeData });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


