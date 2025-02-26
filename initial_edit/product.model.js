const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter dessert name"]
        },

        price: {
            type: Number,
            required: true,
            default: 0
        },

        description: {
            type: String,
            required: [true, "Please add the description of the dessert"]
        },

        image: {
            type: String,
            required: [true, "Please upload the image of the dessert"]
        }
    },

    {
        timestamps: true,
    }


);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;