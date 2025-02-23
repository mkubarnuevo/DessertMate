// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
const mongoose = require("mongoose");                                                           // X
                                                                                                // X
const mongoURI = "mongodb+srv://mkubarnuevo:userpassword234@schoolproject.rhlaw.mongodb.net/";  // X
const DATABASE_NAME = "DessertShopProject";                                                     // X
                                                                                                // X
const connectDB = async () => {                                                                 // X
    try {                                                                                       // X
        const connection = await mongoose.connect(mongoURI);                                    // X
                                                                                                // X
        console.log("MongoDB Connected from MONGODB DATABASE CONNECTION.js...");                // X
                                                                                                // X
        const db = connection.connection.useDb(DATABASE_NAME);                                  // X
        const userAccountsCollection = db.collection("UserAccounts");                           // X
        const dessertMenuCollection = db.collection("Menu");                                    // X
        const sessionHistory = db.collection("SessionHistory")                                  // X
                                                                                                // X
        return { db, userAccountsCollection, dessertMenuCollection, sessionHistory };           // X
    } catch (error) {                                                                           // X
        console.error("MongoDB Connection Error:", error.message);                              // X
        process.exit(1);                                                                        // X
    }                                                                                           // X
};                                                                                              // X
                                                                                                // X
module.exports = connectDB;                                                                     // X
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX