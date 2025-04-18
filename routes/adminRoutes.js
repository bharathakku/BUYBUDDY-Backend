const express = require('express');
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
} = require('../controllers/adminController');
const { getAllOrders } = require('../controllers/orderController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const User = require('../models/User');

// Admin register & login
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Get all users (admin only)
router.get('/users', protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get all orders (admin only)
router.get('/orders', protect, isAdmin, getAllOrders);

module.exports = router;
