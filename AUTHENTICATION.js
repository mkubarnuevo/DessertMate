const mongoose = require("mongoose");

const mongoURI = "mongodb+srv://mkubarnuevo:userpassword234@schoolproject.rhlaw.mongodb.net/";
const DATABASE_NAME = "DessertShopProject";

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(mongoURI);

        console.log("MongoDB Connected...");

        const db = connection.connection.useDb(DATABASE_NAME);
        const userAccountsCollection = db.collection("UserAccounts");

        return { db, userAccountsCollection };
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
