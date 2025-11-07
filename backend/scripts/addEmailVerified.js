const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'iade_yonetim',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

async function addEmailVerifiedColumn() {
  try {
    console.log('🔧 email_verified sütunu ekleniyor...');
    
    // Add email_verified column to users table
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE
    `);
    
    console.log('✅ email_verified sütunu eklendi!');
    
    // Create verification_codes table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS verification_codes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        code VARCHAR(6) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ verification_codes tablosu kontrol edildi!');
    
    // Create index
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_verification_codes_user 
      ON verification_codes(user_id)
    `);
    
    console.log('✅ İndeks oluşturuldu!');
    console.log('\n🎉 Tüm değişiklikler başarıyla uygulandı!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
}

addEmailVerifiedColumn();
