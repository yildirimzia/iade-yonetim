const express = require('express');
const router = express.Router();
const {
  checkEmail,
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  verifyEmail,
  resendCode
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/check-email', checkEmail);
router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/resend-code', resendCode);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
