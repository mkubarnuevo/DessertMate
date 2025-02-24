const express = require("express");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const connectDB = require("./MONGODB DATABASE CONNECTION");

const router = express.Router();

let userAccountsCollection;

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// INITIALIZING CONNECTION TO THE DATABASE                          // X
const initDB = async () => {                                        // X
    const dbConnection = await connectDB();                         // X
    userAccountsCollection = dbConnection.userAccountsCollection;   // X
    console.log("UserAccounts Collection initialized");             // X
};                                                                  // X
initDB();                                                           // X
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// SIGNUP ROUTE =================================================================== // X
router.post("/signup", async (req, res) => {                                        // X
    const { username, email, password, phone, admin } = req.body;                   // X
                                                                                    // X
    if (!username || !email || !password || !phone) {                               // X
        return res.status(400).json({ message: "All fields are required" });        // X
    }                                                                               // X
                                                                                    // X
    try {                                                                           // X
        const userExists = await userAccountsCollection.findOne({ email });         // X
        if (userExists) {                                                           // X
            return res.status(400).json({ message: "Email already registered" });   // X
        }                                                                           // X
                                                                                    // X
        const hashedPassword = await bcrypt.hash(password, 10);                     // X
        const newUser = {                                                           // X
            username,                                                               // X
            email,                                                                  // X
            password: hashedPassword,                                               // X
            phone,                                                                  // X
            admin: admin || false,                                                  // X
        };                                                                          // X
                                                                                    // X
        await userAccountsCollection.insertOne(newUser);                            // X
        res.status(201).json({ message: "User registered successfully" });          // X
    } catch (err) {                                                                 // X
        res.status(500).json({ message: "Server error", error: err.message });      // X
    }                                                                               // X
});                                                                                 // X
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// LOGIN ROUTE ============================================================================ // X
router.post("/login", async (req, res) => {                                                 // X
    const { email, password } = req.body;                                                   // X
    console.log("Login attempt:", { email });                                               // X
                                                                                            // X
    if (!email || !password) {                                                              // X
        console.log("Missing email or password");                                           // X
        return res.status(400).json({ message: "All fields are required" });                // X
    }                                                                                       // X
                                                                                            // X
    try {                                                                                   // X
        const user = await userAccountsCollection.findOne({ email });                       // X
        console.log("User found in database:", user);                                       // X
                                                                                            // X
        if (!user) {                                                                        // X
            console.log("Invalid email");                                                   // X
            return res.status(401).json({ message: "Invalid email or password" });          // X
        }                                                                                   // X
                                                                                            // X
        const isPasswordValid = await bcrypt.compare(password, user.password);              // X
        console.log("Password match:", isPasswordValid);                                    // X
                                                                                            // X
        if (!isPasswordValid) {                                                             // X
            console.log("Invalid password");                                                // X
            return res.status(401).json({ message: "Invalid email or password" });          // X
        }                                                                                   // X
                                                                                            // X
        req.session.user = {                                                                // X
            _id: user._id,                                                                  // X
            email: user.email,                                                              // X
            username: user.username,                                                        // X
            phone: user.phone,                                                              // X
            admin: user.admin                                                               // X
        };                                                                                  // X
        console.log("Session after login:", req.session);                                   // X
                                                                                            // X
        res.status(200).json({ message: "Login successful", user: req.session.user });      // X
    } catch (err) {                                                                         // X
        console.error("Server error during login:", err);                                   // X
        res.status(500).json({ message: "Something went wrong, please try again later" });  // X
    }                                                                                       // X
});                                                                                         // X
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// LOGOUT FUNCTION ============================================================ // X
router.post("/logout", (req, res) => {                                          // X
    console.log("Session before destroy:", req.session);                        // X
                                                                                // X
    if (!req.session) {                                                         // X
        return res.status(400).json({ message: "No active session found." });   // X
    }                                                                           // X
                                                                                // X
    req.session.destroy(err => {                                                // X
        if (err) {                                                              // X
            return res.status(500).json({ message: "Logout failed!" });         // X
        }                                                                       // X
        res.json({ message: "Logged out successfully!" });                      // X
    });                                                                         // X
});                                                                             // X
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// GET USER BY ID ========================================================================= // X
router.get("/user/id/:id", async (req, res) => {                                            // X
    const userId = req.params.id;                                                           // X
                                                                                            // X
    try {                                                                                   // X
        const user = await userAccountsCollection.findOne({ _id: new ObjectId(userId) });   // X
                                                                                            // X
        if (!user) {                                                                        // X
            return res.status(404).json({ message: "User not found" });                     // X
        }                                                                                   // X
                                                                                            // X
        const { password: _, ...userWithoutPassword } = user;                               // X
        res.status(200).json(userWithoutPassword);                                          // X
    } catch (err) {                                                                         // X
        console.error("Error getting user by ID:", err);                                    // X
        res.status(500).json({ message: "Server error", error: err.message });              // X
    }                                                                                       // X
});                                                                                         // X
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// UPDATE USER PROFILE ======================================================================== // X
router.put("/update-profile/:id", async (req, res) => {                                         // X
    const userId = req.params.id;                                                               // X
    const { username, email, phone } = req.body;                                                // X
                                                                                                // X
    console.log("Updating profile for user ID:", userId);                                       // X
    console.log("Request body:", req.body);                                                     // X
                                                                                                // X
    if (!username || !email || !phone) {                                                        // X
        return res.status(400).json({ message: "All fields are required" });                    // X
    }                                                                                           // X
                                                                                                // X
    try {                                                                                       // X
        if (!ObjectId.isValid(userId)) {                                                        // X
            console.error("Invalid user ID:", userId);                                          // X
            return res.status(400).json({ message: "Invalid user ID format" });                 // X
        }                                                                                       // X
                                                                                                // X
        const updatedUser = await userAccountsCollection.findOneAndUpdate(                      // X
            { _id: new ObjectId(userId) },                                                      // X
            { $set: { username, email, phone } },                                               // X
            { returnDocument: "after" }                                                         // X
        );                                                                                      // X
                                                                                                // X
        if (!updatedUser) {                                                                     // X
            console.log("User not found during update.");                                       // X
            return res.status(404).json({ message: "User not found" });                         // X
        }                                                                                       // X
                                                                                                // X
        console.log("Profile updated successfully:", updatedUser);                              // X
        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });   // X
    } catch (err) {                                                                             // X
        console.error("Error updating profile:", err);                                          // X
        res.status(500).json({ message: "Server error", error: err.message });                  // X
    }                                                                                           // X
});                                                                                             // X
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

/*
// DELETE USER =========================================================================================
router.post("/delete-user", async (req, res) => {
    const { email } = req.body;

    console.log("Deleting user with email:", email);

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const result = await userAccountsCollection.deleteOne({ email });

        if (result.deletedCount === 0) {
            console.log("User not found during deletion.");
            return res.status(404).json({ message: "User not found" });
        }

        console.log("User deleted successfully.");
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});
*/

module.exports = router;