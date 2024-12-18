const Booking = require('../models/Booking');
const Theater = require('../models/Theater');
const Movie = require('../models/Movie');
const jwt = require('jsonwebtoken');

exports.getShowtimes = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { date } = req.query;

        // Find all theaters showing this movie
        const theaters = await Theater.find({
            'screens.showTimes.movieId': movieId
        }).select('name location screens.showTimes');

        // Format the response
        const showtimes = theaters.map(theater => ({
            theaterId: theater._id,
            name: theater.name,
            location: theater.location,
            availableShowtimes: theater.screens
                .flatMap(screen => screen.showTimes)
                .filter(showtime => 
                    showtime.movieId.toString() === movieId &&
                    (!date || new Date(showtime.time).toDateString() === new Date(date).toDateString())
                )
                .map(showtime => ({
                    time: showtime.time,
                    availableSeats: showtime.availableSeats,
                    price: showtime.price
                }))
        }));

        res.json(showtimes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createBooking = async (req, res) => {
    try {
        const { movieId, theaterId, showTime, seats, token } = req.body;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
        //*BUG: There are no theaters in the database
        // Find the theater and showtime
        // const theater = await Theater.findById(theaterId);
        // if (!theater) {
        //     return res.status(404).json({ error: 'Theater not found' });
        // }


        //*BUG: Also no screens in thbe database. Need to seed data
        // Find the specific showtime
        // const screen = theater.screens.find(screen => 
        //     screen.showTimes.some(show => 
        //         show.movieId.toString() === movieId && 
        //         new Date(show.time).toISOString() === new Date(showTime).toISOString()
        //     )
        // );

        // if (!screen) {
        //     return res.status(404).json({ error: 'Showtime not found' });
        // }

        // const showtime = screen.showTimes.find(show => 
        //     show.movieId.toString() === movieId && 
        //     new Date(show.time).toISOString() === new Date(showTime).toISOString()
        // );

        // Check seat availability
        // if (showtime.availableSeats < seats) {
        //     return res.status(400).json({ error: 'Not enough seats available' });
        // }

        // Create booking
        const booking = new Booking({
            userId, 
            ...req.body
        });

        // Update available seats
        // showtime.availableSeats -= seats;
        // await theater.save();
        await booking.save();

        res.status(201).json({
            message: 'Booking successful',
            booking: {
                ...booking.toObject(),
                // theaterName: theater.name,
                // theaterLocation: theater.location
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBookingDetails = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId)
            .populate('movieId', 'title posterPath')
            .populate('theaterId', 'name location');

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserBookings = async (req, res) => {
    
    try {
        console.log("HEADER", req.headers.authorization.split(' ')[1]);
        
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);
        const userId = decoded.id;
        // const userId = req.user.id;
        const bookings = await Booking.find({ userId })
        console.log("BOOKINGS", bookings);
    
            

        res.status(200).json({message: "Get all bookings success", bookings});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.confirmPayment = async (req, res) => {
    try {
        const { bookingId, paymentId } = req.body;
        
        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            {
                paymentStatus: 'completed',
                paymentId: paymentId,
                paymentDate: new Date()
            },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

      
        const theater = await Theater.findById(booking.theaterId);
        const screen = theater.screens.find(s => s.number === booking.screenNumber);
        const showtime = screen.showTimes.find(show => 
            show.movieId.toString() === booking.movieId.toString() && 
            new Date(show.time).toISOString() === new Date(booking.showTime).toISOString()
        );

        showtime.availableSeats -= booking.seats;
        await theater.save();

        res.status(200).json({ 
            success: true, 
            booking 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};