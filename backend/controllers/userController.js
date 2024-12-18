const userService = require("../services/userService");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../services/emailService");
const User = require("../models/user");

const tempStorage = {};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        const user = await userService.loginUser(email, password);

        const token = jwt.sign(
            { id: user._id, email: user.email,username: user.username, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: "1h" } 
        );

        
        res.status(200).json({ message: "Login successful", token, isAdmin: user.isAdmin });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const checkEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const exists = await userService.checkEmailExists(email);
        if (exists) {
            return res.status(409).json({ error: "This email is already registered." });
        }
        res.status(200).json({ message: "Email is available." });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const saveEmailAndSendCode = async (req, res) => {
    try {
        const { email } = req.body;

        // Check whether the mailbox already exists
        const exists = await userService.checkEmailExists(email);
        if (exists) {
            return res.status(409).json({ error: "This email is already registered." });
        }

        // Generate the verification code and store it
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        tempStorage[email] = { code, timestamp: Date.now() };

        // Send the verification code email
        await sendEmail(email, code);

        res.status(200).json({ message: "Verification code sent to email." });
    } catch (error) {
        console.error("Error in saveEmailAndSendCode:", error);
        res.status(500).json({ error: "Error sending verification code. Please try again later." });
    }
};

const verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        const storedData = tempStorage[email];
        if (!storedData) {
            return res.status(400).json({ error: "No verification code found for this email." });
        }

        const isValid = storedData.code === code;
        if (!isValid) {
            return res.status(400).json({ error: "Invalid verification code." });
        }

        // The temporary storage is cleared to generate a temporary token
        delete tempStorage[email];
        const tempToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "15m" });

        res.status(200).json({ message: "Code verified successfully.", tempToken });
    } catch (error) {
        console.error("Error in verifyCode:", error);
        res.status(500).json({ error: "Error verifying code. Please try again later." });
    }
};

const register = async (req, res) => {
    try {
        const { tempToken, password } = req.body;

        // Verify temporary token
        const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
        const email = decoded.email;

        let username = email.split("@")[0];

        // Ensure username is unique
        let isUnique = await userService.isUsernameUnique(username);
        while (!isUnique) {
            username = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
            isUnique = await userService.isUsernameUnique(username);
        }
        
        // User registration
        const user = await userService.registerUser(email, password, username);
        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        console.error("Error in register:", error);
        res.status(500).json({ error: "Error registering user. Please try again later." });
    }
};


const resetPassword = async (req, res) => {
    try {
        const { tempToken, newPassword } = req.body;
        const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
        const email = decoded.email;

        await userService.updatePassword(email, newPassword);

        res.status(200).json({ message: "Password reset successful." });
    } catch (error) {
        console.error("Error in resetPassword:", error);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired. Please request a new password reset." });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(400).json({ error: "Invalid token. Please request a new password reset." });
        }
        res.status(500).json({ error: "Error resetting password. Please try again later." });
    }
};

const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        const userExists = await userService.checkEmailExists(email);
        if (!userExists) {
            return res.status(404).json({ error: "Email not registered." });
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        tempStorage[email] = { code, timestamp: Date.now() };
        await sendEmail(email, code);

        res.status(200).json({ message: "Password reset code sent to email." });
    } catch (error) {
        console.error("Error in requestPasswordReset:", error);
        res.status(500).json({ error: "Error sending password reset email. Please try again later." });
    }
};


const deleteUserByEmail = async (req, res) => {
    try {
        const { email } = req.body; 

        if (!email) {
            return res.status(400).json({ error: "Email is required." });
        }

        const user = await User.findOneAndDelete({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully", user });
    } catch (error) {
        console.error("Error deleting user by email:", error);
        res.status(500).json({ error: "Error deleting user. Please try again later." });
    }
};

const getAllUsers = async (req, res) => {
    try {
        console.log("Attempting to fetch all users...");
        const users = await User.find({}).select("email -_id");
        console.log("Fetched users:", users);

        res.status(200).json({ users });
    } catch (error) {
        console.error("Error occurred in getAllUsers:", error.message, error.stack);
        res.status(500).json({ error: "Error fetching users" });
    }
};

module.exports = { saveEmailAndSendCode, verifyCode, register, login, checkEmail, resetPassword, requestPasswordReset, deleteUserByEmail, getAllUsers };

