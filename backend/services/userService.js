const User = require("../models/user");
const bcrypt = require("bcrypt");

const registerUser = async (email, password, username) => {
    // Check whether a user with the same mailbox already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("This email is already registered. Please use another email.");
    }


    // Create a new user with isAdmin field
    const user = new User({ 
        email, 
        password,
        username,
        isAdmin: false  // 默认为 false
    });
    await user.save();
    return user;
};



const isUsernameUnique = async (username) => {
    const user = await User.findOne({ username });
    return !user;
};

const loginUser = async (email, password) => {
    
    const user = await User.findOne({ email }).select('+isAdmin');
    if (!user) throw new Error("Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid email or password");

    console.log('User in loginUser:', user);
    
    return user;
};


const checkEmailExists = async (email) => {
    const existingUser = await User.findOne({ email });
    return !!existingUser; // Returns a Boolean value
};

const updatePassword = async (email, newPassword) => {
    if (!email || !newPassword) {
        throw new Error("Email and new password are required.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await User.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true } 
    );

    if (!updatedUser) {
        throw new Error("User not found.");
    }

    return updatedUser;
};

module.exports = { registerUser, isUsernameUnique, loginUser, checkEmailExists, updatePassword };
