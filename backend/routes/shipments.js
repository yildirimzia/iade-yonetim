const express = require('express');
const router = express.Router();
const {
  getShipments,
  getShipment,
  createShipment,
  updateShipment,
  deleteShipment,
  getShipmentStats
} = require('../controllers/shipmentsController');
const { protect, adminOnly } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Stats route (must be before /:id)
router.get('/stats', getShipmentStats);

// CRUD routes
router.route('/')
  .get(getShipments)
  .post(adminOnly, createShipment);

router.route('/:id')
  .get(getShipment)
  .put(adminOnly, updateShipment)
  .delete(adminOnly, deleteShipment);

module.exports = router;
