const pool = require('../config/database');

async function addProductStatus() {
  try {
    console.log('Adding status column to products table...');

    // Create ENUM type for product status
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE product_status AS ENUM ('pending', 'ready_to_ship', 'shipped', 'delivered');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    console.log('✅ Product status ENUM type created!');

    // Add status column with default value
    await pool.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS status product_status DEFAULT 'pending';
    `);

    console.log('✅ Status column added successfully!');

    // Update existing products with shipping info to 'ready_to_ship'
    await pool.query(`
      UPDATE products 
      SET status = 'ready_to_ship'
      WHERE shipping_name IS NOT NULL 
      AND shipping_address IS NOT NULL
      AND status = 'pending';
    `);

    console.log('✅ Existing shipping-ready products updated to ready_to_ship status!');

    process.exit(0);
  } catch (error) {
    console.error('Error adding product status column:', error);
    process.exit(1);
  }
}

addProductStatus();
