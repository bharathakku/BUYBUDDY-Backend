const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createProductReview  
} = require('../controllers/productController');

const { protect, isAdmin } = require('../middleware/authMiddleware');

// Public Route
router.get('/', getAllProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

// Admin Routes
router.post('/', protect, isAdmin, createProduct);       
router.put('/:id', protect, isAdmin, updateProduct);     
router.delete('/:id', protect, isAdmin, deleteProduct);    

// Public Routes
router.get('/', getAllProducts);               
router.get('/:id', getProductById);                

// Reviews (protected)
router.post('/:id/reviews', protect, createProductReview);

module.exports = router;
