const mongoose = require('mongoose');

const UpcomingBikeSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    brand: { type: String, required: true },
    img: { type: String, required: true },
    launchStatus: { type: String, default: 'Coming Soon...' },
    expectedLaunch: { type: Date } 
});

module.exports = mongoose.model('UpcomingBike', UpcomingBikeSchema);