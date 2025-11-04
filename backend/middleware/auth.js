const jwt = require('jsonwebtoken');
require('dotenv').config();

// Protect routes - JWT token verification
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Add user info to request
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      };

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Geçersiz token. Lütfen tekrar giriş yapın.'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Erişim reddedildi. Token bulunamadı.'
    });
  }
};

// Admin only middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Bu işlem için admin yetkisi gereklidir.'
    });
  }
};

// Seller or Admin middleware
const sellerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'seller' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Bu işlem için seller veya admin yetkisi gereklidir.'
    });
  }
};

module.exports = { protect, adminOnly, sellerOrAdmin };
