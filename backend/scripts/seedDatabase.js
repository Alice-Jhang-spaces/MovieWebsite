const mongoose = require('mongoose');
const Theater = require('../models/Theater');
const Movie = require('../models/Movie');
require('dotenv').config();

const sampleMovies = [
    {
        title: "Inception",
        description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        genres: ["Action", "Sci-Fi", "Thriller"],
        cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
        releaseDate: new Date("2010-07-16"),
        duration: 148,
        rating: 8.8,
        posterPath: "/api/placeholder/300/400"
    },
    {
        title: "The Dark Knight",
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        genres: ["Action", "Crime", "Drama"],
        cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
        releaseDate: new Date("2008-07-18"),
        duration: 152,
        rating: 9.0,
        posterPath: "/api/placeholder/300/400"
    },
    {
        title: "Interstellar",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        genres: ["Adventure", "Drama", "Sci-Fi"],
        cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
        releaseDate: new Date("2014-11-07"),
        duration: 169,
        rating: 8.6,
        posterPath: "/api/placeholder/300/400"
    }
];

const sampleTheaters = [
    {
        name: 'AMC Theater',
        location: 'Downtown Boston',
        screens: [
            {
                number: 1,
                capacity: 100,
                showTimes: []
            },
            {
                number: 2,
                capacity: 150,
                showTimes: []
            }
        ]
    },
    {
        name: 'Regal Cinemas',
        location: 'Cambridge',
        screens: [
            {
                number: 1,
                capacity: 120,
                showTimes: []
            },
            {
                number: 2,
                capacity: 180,
                showTimes: []
            }
        ]
    }
];

const generateShowTimes = (movieId) => {
    const showTimes = [];
    const today = new Date();
    
    // Generate showtimes for the next 7 days
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        
        ['10:00', '13:00', '16:00', '19:00', '22:00'].forEach(time => {
            const [hours, minutes] = time.split(':');
            const showTime = new Date(date);
            showTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            
            showTimes.push({
                movieId,
                time: showTime,
                availableSeats: 100,
                price: Math.floor(Math.random() * (18 - 12 + 1) + 12)
            });
        });
    }
    
    return showTimes;
};

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Movie.deleteMany({});
        await Theater.deleteMany({});
        console.log('Cleared existing movies and theaters');

        // Insert sample movies
        const movies = await Movie.insertMany(sampleMovies);
        console.log('Sample movies inserted');

        // Insert sample theaters with showtimes for each movie
        const theaters = await Theater.insertMany(sampleTheaters);
        console.log('Sample theaters inserted');

        // Add showtimes for each movie to each theater
        for (const theater of theaters) {
            for (const movie of movies) {
                const showTimes = generateShowTimes(movie._id);
                theater.screens[0].showTimes.push(...showTimes);
            }
            await theater.save();
        }
        console.log('Added showtimes to theaters');

        console.log('Database seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();