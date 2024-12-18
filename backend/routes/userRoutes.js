const express = require("express");
const { register, login, checkEmail,saveEmailAndSendCode, verifyCode, resetPassword, requestPasswordReset  } = require("../controllers/userController");
const router = express.Router();
const verifyToken = require("../services/authService");
const User = require("../models/user"); 
const { deleteUserByEmail, getAllUsers } = require("../controllers/userController");

router.post("/register", register);
router.post("/login", login);
router.get("/all-users", getAllUsers);
// router.post("/check-email", checkEmail);
router.get("/home", verifyToken, (req, res) => {
    res.status(200).json({ message: "Welcome to the Home page!", user: req.user });
});

router.post("/save-email", saveEmailAndSendCode);
router.post("/verify-code", verifyCode);

router.post("/reset-password/request", requestPasswordReset);
router.post("/reset-password", resetPassword);  

router.delete("/delete", deleteUserByEmail);

router.get("/me", verifyToken, async (req, res) => {
    try {
        console.log("Decoded user from token:", req.user); 
        const userId = req.user.id;

        if (!userId) {
            return res.status(400).json({ message: "User ID not found in token." });
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        console.log("User found in database:", user); 

        res.status(200).json({
            message: "User fetched successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;
