const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
require('dotenv').config();

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    }
  );
};

// @desc    Register new user (seller)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { email, password, name, phone, company } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen tüm zorunlu alanları doldurun.'
      });
    }

    // Check if user exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Bu email adresi zaten kullanılıyor.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user (default role: seller)
    const result = await pool.query(
      `INSERT INTO users (email, password, name, phone, company, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, name, phone, company, role, created_at`,
      [email, hashedPassword, name, phone || null, company || null, 'seller']
    );

    const user = result.rows[0];

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Kayıt başarılı!',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          company: user.company,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Kayıt sırasında bir hata oluştu.'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email ve şifre gereklidir.'
      });
    }

    // Check if user exists
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz email veya şifre.'
      });
    }

    const user = result.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz email veya şifre.'
      });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Giriş başarılı!',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          company: user.company,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Giriş sırasında bir hata oluştu.'
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, phone, company, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı.'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Profil bilgileri alınırken hata oluştu.'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, phone, company } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET name = COALESCE($1, name),
           phone = COALESCE($2, phone),
           company = COALESCE($3, company)
       WHERE id = $4
       RETURNING id, email, name, phone, company, role`,
      [name, phone, company, req.user.id]
    );

    res.json({
      success: true,
      message: 'Profil güncellendi.',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Profil güncellenirken hata oluştu.'
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mevcut şifre ve yeni şifre gereklidir.'
      });
    }

    // Get user
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [req.user.id]
    );

    const user = result.rows[0];

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Mevcut şifre yanlış.'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, req.user.id]
    );

    res.json({
      success: true,
      message: 'Şifre başarıyla değiştirildi.'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Şifre değiştirilirken hata oluştu.'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
};
