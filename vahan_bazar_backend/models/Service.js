const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, 
    title: { type: String, required: true },
    description: { type: String },
    iconSvg: { type: String }, // Stores SVG data for icons
});

module.exports = mongoose.model('Service', ServiceSchema);