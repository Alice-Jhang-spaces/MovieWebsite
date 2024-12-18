const express = require("express");
const { getComments, addComment, deleteComment, addReply, deleteReply } = require("../controllers/commentController");
const verifyToken = require("../services/authService");
const router = express.Router();

const {likeComment, dislikeComment, likeReply, dislikeReply} = require("../controllers/commentController")


// Fetch all comments
router.get("/", verifyToken, getComments);

// Add a new comment
router.post("/", verifyToken, addComment);

router.delete("/:commentId", verifyToken, deleteComment);

router.post("/:rootCommentId/replies", verifyToken, addReply);

router.delete("/:rootCommentId/replies/:replyId", verifyToken, deleteReply);

router.put("/:commentId/like", verifyToken, likeComment);
router.put("/:commentId/dislike", verifyToken, dislikeComment);
router.put("/:rootCommentId/replies/:replyId/like", verifyToken, likeReply);
router.put("/:rootCommentId/replies/:replyId/dislike", verifyToken, dislikeReply);



module.exports = router;
