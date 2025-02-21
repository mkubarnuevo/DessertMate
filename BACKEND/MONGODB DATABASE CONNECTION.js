const mongoose = require("mongoose");

const mongoURI = "mongodb+srv://mkubarnuevo:userpassword234@schoolproject.rhlaw.mongodb.net/";
const DATABASE_NAME = "DessertShopProject";

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(mongoURI);

        console.log("MongoDB Connected from MONGODB DATABASE CONNECTION.js...");

        const db = connection.connection.useDb(DATABASE_NAME);
        const userAccountsCollection = db.collection("UserAccounts");
        const dessertMenuCollection = db.collection("Menu");
        const sessionHistory = db.collection("SessionHistory")

        return { db, userAccountsCollection, dessertMenuCollection, sessionHistory };
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;