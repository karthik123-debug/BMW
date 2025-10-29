const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Crucial for login validation
    },
    password: {
        type: String,
        required: true,
    },
    // Data structures for logged-in users (currently not implemented in routes yet)
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bike' // Links to the Bike model
    }],
    cart: [{
        bikeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bike' },
        quantity: { type: Number, default: 1 }
    }],
    created_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', UserSchema);