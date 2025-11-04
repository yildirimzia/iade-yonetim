const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  getUserStats
} = require('../controllers/usersController');
const { protect, adminOnly } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(protect);
router.use(adminOnly);

// Stats route (must be before /:id)
router.get('/stats', getUserStats);

// CRUD routes
router.get('/', getAllUsers);
router.get('/:id', getUserById);

module.exports = router;
