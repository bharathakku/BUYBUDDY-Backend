const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getOrderById , updateOrderToPaid, updateOrderToDelivered, } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');



router.post('/', protect, addOrderItems); 
router.get('/myorders', protect, getMyOrders); 
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/deliver', protect, updateOrderToDelivered);

module.exports = router;
