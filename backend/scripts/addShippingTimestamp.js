const pool = require('../config/database');

async function addShippingTimestamp() {
  try {
    console.log('Adding shipping_updated_at column to products table...');

    await pool.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS shipping_updated_at TIMESTAMP;
    `);

    console.log('✅ shipping_updated_at column added successfully!');

    // Update existing records that have shipping info
    await pool.query(`
      UPDATE products 
      SET shipping_updated_at = updated_at 
      WHERE shipping_name IS NOT NULL 
      AND shipping_updated_at IS NULL;
    `);

    console.log('✅ Existing shipping records updated with timestamp!');

    process.exit(0);
  } catch (error) {
    console.error('Error adding shipping timestamp column:', error);
    process.exit(1);
  }
}

addShippingTimestamp();
