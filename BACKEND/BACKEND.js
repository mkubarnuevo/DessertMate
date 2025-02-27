const express = require("express");
const session = require("express-session");
const cors = require("cors");
const MongoStore = require("connect-mongo");
const connectDB = require("./MONGODB DATABASE CONNECTION");
const authRoutes = require("./ACCOUNT AUTHENTICATION AND PROFILE.js");
const sessionHistoryRoutes = require("./SESSION HISTORY.js");
const Menu = require("./product.model.js"); // ✅ Added: Import Menu Model

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
const app = express();                  // X
const PORT = 5500;                      // X
                                        // X
app.use(cors({                          // X
    origin: "http://127.0.0.1:5500",    // X
    credentials: true                   // X
}));                                    // X
app.use(express.json({ limit: "10mb" })); // ✅ Increased request size limit for image uploads
app.use(express.urlencoded({ limit: "10mb", extended: true }));
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
app.use(                                        // X
    session({                                   // X
        secret: "DessertMateSecretKey123",      // X
        resave: false,                          // X
        saveUninitialized: false,               // X
        cookie: {                               // X
            secure: true,                       // X
            httpOnly: true,                     // X
            sameSite: "lax",                    // X
            maxAge: 1000 * 60 * 60 * 24,        // X
        }                                       // X
    })                                          // X
);                                              // X
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// ✅ Added: Menu API Routes
app.post("/api/menu", async (req, res) => {
    try {
        const { name, price, description, image } = req.body;
        if (!name || !price || !description || !image) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newMenuItem = new Menu({ name, price, description, image });
        await newMenuItem.save();

        res.status(201).json({ message: "Menu item added successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

app.get("/api/menu", async (req, res) => {
    try {
        const menuItems = await Menu.find();
        res.status(200).json(menuItems);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
// ✅ End of Menu API Routes

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
const startServer = async () => {                                                // X
    try {                                                                        // X
        await connectDB();                                                       // X
        console.log("Connected to MongoDB");                                     // X
                                                                                 // X
        app.use("/", authRoutes);                                                // X
                                                                                 // X
        app.use("/", sessionHistoryRoutes);                                      // X
                                                                                 // X
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));   // X
    } catch (err) {                                                              // X
        console.error("Failed to start server:", err);                           // X
        process.exit(1);                                                         // X
    }                                                                            // X
};                                                                               // X
                                                                                 // X
startServer();                                                                   // X
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
