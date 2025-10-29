// vahan_bazar_backend/routes/user.js

const express = require('express');
const router = express.Router();
// const auth = require('../middleware/auth'); // Middleware removed
const User = require('../models/User'); 
const Bike = require('mongoose').model('Bike'); // Direct Mongoose access
const mongoose = require('mongoose'); 

// @route GET /api/users/me
// @desc Get the currently logged-in user's profile and data
// Access: **TEMPORARILY UNPROTECTED**
router.get('/me', async (req, res) => {
    // NOTE: In a real app, you MUST authenticate the user first.
    // For DEMO purposes, this is currently unprotected.
    
    // In a final app: const userId = req.user.id; 
    const demoUserId = '66d03423b0a2944b20756770'; // Placeholder ID for debugging/testing unprotected routes

    try {
        const user = await User.findById(demoUserId)
            .select('-password')
            .populate('wishlist', ['title', 'brand', 'price', 'img']) 
            .populate('cart.bikeId', ['title', 'price']);

        if (!user) {
            // Return a simple guest user if DB is empty, or throw 404
            return res.status(404).json({ msg: 'Demo User profile not found. Please register first.' });
        }
        res.json({ success: true, user });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route POST /api/users/wishlist/toggle
// @desc Add or remove a bike from the logged-in user's wishlist
// Access: **TEMPORARILY UNPROTECTED**
router.post('/wishlist/toggle', async (req, res) => {
    const { bikeId, action } = req.body; 
    const demoUserId = '66d03423b0a2944b20756770'; // Placeholder ID

    if (!mongoose.Types.ObjectId.isValid(bikeId)) {
        return res.status(400).json({ msg: 'Invalid Bike ID format.' });
    }

    try {
        let update = {};

        if (action === 'add') {
            update = { $addToSet: { wishlist: bikeId } };
        } else if (action === 'remove') {
            update = { $pull: { wishlist: bikeId } };
        } else {
            return res.status(400).json({ msg: 'Invalid action parameter. Must be "add" or "remove".' });
        }

        const user = await User.findByIdAndUpdate(
            demoUserId, // Using static ID here, MUST be replaced with req.user.id
            update,
            { new: true } 
        );

        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        res.json({ success: true, wishlist: user.wishlist, msg: `Wishlist updated successfully.` });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during wishlist update.');
    }
});

// --- NEW ROUTE: Add to Cart ---
// @route POST /api/users/cart/add
// @desc Add a new item to the user's cart
// Access: **TEMPORARILY UNPROTECTED**
router.post('/cart/add', async (req, res) => {
    const { bikeId, quantity = 1 } = req.body;
    const demoUserId = '66d03423b0a2944b20756770'; // Placeholder ID

    if (!mongoose.Types.ObjectId.isValid(bikeId)) {
        return res.status(400).json({ msg: 'Invalid Bike ID format.' });
    }

    try {
        // Simple logic to add an item to the cart array
        const user = await User.findByIdAndUpdate(
            demoUserId,
            { $push: { cart: { bikeId, quantity } } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        res.json({ success: true, cart: user.cart, msg: 'Item added to cart successfully.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error adding item to cart.');
    }
});


module.exports = router;