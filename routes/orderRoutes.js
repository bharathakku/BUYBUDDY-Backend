const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  updatePaymentStatus,
} = require('../controllers/orderController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Create a new order User only
router.post('/', protect, addOrderItems);

// Get current user's orders
router.get('/myorders', protect, getMyOrders);

// Update payment status User
router.put('/:id/pay', protect, updateOrderToPaid);

// Update delivery status Admin only
router.put('/:id/deliver', protect, isAdmin, updateOrderToDelivered);

// Get order by ID User or Admin
router.get('/:id', protect, getOrderById);


router.post('/update-payment-status', protect, updatePaymentStatus);


module.exports = router;
