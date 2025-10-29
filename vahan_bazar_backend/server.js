const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Needed for initial user hash

const app = express();
const PORT = 3001; 
const MONGO_URI = 'mongodb+srv://royalsaireddy494_db_user:VqvQvzVKdYigxFlf@vahanbazarcluster.nql2ntr.mongodb.net/?appName=VahanBazarCluster'; 

// --- Mongoose Model Imports ---
let Bike, Showroom, UpcomingBike, Service, BlogPost, SellStep, FinanceOption, User;

try {
    Bike = require('./models/Bike'); 
    Showroom = require('./models/Showroom');
    UpcomingBike = require('./models/UpcomingBike');
    Service = require('./models/Service');
    BlogPost = require('./models/BlogPost');
    SellStep = require('./models/SellStep');
    FinanceOption = require('./models/FinanceOption');
    User = require('./models/User'); 
} catch (error) {
    console.warn("⚠️ WARNING: Mongoose Model files missing or corrupt.");
}

// --- TEMPORARY STATIC DATA (FALLBACK & POPULATION SOURCE) ---
const sampleBikes = [ /* ... (your full data here) ... */ ]; 
const showroomsData = [ /* ... (your full data here) ... */ ];
const upcomingBikes = [ { id: 101, title: 'Vida V2', brand: 'Hero Vida', img: '...', launchStatus: 'Coming Soon...' }, ];
const servicesData = [ { id: 's1', title: 'Bike Servicing', description: 'Get your bike serviced.', iconSvg: '' }, ];
const blogPostsData = [ { id: 'b1', title: 'Top 5 Commuter Bikes', excerpt: 'Reliable choices.', imageUrl: '...', category: 'Reviews', date: new Date() }, ];
const sellBikeStepsData = [ { id: 'sb1', stepNumber: 1, title: '1. Submit Details', description: 'Fill a simple form.', iconSvg: '' }, ];
const financeOptionsData = [ { id: 'f1', title: 'Zero Down Payment', description: 'Ride home your dream bike.', iconSvg: '' }, ];

// --- DEBUG: ADD ONE TEST USER FOR POPULATION ---
const testUserData = { 
    name: 'Test Admin', 
    email: 'admin@test.com', 
    // This password will be hashed and saved
    password: 'password123', 
};


// --- INITIAL DATABASE POPULATION FUNCTION (FIXED) ---
const populateDatabase = async () => {
    try {
        console.log('--- Checking Database Collections ---');
        
        // Populate standard content (Bikes, Showrooms, etc.)
        if ((await Bike.countDocuments()) === 0) { await Bike.insertMany(sampleBikes.map(b => ({...b, specs: b.specs || {}}))); console.log('Populated Bikes.'); }
        if ((await Showroom.countDocuments()) === 0) { await Showroom.insertMany(showroomsData); console.log('Populated Showrooms.'); }
        if ((await UpcomingBike.countDocuments()) === 0) { await UpcomingBike.insertMany(upcomingBikes); console.log('Populated Upcoming Bikes.'); }
        if ((await Service.countDocuments()) === 0) { await Service.insertMany(servicesData); console.log('Populated Services.'); }
        if ((await BlogPost.countDocuments()) === 0) { await BlogPost.insertMany(blogPostsData); console.log('Populated Blog Posts.'); }
        if ((await SellStep.countDocuments()) === 0) { await SellStep.insertMany(sellBikeStepsData); console.log('Populated Sell Steps.'); }
        if ((await FinanceOption.countDocuments()) === 0) { await FinanceOption.insertMany(financeOptionsData); console.log('Populated Finance Options.'); }
        
        // --- CRITICAL USER POPULATION CHECK ---
        if ((await User.countDocuments()) === 0) {
            console.log('Populating Initial User...');
            
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(testUserData.password, salt);

            await User.create({
                name: testUserData.name,
                email: testUserData.email,
                // Must be saved as the HASHED password!
                password: hashedPassword, 
            });
            console.log(`✅ Initial user (${testUserData.email}) created.`);
        }
        
        console.log('✅ Database check and initial population complete.');

    } catch (error) {
        console.error('❌ CRITICAL ERROR: Initial population failed. Check data structure and model imports.', error);
    }
};


// --- DATABASE CONNECTION ---
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB successfully connected');
        populateDatabase(); // Run population script after successful connection
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); 
    });
// --- END DATABASE CONNECTION ---


// --- MIDDLEWARE ---
app.use(cors()); 
app.use(express.json()); 

// --- CONNECT ROUTE FILES ---
const AuthRoutes = require('./routes/auth'); 
app.use('/api/auth', AuthRoutes); 
const UserRoutes = require('./routes/user'); 
app.use('/api/users', UserRoutes); 


// --- API ENDPOINTS (Mongoose find() queries) ---

// 1. Get All Bikes (for Listings)
app.get('/api/bikes', async (req, res) => {
    try {
        const bikes = await Bike.find({});
        res.json(bikes); 
    } catch (error) { res.status(500).json({ message: "Error fetching bikes." }); }
});

// ... (Other GET endpoints remain the same, using find() on their respective Models) ...

// 2. Get All Showrooms
app.get('/api/showrooms', async (req, res) => {
    try {
        const showrooms = await Showroom.find({});
        res.json(showrooms);
    } catch (error) { res.status(500).json({ message: "Error fetching showrooms." }); }
});

// 3. Get All Upcoming Bikes
app.get('/api/upcoming', async (req, res) => {
    try {
        const upcoming = await UpcomingBike.find({});
        res.json(upcoming);
    } catch (error) { res.status(500).json({ message: "Error fetching upcoming bikes." }); }
});

// 4. Get All Services
app.get('/api/services', async (req, res) => {
    try {
        const services = await Service.find({});
        res.json(services);
    } catch (error) { res.status(500).json({ message: "Error fetching services." }); }
});

// 5. Get All Blog Posts
app.get('/api/blog', async (req, res) => {
    try {
        const blogPosts = await BlogPost.find({});
        res.json(blogPosts);
    } catch (error) { res.status(500).json({ message: "Error fetching blog posts." }); }
});

// 6. Get Sell Bike Steps
app.get('/api/sell-steps', async (req, res) => {
    try {
        const steps = await SellStep.find({});
        res.json(steps);
    } catch (error) { res.status(500).json({ message: "Error fetching sell steps." }); }
});

// 7. Get Finance Options
app.get('/api/finance-options', async (req, res) => {
    try {
        const options = await FinanceOption.find({});
        res.json(options);
    } catch (error) { res.status(500).json({ message: "Error fetching finance options." }); }
});


// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});