const express = require("express");
const session = require("express-session");
const cors = require("cors");
const MongoStore = require("connect-mongo");
const connectDB = require("./MONGODB DATABASE CONNECTION");
const authRoutes = require("./ACCOUNT AUTHENTICATION AND PROFILE.js");
const sessionHistoryRoutes = require("./SESSION HISTORY.js");

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
const app = express();                  // X
const PORT = 5500;                      // X
                                        // X
app.use(cors({                          // X
    origin: "http://127.0.0.1:5500",    // X
    credentials: true                   // X
}));                                    // X
app.use(express.json());                // X
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