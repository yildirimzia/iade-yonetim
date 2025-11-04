const express = require('express');
const router = express.Router();
const {
  getInventory,
  getInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryStats,
  getLocations
} = require('../controllers/inventoryController');
const { protect, adminOnly } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(protect);
router.use(adminOnly);

// Special routes (must be before /:id)
router.get('/stats', getInventoryStats);
router.get('/locations', getLocations);

// CRUD routes
router.route('/')
  .get(getInventory);

router.route('/:id')
  .get(getInventoryItem)
  .put(updateInventoryItem)
  .delete(deleteInventoryItem);

module.exports = router;
