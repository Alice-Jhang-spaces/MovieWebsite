import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import axios from "axios";
import "../CommentsPage.css";
import NavigationBar from "./home/NavigationBar";

const COMMENTS_API_URL = process.env.REACT_APP_COMMENTS_API_URL;
const USERS_API_URL = process.env.REACT_APP_USERS_API_URL;


const CommentsPage = () => {
    const [comments, setComments] = useState([]); 
    const [currentPage, setCurrentPage] = useState(1); 
    const [totalPages, setTotalPages] = useState(1); 
    const [username, setUsername] = useState(""); 
    const [error, setError] = useState("");
    const [newComment, setNewComment] = useState("");
    const [replyContent, setReplyContent] = useState(""); 
    const navigate = useNavigate();
    const commentsPerPage = 10; 
    const [replyingTo, setReplyingTo] = useState(null); 
    const { id } = useParams(); 
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("Token being used:", token);
        if (!token) {
            navigate("/login");
            return;
        }

        axios
            .get(`${USERS_API_URL}/me`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setUsername(response.data.user.username);

                setUserId(response.data.user.id);

            })
            .catch((error) => {
                console.error("Error fetching user info:", error.response?.data || error.message);
                navigate("/login");
            });
    }, [navigate]);

    const fetchComments = (page) => {
        const token = localStorage.getItem("token");
        axios
            .get(`${COMMENTS_API_URL}`, {
                params: { page, limit: commentsPerPage, movieId: id },
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                const { comments, total } = response.data;
                setComments(response.data.comments); 
                const computedTotalPages = Math.max(1, Math.ceil(total / commentsPerPage));
                setTotalPages(computedTotalPages);
            })
            .catch((error) => {
                console.error("Error fetching comments:", error.response?.data || error.message);
            });
    };
    
    useEffect(() => {
        fetchComments(currentPage);
    }, [currentPage, fetchComments]);

    const handleVote = async (commentId, voteType) => {
        const token = localStorage.getItem("token");
        const url = `${COMMENTS_API_URL}/${commentId}/${voteType}`;
    
        try {
            const response = await axios.put(url, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.status === 200) {
                setComments(prevComments =>
                    prevComments.map(comment => {
                        if (comment._id === commentId) {
                            const updatedComment = { ...comment };
                            if (voteType === 'like') {
                                if (updatedComment.likes.includes(userId)) {
                                    updatedComment.likes = updatedComment.likes.filter(id => id !== userId);
                                } else {
                                    updatedComment.likes.push(userId);
                                    updatedComment.dislikes = updatedComment.dislikes.filter(id => id !== userId);
                                }
                            } else if (voteType === 'dislike') {
                                if (updatedComment.dislikes.includes(userId)) {
                                    updatedComment.dislikes = updatedComment.dislikes.filter(id => id !== userId);
                                } else {
                                    updatedComment.dislikes.push(userId);
                                    updatedComment.likes = updatedComment.likes.filter(id => id !== userId);
                                }
                            }
                            return updatedComment;
                        }
                        return comment;
                    })
                );
            } else {
              
                fetchComments(currentPage);
            }
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            fetchComments(currentPage);
        }
    };
    

    const handleReplyVote = async (replyId, rootCommentId, voteType) => {
        const token = localStorage.getItem("token");
        const url = `${COMMENTS_API_URL}/${rootCommentId}/replies/${replyId}/${voteType}`;
    
        try {
            const response = await axios.put(url, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.status === 200) {
                fetchComments(currentPage);
            } else {
                console.error("Error voting on reply:", response.data);
            }
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
        }
    };
    
    

    const handleAddComment = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("You must be logged in to post a comment.");
            return;
        }

        if (!newComment.trim()) {
            setError("Comment cannot be empty.");
            return;
        }

        const commentData = { content: newComment, username, movieId: id};

        axios
            .post(
                `${COMMENTS_API_URL}`,
                commentData,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            )
            .then((response) => {
                setComments([response.data, ...comments]);
                setNewComment("");
                setError("");
            })
            .catch((error) => {
                console.error("Error posting comment:", error.response?.data || error.message);
                setError(error.response?.data?.error || "Failed to post comment.");
            });
    };

    const handleDeleteComment = (commentId) => {
        const token = localStorage.getItem("token");
        console.log("Token being sent in deleteComment:", token);
        axios
            .delete(`${COMMENTS_API_URL}/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                setComments(comments.filter((comment) => comment._id !== commentId));
            })
            .catch((error) => {
                console.error("Error deleting comment:", error.response?.data || error.message);
            });
    };
    
    const handleDeleteReply = (replyId, rootCommentId) => {
        const token = localStorage.getItem("token");
        axios
            .delete(`${COMMENTS_API_URL}/${rootCommentId}/replies/${replyId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                fetchComments(); 
            })
            .catch((error) => {
                console.error("Error deleting reply:", error.response?.data || error.message);
            });
    };
    
    
    
    const renderReplies = (replies, rootCommentId) => {
        return replies.map((reply) => (
            <div key={reply._id} className="reply-card">
                <div className="reply-header">
                    <strong>{reply.username}</strong>
                    <small>{new Date(reply.createdAt).toLocaleString()}</small>
                </div>
                <p className="reply-content">{reply.content}</p>

                <div>
                <button
                    onClick={() => handleReplyVote(reply._id, rootCommentId, 'like')}
                    style={{ color: reply.likes.includes(userId) ? 'blue' : 'black' }}
                >
                    👍 ({reply.likes.length})
                </button>
                <button
                    onClick={() => handleReplyVote(reply._id, rootCommentId, 'dislike')}
                    style={{ color: reply.dislikes.includes(userId) ? 'blue' : 'black' }}
                >
                    👎 ({reply.dislikes.length})
                </button>
            </div>

                <div className="reply-actions">
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setReplyingTo(reply._id)} 
                    >
                        Reply
                    </button>
                    {reply.username === username && (
                        <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteReply(reply._id, rootCommentId)} 
                    >
                        Delete
                    </button>
                    
                    )}
                </div>
                {replyingTo === reply._id && (
                    <>
                        <textarea
                            rows="2"
                            placeholder="Write a reply"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                        ></textarea>
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleAddReply(reply._id, rootCommentId)} 
                        >
                            Submit Reply
                        </button>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setReplyingTo(null)} 
                        >
                            Cancel
                        </button>
                    </>
                )}
                {/* */}
                {reply.replies && reply.replies.length > 0 && (
                    <div className="nested-replies">
                        {renderReplies(reply.replies, rootCommentId)}
                    </div>
                )}
            </div>
        ));
    };
    
    
    
    
    const handleAddReply = (parentCommentId, rootCommentId) => {
        const token = localStorage.getItem("token");
        console.log("Adding reply to:", { parentCommentId, rootCommentId });
        axios
            .post(
                `${COMMENTS_API_URL}/${rootCommentId}/replies`, 
                {   content: replyContent, 
                    parentCommentId,
                    movieId: id, 
                    username, }, 
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then(() => {
                setReplyContent("");
                setReplyingTo(null); 
                fetchComments(); 
            })
            .catch((error) => {
                console.error("Error adding reply:", error.response?.data || error.message);
            });
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <>
            <NavigationBar />
        <div className="comments-page">  
            <h2>All Comments</h2>
            <div className="comment-section">
                {comments.length > 0 ? (

                    comments.map(({ _id, username: commentUsername, content, createdAt, likes, dislikes, replies }) => (
                        <div key={_id} className="comment-card">
                            <strong>{username}</strong>
                            <p>{content}</p>
                            <small>{new Date(createdAt).toLocaleString()}</small>
                            {commentUsername === username && (
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDeleteComment(_id)}

                                >
                                    Delete
                                </button>
                            )}


                            <div>
                            <button
                                onClick={() => handleVote(_id, 'like')}
                                style={{ color: likes.includes(userId) ? 'blue' : 'black' }}
                            >
                                👍 ({likes.length})
                            </button>
                            <button
                                onClick={() => handleVote(_id, 'dislike')}
                                style={{ color: dislikes.includes(userId) ? 'blue' : 'black' }}
                            >
                                👎 ({dislikes.length})
                            </button>


                            </div>

                            <div className="reply-section">
                                <h4>Replies</h4>
                                {/**/}
                                {replies && renderReplies(replies, _id)}
                                {/**/}
                                {replyingTo === _id ? (

                                    <>
                                        <textarea
                                            rows="2"
                                            placeholder="Write a reply"
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                        ></textarea>
                                        <button
                                            className="btn btn-primary"

                                            onClick={() => handleAddReply(_id, _id)} 
                                        >
                                            Submit Reply
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => setReplyingTo(null)}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setReplyingTo(_id)}
                                    >
                                        Reply
                                    </button>
                                )}
                            </div>
                        </div>

                    ))                     
                ) : (
                    <p>No comments yet. Be the first to comment!</p>
                )}
            </div>

            <div className="pagination">
                <button
                    className="btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className="btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
            <div className="add-comment">
                <h3>Write a Comment</h3>
                <textarea
                    rows="3"
                    placeholder="Write your comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                {error && <div className="error-message">{error}</div>}
                <button className="btn btn-primary" onClick={handleAddComment}>
                    Submit
                </button>
            </div>
        </div>
        </>
    );
};

export default CommentsPage;
