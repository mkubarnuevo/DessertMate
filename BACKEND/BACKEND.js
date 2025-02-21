const express = require("express");
const cors = require("cors");
const connectDB = require("./MONGODB DATABASE CONNECTION");
const authRoutes = require("./ACCOUNT AUTHENTICATION AND PROFILE.js");

const app = express();
const PORT = 5500;

app.use(cors());
app.use(express.json());

const startServer = async () => {
    try {
        await connectDB();
        console.log("Connected to MongoDB");

        app.use("/", authRoutes);

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
};

startServer();
