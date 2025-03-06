const express = require("express");
const session = require("express-session");
const cors = require("cors");
const MongoStore = require("connect-mongo");
const mongoose = require('mongoose');
const connectDB = require("./MONGODB DATABASE CONNECTION");
const authRoutes = require("./ACCOUNT AUTHENTICATION AND PROFILE.js");
const sessionHistoryRoutes = require("./SESSION HISTORY.js");
const Menu = require("./product.model.js");

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
const app = express();                  // X
const PORT = 5500;                      // X
                                        // X
app.use(cors({                          // X
    origin: "http://127.0.0.1:5500",    // X
    credentials: true                   // X
}));                                    // X
app.use(express.json({ limit: "10mb" }));
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

app.delete("/api/menu/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedItem = await Menu.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ message: "Menu item not found." });
        }

        res.status(200).json({ message: "Menu item deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

app.put("/api/menu/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description } = req.body;

        const updatedItem = await Menu.findByIdAndUpdate(id, { name, price, description }, { new: true });

        if (!updatedItem) {
            return res.status(404).json({ message: "Menu item not found." });
        }

        res.status(200).json({ message: "Menu item updated successfully.", updatedItem });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

async function getMenuItemsForChatbot() {
    try {
        await connectDB(); // Ensure connection is established.
        const collection = mongoose.connection.db.collection("menu"); // Directly access the "menu" collection.
        const menuItems = await collection.find({}).toArray(); // Fetch all documents.

        let formattedMenu = menuItems.map(item => {
            return `${item.name}: ₱${parseFloat(item.price).toFixed(2)}, ${item.description}`;
        }).join("\n");
        return formattedMenu;
    } catch (error) {
        console.error("Error fetching menu items for chatbot:", error);
        return "Sorry, I couldn't retrieve the menu right now.";
    }
}

// New endpoint specifically for chatbot menu access.
app.get("/api/chatbot/menus", async (req, res) => {
    try {
        await connectDB();
        const collection = mongoose.connection.db.collection("menus");
        const menuItems = await collection.find({}).toArray();

        let formattedMenu = menuItems.map(item => {
            return `${item.name}: ₱${item.price.toFixed(2)}, ${item.description}`; // Ensure price is formatted correctly
        }).join("\n");
        res.status(200).send(formattedMenu);
    } catch (error) {
        console.error("Error fetching menus items for chatbot:", error);
        res.status(500).send("Error fetching menus data.");
    }
});

app.get("/api/chatbot/products", async (req, res) => {
    try {
        await connectDB();
        const collection = mongoose.connection.db.collection("products");
        const productItems = await collection.find({}).toArray();

        let formattedProducts = productItems.map(item => {
            return `${item.name}: ₱${item.price.toFixed(2)}, ${item.description}`; // Ensure price is formatted correctly
        }).join("\n");
        res.status(200).send(formattedProducts);
    } catch (error) {
        console.error("Error fetching products items for chatbot:", error);
        res.status(500).send("Error fetching products data.");
    }
});

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
