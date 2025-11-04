const express = require('express');
const router = express.Router();
const {
  getReturns,
  getReturn,
  createReturn,
  updateReturn,
  deleteReturn,
  getStats
} = require('../controllers/returnsController');
const { protect, adminOnly } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Stats route (must be before /:id)
router.get('/stats', getStats);

// CRUD routes
router.route('/')
  .get(getReturns)
  .post(adminOnly, createReturn);

router.route('/:id')
  .get(getReturn)
  .put(updateReturn)
  .delete(adminOnly, deleteReturn);

module.exports = router;
