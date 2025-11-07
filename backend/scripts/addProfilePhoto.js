const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'iade_yonetim',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

async function addProfilePhotoColumn() {
  try {
    console.log('🔧 profile_photo sütunu ekleniyor...');
    
    // Add profile_photo column to users table
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS profile_photo TEXT
    `);
    
    console.log('✅ profile_photo sütunu eklendi!');
    console.log('\n🎉 Kullanıcılar artık profil fotoğrafı yükleyebilir!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
}

addProfilePhotoColumn();
