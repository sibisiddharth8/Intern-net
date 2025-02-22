const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const fs = require('fs');
const path = require('path');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding');

    const adminSeedPath = path.join(__dirname, 'adminSeed.json');
    if (!fs.existsSync(adminSeedPath)) {
      console.log('Admin seed file not found.');
      process.exit(1);
    }
    const adminData = JSON.parse(fs.readFileSync(adminSeedPath, 'utf-8'));
    // Check if admin already exists
    let admin = await User.findOne({ email: adminData.email });
    if (admin) {
      console.log('Admin already exists. Exiting seeder.');
      process.exit();
    }
    admin = await User.create({ 
      email: adminData.email, 
      password: adminData.password, 
      role: 'admin', 
      name: adminData.name || 'Admin' 
    });
    console.log('Admin created:', admin.email);
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
