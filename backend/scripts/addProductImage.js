const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'iade_yonetim',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

async function addProductImageColumn() {
  try {
    console.log('🔧 product_image sütunu ekleniyor...');
    
    // Add product_image column to products table
    await pool.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS product_image TEXT
    `);
    
    console.log('✅ product_image sütunu eklendi!');
    console.log('\n🎉 Ürünlere artık resim ekleyebilirsiniz!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
}

addProductImageColumn();
