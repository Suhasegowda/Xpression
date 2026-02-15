const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
        default: 0
    },
    category: {
        type: String, // Storing category name for simplicity, or could be ObjectId
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    sizes: [{
        size: {
            type: String,
            required: true,
            enum: ['S', 'M', 'L', 'XL', 'XXL']
        },
        stock: {
            type: Number,
            required: true,
            default: 0
        }
    }],
    images: {
        type: [String], // Array of URL strings
        required: true,
        default: []
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    totalSold: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
