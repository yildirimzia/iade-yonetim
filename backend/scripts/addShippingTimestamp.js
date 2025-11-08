const pool = require('../config/database');

async function addUpdatedAt() {
  try {
    console.log('updated_at kolonu ekleniyor...');

    await pool.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);

    console.log('✅ updated_at kolonu eklendi!');

    // Mevcut kayıtlara created_at değerini ata
    await pool.query(`
      UPDATE products 
      SET updated_at = created_at 
      WHERE updated_at IS NULL;
    `);

    console.log('✅ Mevcut kayıtlar güncellendi!');

    pool.end();
  } catch (error) {
    console.error('❌ Hata:', error.message);
    pool.end();
    process.exit(1);
  }
}

addUpdatedAt();