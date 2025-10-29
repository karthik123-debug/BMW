const mongoose = require('mongoose');

const BikeSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true }, 
    title: { type: String, required: true },
    brand: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    
    km: { type: Number, default: 0 },
    fuel: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'], default: 'Petrol' },
    location: { type: String, index: true },
    condition: { type: String, enum: ['New', 'Used'], default: 'New' },
    year: { type: Number, required: true },
    img: { type: String, required: true }, // URL for the image

    // Specifications (Nested Object)
    specs: {
        engine: { type: String },
        power: { type: String },
        mileage: { type: String },
        brakes: { type: String },
    },
    
    date_added: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bike', BikeSchema);