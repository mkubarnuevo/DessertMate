const express = require("express");
const connectDB = require("./AUTHENTICATION");

const app = express();
const PORT = 3000;

app.use(express.json());

const startServer = async () => {
    try {
        const { userAccountsCollection } = await connectDB();
        console.log("Connected to UserAccounts Collection");

        //PLACEHOLDER FOR SIGNUP
        app.post("/signup", async (req, res) => {
            //EDIT HERE FOR LOGIN
            res.send("HELLOW WORLD");
        });

        //PLACEHOLDER FOR LOGIN
        app.post("/login", async (req, res) => {
            //EDIT HERE FOR LOGIN
            res.send("HELLOW WORLD");
        });

        //this starts server
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
};

startServer();
