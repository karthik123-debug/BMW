const mongoose = require('mongoose');

const SellStepSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    stepNumber: { type: Number, required: true }, 
    title: { type: String, required: true },
    description: { type: String },
    iconSvg: { type: String }, 
});

module.exports = mongoose.model('SellStep', SellStepSchema);