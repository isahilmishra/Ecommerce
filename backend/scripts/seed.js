const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const dns = require('dns');

// Configure DNS to use Google public DNS to avoid querySrv ECONNREFUSED errors
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Product = require('../models/Product');

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Read products data
    const productsPath = path.join(__dirname, '..', 'products.json');
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert all products
    const result = await Product.insertMany(productsData);
    console.log(`Successfully seeded ${result.length} products`);

    // Disconnect
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedProducts();
