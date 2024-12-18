const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");


const MONGO_URI = "mongodb://localhost:27017/movie"; 

const seedAdmin = async () => {
    try {
        
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");

       
        const adminExists = await User.findOne({ email: "admin@example.com" });
        if (!adminExists) {
            
            const hashedPassword = await bcrypt.hash("admin123", 10); 

            
            const admin = new User({
                email: "admin@example.com",
                password: hashedPassword,
                username: "admin",
                isAdmin: true, 
            });
            await admin.save();

            console.log("Admin user created successfully");
        } else {
            console.log("Admin user already exists");
        }

        
        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("Error creating admin:", error);
        mongoose.connection.close(); 
        process.exit(1);
    }
};

// 执行种子脚本
seedAdmin();