const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { 
  getAllUsers, 
  getUserById 
} = require('../controllers/usersController');
const { protect, adminOnly } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(protect);
router.use(adminOnly);

// CRUD routes
router.get('/', getAllUsers);
router.get('/:id', getUserById);

// Get user's products
router.get('/:id/products', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT * FROM products WHERE seller_id = $1 ORDER BY created_at DESC`,
      [id]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get user products error:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcı ürünleri getirilirken hata oluştu.'
    });
  }
});

module.exports = router;
