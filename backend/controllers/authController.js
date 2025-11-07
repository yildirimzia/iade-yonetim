const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { generateOTP, sendVerificationEmail } = require('../config/email');
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

// @desc    Check if email exists
// @route   POST /api/auth/check-email
// @access  Public
const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email gereklidir.'
      });
    }

    const result = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    res.json({
      success: true,
      exists: result.rows.length > 0
    });
  } catch (error) {
    console.error('Check email error:', error);
    res.status(500).json({
      success: false,
      message: 'Email kontrolü sırasında bir hata oluştu.'
    });
  }
};

// @desc    Register new user (seller)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { email, password, name, phone, company } = req.body;

    console.log('📝 Register request:', { email, name, phone, company });

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen tüm zorunlu alanları doldurun.'
      });
    }

    // Check if user exists
    console.log('🔍 Checking if user exists...');
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
    console.log('🔐 Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user (default role: seller, email_verified: false)
    console.log('👤 Creating user...');
    const result = await pool.query(
      `INSERT INTO users (email, password, name, phone, company, role, email_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, name, phone, company, role, email_verified, created_at`,
      [email, hashedPassword, name, phone || null, company || null, 'seller', false]
    );

    const user = result.rows[0];
    console.log('✅ User created:', user.id);

    // Generate OTP code
    console.log('🔢 Generating OTP...');
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // IMPORTANT: Print code to console for development
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 VERIFICATION CODE FOR:', email);
    console.log('🔑 CODE:', code);
    console.log('⏰ Expires in 15 minutes');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    // Save verification code to database
    console.log('💾 Saving verification code...');
    await pool.query(
      `INSERT INTO verification_codes (user_id, code, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, code, expiresAt]
    );

    // Send verification email (non-blocking, continue even if email fails)
    try {
      await sendVerificationEmail(email, code, name);
      console.log('✅ Verification email sent to:', email);
    } catch (emailError) {
      console.error('⚠️ Email send failed (non-critical):', emailError.message);
      console.log('💡 Use the code printed above to verify your email');
    }

    // DON'T generate token yet - user must verify email first
    // Return success but no token
    res.status(201).json({
      success: true,
      message: 'Kayıt başarılı! E-postanıza gönderilen doğrulama kodunu girin.',
      data: {
        email: user.email,
        requiresVerification: true
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
      message: 'Giriş sırasında bir hata oluştu.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
      message: 'Şifre değiştirme sırasında bir hata oluştu.'
    });
  }
};

// @desc    Verify email with OTP code
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'E-posta ve kod gereklidir.'
      });
    }

    // Get user
    const userResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı.'
      });
    }

    const userId = userResult.rows[0].id;

    // Check verification code
    const codeResult = await pool.query(
      `SELECT * FROM verification_codes 
       WHERE user_id = $1 AND code = $2 AND verified = false AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [userId, code]
    );

    if (codeResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz veya süresi dolmuş kod.'
      });
    }

    // Mark code as verified
    await pool.query(
      'UPDATE verification_codes SET verified = true WHERE id = $1',
      [codeResult.rows[0].id]
    );

    // Update user email_verified status
    await pool.query(
      'UPDATE users SET email_verified = true WHERE id = $1',
      [userId]
    );

    // Get full user details
    const userDetails = await pool.query(
      'SELECT id, email, name, phone, company, role, email_verified FROM users WHERE id = $1',
      [userId]
    );

    const user = userDetails.rows[0];

    // Generate token after successful verification
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'E-posta başarıyla doğrulandı.',
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
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      message: 'E-posta doğrulama sırasında bir hata oluştu.'
    });
  }
};

// @desc    Resend verification code
// @route   POST /api/auth/resend-code
// @access  Public
const resendCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'E-posta gereklidir.'
      });
    }

    // Get user
    const userResult = await pool.query(
      'SELECT id, name, email_verified FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı.'
      });
    }

    const user = userResult.rows[0];

    if (user.email_verified) {
      return res.status(400).json({
        success: false,
        message: 'E-posta zaten doğrulanmış.'
      });
    }

    // Generate new OTP code
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save new verification code
    await pool.query(
      `INSERT INTO verification_codes (user_id, code, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, code, expiresAt]
    );

    // Send verification email
    await sendVerificationEmail(email, code, user.name);

    res.json({
      success: true,
      message: 'Doğrulama kodu tekrar gönderildi.'
    });
  } catch (error) {
    console.error('Resend code error:', error);
    res.status(500).json({
      success: false,
      message: 'Kod gönderme sırasında bir hata oluştu.'
    });
  }
};

module.exports = {
  checkEmail,
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  verifyEmail,
  resendCode
};
