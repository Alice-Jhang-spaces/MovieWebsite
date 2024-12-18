const Theater = require('../models/Theater');
const Movie = require('../models/Movie');

const generateShowTimes = (movieId) => {
    const showTimes = [];
    const today = new Date();
    
    // Generate showtimes for the next 7 days
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        
        // Add multiple showtimes per day
        ['10:00', '13:00', '16:00', '19:00', '22:00'].forEach(time => {
            const [hours, minutes] = time.split(':');
            const showTime = new Date(date);
            showTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            
            showTimes.push({
                movieId,
                time: showTime,
                availableSeats: 100, // Default capacity
                price: Math.floor(Math.random() * (18 - 12 + 1) + 12) // Random price between $12-$18
            });
        });
    }
    
    return showTimes;
};

exports.getTheatersForMovie = async (req, res) => {
    try {
        const { movieId } = req.params;
        
        // Find theaters showing this movie
        let theaters = await Theater.find({
            'screens.showTimes.movieId': movieId
        });

        // If no showtimes exist for this movie, create them
        if (!theaters || theaters.length === 0) {
            theaters = await Theater.find();
            
            // Add showtimes to each theater's first screen
            for (const theater of theaters) {
                const showTimes = generateShowTimes(movieId);
                theater.screens[0].showTimes.push(...showTimes);
                await theater.save();
            }
        }

        res.json(theaters);
    } catch (error) {
        console.error('Error in getTheatersForMovie:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getAllTheaters = async (req, res) => {
    try {
        const theaters = await Theater.find();
        res.json(theaters);
    } catch (error) {
        console.error('Error in getAllTheaters:', error);
        res.status(500).json({ error: error.message });
    }
};