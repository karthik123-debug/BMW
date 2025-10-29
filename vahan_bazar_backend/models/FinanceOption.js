const mongoose = require('mongoose');

const FinanceOptionSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    iconSvg: { type: String }, 
});

module.exports = mongoose.model('FinanceOption', FinanceOptionSchema);