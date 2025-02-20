const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const { ObjectId } = require("mongodb");
const connectDB = require("./AUTHENTICATION");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const startServer = async () => {
    try {
        const { userAccountsCollection } = await connectDB();
        console.log("Connected to UserAccounts Collection");

        // SIGNUP ROUTE
        app.post("/signup", async (req, res) => {
            const { username, email, password, phone, admin } = req.body;

            if (!username || !email || !password || !phone) {
                return res.status(400).json({ message: "All fields are required" });
            }

            try {
                const userExists = await userAccountsCollection.findOne({ email });
                if (userExists) {
                    return res.status(400).json({ message: "Email already registered" });
                }

                const hashedPassword = await bcrypt.hash(password, 10);

                const newUser = {
                    username,
                    email,
                    password: hashedPassword,
                    phone,
                    admin: admin || false
                };

                await userAccountsCollection.insertOne(newUser);
                res.status(201).json({ message: "User registered successfully" });
            } catch (err) {
                res.status(500).json({ message: "Server error", error: err.message });
            }
        });

        // LOGIN ROUTE
        app.post("/login", async (req, res) => {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }

            try {
                const user = await userAccountsCollection.findOne({ email });
                if (!user) {
                    return res.status(401).json({ message: "Invalid email or password" });
                }

                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    return res.status(401).json({ message: "Invalid email or password" });
                }

                // Exclude password from response
                const { password: _, ...userWithoutPassword } = user;
                res.status(200).json({ message: "Login successful", user: userWithoutPassword });
            } catch (err) {
                res.status(500).json({ message: "Server error", error: err.message });
            }
        });

        // GET USER BY ID
        app.get("/user/id/:id", async (req, res) => {
            const userId = req.params.id;

            try {
                const user = await userAccountsCollection.findOne({ _id: new ObjectId(userId) });

                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }

                // Exclude password from response
                const { password: _, ...userWithoutPassword } = user;
                res.status(200).json(userWithoutPassword);
            } catch (err) {
                res.status(500).json({ message: "Server error", error: err.message });
            }
        });

        // UPDATE USER PROFILE
        app.put("/update-profile/:id", async (req, res) => {
            const userId = req.params.id;
            const { username, email, phone } = req.body;

            if (!username || !email || !phone) {
                return res.status(400).json({ message: "All fields are required" });
            }

            try {
                const updatedUser = await userAccountsCollection.findOneAndUpdate(
                    { _id: new ObjectId(userId) },
                    { $set: { username, email, phone } },
                    { returnDocument: "after" }
                );

                if (!updatedUser) {
                    return res.status(404).json({ message: "User not found" });
                }

                res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
            } catch (err) {
                res.status(500).json({ message: "Server error", error: err.message });
            }
        });

        //DELETE USER
        app.post("/delete-user", async (req, res) => {
            const { email } = req.body; // Get email from request body
        
            if (!email) {
                return res.status(400).json({ message: "Email is required" });
            }
        
            try {
                const result = await userAccountsCollection.deleteOne({ email });
        
                if (result.deletedCount === 0) {
                    return res.status(404).json({ message: "User not found" });
                }
        
                res.status(200).json({ message: "User deleted successfully" });
            } catch (err) {
                res.status(500).json({ message: "Server error", error: err.message });
            }
        });
        
        // START SERVER
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
};

startServer();
