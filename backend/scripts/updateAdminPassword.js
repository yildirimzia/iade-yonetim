const bcrypt = require('bcryptjs');
const pool = require('../config/database');

async function updateAdminPassword() {
  try {
    const email = 'admin@iadeyonetim.com';
    const password = 'Admin123!';
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await pool.query(
      'UPDATE users SET password = $1 WHERE email = $2',
      [hashedPassword, email]
    );

    console.log('✅ Admin şifresi güncellendi!');
    console.log('📧 Email:', email);
    console.log('🔑 Şifre:', password);
    
    pool.end();
  } catch (error) {
    console.error('❌ Hata:', error.message);
    pool.end();
    process.exit(1);
  }
}

updateAdminPassword();
