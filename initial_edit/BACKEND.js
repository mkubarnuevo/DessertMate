const express = require("express");
const session = require("express-session");
const cors = require("cors");
const MongoStore = require("connect-mongo");
const connectDB = require("./MONGODB DATABASE CONNECTION");
const authRoutes = require("./ACCOUNT AUTHENTICATION AND PROFILE.js");
const sessionHistoryRoutes = require("./SESSION HISTORY.js");
const mongose = require('mongoose');
const Product = require('./product.model.js'); 
const multer = require('multer'); 
const path = require('path'); 
const upload = multer({ storage: storage }); 



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


// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});



app.use(express.json());                 
app.use('/uploads', express.static('uploads'));
                                       
                                                                                // X
app.get('/api/products', async(req, res) => {                                   // X
                                                                                // X
    try {                                                                       // X
       const products = await Product.find({});                                 // X                              
       res.status(200).json(products);                                          // X
    }catch(error) {                                                             // X
        res.status(500).json({message: error.message});                         // X
    }                                                                           // X
});                                                                             // X
                                                                                // X
app.get('/api/product/:id', async(req, res) => {                                // X
                                                                                // X
    try{                                                                        // X
        const { id } = req.params;                                              // X
        const product = await Product.findById(id);                             // X
        res.status(200).json(product);                                          // X
    } catch(error) {                                                            // X
        res.status(500).json({message: error.message});                         // X
    }                                                                           // X
});                                                                             // X

app.post('/api/products', upload.single('image'), async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null; 

        const product = new Product({ name, price, description, image });
        await product.save();

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
                                



// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX