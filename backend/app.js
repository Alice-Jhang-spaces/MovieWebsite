require("dotenv").config(); // 加载 .env 文件
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const bodyParser = require("body-parser");
const allRoutes = require("./routes/index");
const commentRoutes = require("./routes/commentRoutes");
const bookingsRoutes = require('./routes/bookingsRoutes');


const app = express();
connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Use the front-end address in.env
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(bodyParser.json());
//app.use("/api/users", userRoutes);


app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api", allRoutes);

// app.use("/api/bookings", bookingsRoutes);

const PORT = process.env.PORT || 5002; // Use the port configuration in.env
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
