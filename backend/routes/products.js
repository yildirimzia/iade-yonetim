const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getStats,
  updateProductStatus
} = require('../controllers/productsController');
const { protect, sellerOrAdmin, adminOnly } = require('../middleware/auth');
const pool = require('../config/database');

// All routes require authentication
router.use(protect);

// Special route for stats (must be before /:id)
router.get('/stats', getStats);

// Special route for categories (must be before /:id)
router.get('/categories', getCategories);

// Admin: Get all products
router.get('/all', sellerOrAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.name as seller_name, u.company 
       FROM products p
       LEFT JOIN users u ON p.seller_id = u.id
       ORDER BY p.created_at DESC`
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Ürünler getirilirken hata oluştu.'
    });
  }
});

// CRUD routes
router.route('/')
  .get(getProducts)
  .post(sellerOrAdmin, createProduct);

router.route('/:id')
  .get(getProduct)
  .put(sellerOrAdmin, updateProduct)
  .delete(sellerOrAdmin, deleteProduct);

// Admin only: Update product status
router.patch('/:id/status', updateProductStatus);

module.exports = router;
