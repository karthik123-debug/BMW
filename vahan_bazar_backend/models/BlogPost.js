const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    excerpt: { type: String },
    imageUrl: { type: String },
    category: { type: String },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);