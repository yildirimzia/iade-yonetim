const pool = require('./config/database');

async function addShippingColumns() {
  try {
    console.log('Kargo kolonları ekleniyor...');
    
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
    
    // Mevcut kolonları göster
    const result = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products'
      ORDER BY ordinal_position
    `);
    
    console.log('\nProducts tablosundaki tüm kolonlar:');
    result.rows.forEach(row => {
      console.log('- ' + row.column_name);
    });
    
    pool.end();
  } catch (error) {
    console.error('❌ Hata:', error);
    pool.end();
    process.exit(1);
  }
}

addShippingColumns();
