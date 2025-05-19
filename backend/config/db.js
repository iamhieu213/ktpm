require("dotenv").config(); // Load biến môi trường từ .env
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        console.log("🔍 MONGO_URI:", process.env.MONGO_URI); // Debug xem MONGO_URI có đúng không

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB Connected Successfully!");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
