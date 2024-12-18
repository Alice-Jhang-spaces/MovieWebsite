const jwt = require("jsonwebtoken");
const temporaryStore = {};

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]; // Gets the Token from the request header
    if (!token) {
        return res.status(403).json({ error: "No token provided." });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET); // Verification Token
        req.user = decoded; // Saves the decoded information to the request object
        next(); // Continue processing request
    } catch (err) {
        res.status(401).json({ error: "Unauthorized." });
    }
};

module.exports = verifyToken;
