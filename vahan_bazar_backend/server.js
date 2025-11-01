const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI || 'your-local-or-default-uri-here';

app.use(cors());
app.use(express.json());

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
  console.warn('⚠️ WARNING: Model imports failed:', error.message);
}

const sampleBikes = [];
const showroomsData = [];
const upcomingBikes = [];
const servicesData = [];
const blogPostsData = [];
const sellBikeStepsData = [];
const financeOptionsData = [];

const testUserData = {
  name: 'Test Admin',
  email: 'admin@test.com',
  password: 'password123',
};

const populateDatabase = async () => {
  try {
    if (Bike && (await Bike.countDocuments()) === 0) {
      await Bike.insertMany(sampleBikes);
      console.log(' Bikes populated');
    }

    if (User && (await User.countDocuments()) === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(testUserData.password, salt);
      await User.create({
        name: testUserData.name,
        email: testUserData.email,
        password: hashedPassword,
      });
      console.log(` Initial user (${testUserData.email}) created.`);
    }

    console.log(' Database initialization complete.');
  } catch (err) {
    console.error(' Population error:', err.message);
  }
};

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    populateDatabase();
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

try {
  const AuthRoutes = require('./routes/auth');
  const UserRoutes = require('./routes/user');
  app.use('/api/auth', AuthRoutes);
  app.use('/api/users', UserRoutes);
} catch (err) {
  console.warn('⚠️ Route files missing or invalid:', err.message);
}

app.get('/api/bikes', async (req, res) => {
  try {
    const bikes = await Bike.find({});
    res.json(bikes);
  } catch {
    res.status(500).json({ message: 'Error fetching bikes.' });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
