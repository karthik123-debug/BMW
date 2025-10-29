const express = require('express');
const router = express.Router(); // <--- FIX: Initialize router here
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const mongoose = require('mongoose');

// IMPORT MODELS
const User = require('../models/User'); 

// Secret key for JWT (Change this to a strong, unique value!)
const JWT_SECRET = 'your_super_secret_jwt_key_vahan_bazar_change_this_later'; 

// Helper function to check DB connection status
const isDbConnected = () => mongoose.connection.readyState === 1;

// @route POST /api/auth/register
// @desc Register a new user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!isDbConnected()) {
        return res.status(503).json({ success: false, message: 'Database Unavailable. Please try again later.' });
    }

    try {
        // 1. Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'This email address is already registered.' });
        }

        user = new User({ name, email, password });

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save(); // Save user to MongoDB

        // 3. Create and return JWT token for instant login
        const payload = { user: { id: user._id, name: user.name } };

        jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                 console.error("JWT Error:", err);
                 return res.status(500).json({ success: false, message: 'Server Error: Could not create authentication token.' }); 
            }
            res.status(201).json({ success: true, token, user: { name: user.name, email: user.email } }); 
        });

    } catch (err) {
        // Handle Mongoose/Database specific errors
        if (err.name === 'ValidationError') {
             console.error("Registration Failed: Validation Error:", err.message);
             return res.status(400).json({ success: false, message: `Validation failed: ${err.message}` });
        }
        if (err.code === 11000) { // MongoDB duplicate key error
             return res.status(400).json({ success: false, message: 'Duplicate key error (Email already registered).' });
        }
        
        console.error("Unhandled Registration Error:", err.message);
        res.status(500).json({ success: false, message: 'Internal Server Error during registration.' });
    }
});

// @route POST /api/auth/login
// @desc Authenticate user & get token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!isDbConnected()) {
        return res.status(503).json({ success: false, message: 'Database Unavailable. Cannot process login.' });
    }

    try {
        // 1. Find user by email (select('+password') is correct)
        let user = await User.findOne({ email }).select('+password'); 
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid Credentials (User not found)' });
        }

        // 2. Compare sent password with stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid Credentials (Password mismatch)' });
        }

        // 3. Send back JWT token
        const payload = { user: { id: user._id, name: user.name } };

        jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ success: true, token, user: { name: user.name, email: user.email } });
        });

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ success: false, message: 'Internal Server Error during login.' });
    }
});

module.exports = router;