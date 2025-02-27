const express = require("express");
const session = require("express-session");
const cors = require("cors");
const MongoStore = require("connect-mongo");
const connectDB = require("./MONGODB DATABASE CONNECTION");
const authRoutes = require("./ACCOUNT AUTHENTICATION AND PROFILE.js");
const sessionHistoryRoutes = require("./SESSION HISTORY.js");
const mongoose = require('mongoose');
const Product = require('./product.model.js'); 
const multer = require('multer'); 
const path = require('path'); 


// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
const app = express();                  // X
const PORT = 5500;                      // X
                                        // X
app.use(cors({                          // X
    origin: "http://127.0.0.1:5500",   // X
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


// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use('/uploads', express.static('uploads'));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });                                       
const handleAsync = (fn) => async (req, res) => {
    try {
        await fn(req, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

app.get('/api/products', handleAsync(async (req, res) => {
    res.status(200).json(await Product.find({}));
}));

app.get('/api/product/:id', handleAsync(async (req, res) => {
    res.status(200).json(await Product.findById(req.params.id));
}));

app.post('/api/products', upload.single('image'), handleAsync(async (req, res) => {
    try{
        console.log("file recieved: ", req.file);
        const { name, description } = req.body;
        const price = parseFloat(req.body.price);

        if (!name || !description || isNaN(price) || price <= 0 || !req.file) {
            return res.status(400).json({ message: "Invalid input. Please check all fields and upload an image." });
        }

        const image = `/uploads/${req.file.filename}`;

        const product = new Product({ name, price, description, image });
        await product.save();

        res.status(200).json({ ...product.toObject(), image: `http://localhost:5500${image}` });
    }catch(error){
        console.log("post product error: ", error);
        res.status(500).json({message: error.message});
    }

}));                                                 

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX