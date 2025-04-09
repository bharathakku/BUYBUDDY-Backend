const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProductById , updateProduct, deleteProduct, getCategories} = require('../controllers/productController');

const { protect } = require('../middleware/authMiddleware');

router.get('/categories', getCategories);
router.post('/', protect, createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);


module.exports = router;
