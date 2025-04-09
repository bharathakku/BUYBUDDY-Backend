const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');
const products = require('./data/products');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Product.deleteMany(); // Clear existing
    await Product.insertMany(products); // Insert new
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
};

importData();
