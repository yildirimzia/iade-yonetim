const pool = require('../config/database');

async function addShippingColumns() {
  try {
    console.log('Kargo kolonları ekleniyor...');

    // Önce mevcut kolonları kontrol et
    const checkColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products' 
      AND column_name LIKE 'shipping_%'
    `);

    console.log('Mevcut kargo kolonları:', checkColumns.rows);

    // Kolonları ekle (eğer yoksa)
    await pool.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS shipping_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS shipping_phone VARCHAR(50),
      ADD COLUMN IF NOT EXISTS shipping_address TEXT,
      ADD COLUMN IF NOT EXISTS shipping_city VARCHAR(100),
      ADD COLUMN IF NOT EXISTS shipping_postal_code VARCHAR(20),
      ADD COLUMN IF NOT EXISTS shipping_country VARCHAR(100)
    `);

    console.log('✅ Kargo kolonları başarıyla eklendi!');

    // Güncel kolonları göster
    const allColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products'
      ORDER BY ordinal_position
    `);

    console.log('\n📋 Products tablosundaki tüm kolonlar:');
    allColumns.rows.forEach(row => {
      console.log('  - ' + row.column_name);
    });

    pool.end();
  } catch (error) {
    console.error('❌ Hata:', error.message);
    pool.end();
    process.exit(1);
  }
}

addShippingColumns();
