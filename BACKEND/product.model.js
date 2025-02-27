const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    price: { 
        type: Number, 
        required: true, 
        min: [0, "Price must be a positive number"] 
    },
    description: { type: String, required: true, trim: true },
    image: { type: String, required: true } // Base64 or image URL
});

module.exports = mongoose.model("Menu", menuSchema);
