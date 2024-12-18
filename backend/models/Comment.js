const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
    content: { type: String, required: true },
    username: { type: String, required: true },
    movieId: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
    replies: [
        {
            content: { type: String, required: true },
            username: { type: String, required: true },
            movieId: { type: String, required: true },
            likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
            dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
            createdAt: { type: Date, default: Date.now },
            replies: Array, 
        },
    ],
});


const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    username: { type: String, required: true },
    movieId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    replies: [replySchema], 
});

module.exports = mongoose.model("Comment", commentSchema);
