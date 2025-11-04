const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
} = require('../controllers/productsController');
const { protect, sellerOrAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Special route for categories (must be before /:id)
router.get('/categories', getCategories);

// CRUD routes
router.route('/')
  .get(getProducts)
  .post(sellerOrAdmin, createProduct);

router.route('/:id')
  .get(getProduct)
  .put(sellerOrAdmin, updateProduct)
  .delete(sellerOrAdmin, deleteProduct);

module.exports = router;
