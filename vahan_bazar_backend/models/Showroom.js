const mongoose = require('mongoose');

const ShowroomSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    city: { type: String, required: true, index: true },
    address: { type: String },
    phone: { type: String },
    
    // Showroom specific data
    brands: [{ type: String }], 
    mapUrl: { type: String },
    imageUrl: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    openingHours: { type: String },
});

module.exports = mongoose.model('Showroom', ShowroomSchema);