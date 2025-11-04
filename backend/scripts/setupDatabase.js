const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Create connection without database first
const setupPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  max: 1
});

const dbName = process.env.DB_NAME || 'iade_yonetim';

async function setupDatabase() {
  let client;

  try {
    console.log('🚀 Veritabanı kurulumu başlatılıyor...\n');

    // Connect to PostgreSQL
    client = await setupPool.connect();

    // Check if database exists
    const dbCheck = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    // Create database if it doesn't exist
    if (dbCheck.rows.length === 0) {
      console.log(`📦 "${dbName}" veritabanı oluşturuluyor...`);
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log('✅ Veritabanı oluşturuldu!\n');
    } else {
      console.log(`✅ "${dbName}" veritabanı zaten mevcut.\n`);
    }

    client.release();

    // Connect to the newly created database
    const dbPool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: dbName,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      max: 1
    });

    const dbClient = await dbPool.connect();

    // Create tables
    console.log('📋 Tablolar oluşturuluyor...\n');

    // Users table
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        company VARCHAR(255),
        role VARCHAR(20) NOT NULL DEFAULT 'seller' CHECK (role IN ('admin', 'seller')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users tablosu oluşturuldu');

    // Products table
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_name VARCHAR(255) NOT NULL,
        sku VARCHAR(100),
        barcode VARCHAR(100),
        category VARCHAR(100) NOT NULL,
        original_price DECIMAL(10, 2),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Products tablosu oluşturuldu');

    // Returns table
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS returns (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        return_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reason TEXT,
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'received', 'shipped', 'completed', 'rejected')),
        tracking_number VARCHAR(100),
        photos TEXT,
        condition VARCHAR(50) DEFAULT 'good' CHECK (condition IN ('good', 'damaged', 'missing_parts')),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Returns tablosu oluşturuldu');

    // Inventory table
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS inventory (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER DEFAULT 1,
        condition VARCHAR(50) DEFAULT 'good' CHECK (condition IN ('good', 'damaged', 'missing_parts')),
        location VARCHAR(255),
        notes TEXT,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Inventory tablosu oluşturuldu');

    // Shipments table
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS shipments (
        id SERIAL PRIMARY KEY,
        return_id INTEGER REFERENCES returns(id) ON DELETE CASCADE,
        shipping_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        tracking_number VARCHAR(100),
        carrier VARCHAR(100),
        status VARCHAR(50) DEFAULT 'preparing' CHECK (status IN ('preparing', 'shipped', 'in_transit', 'delivered', 'cancelled')),
        recipient_name VARCHAR(255),
        recipient_address TEXT,
        recipient_phone VARCHAR(50),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Shipments tablosu oluşturuldu\n');

    // Create indexes for better performance
    console.log('🔍 İndeksler oluşturuluyor...\n');

    await dbClient.query('CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id)');
    await dbClient.query('CREATE INDEX IF NOT EXISTS idx_returns_seller ON returns(seller_id)');
    await dbClient.query('CREATE INDEX IF NOT EXISTS idx_returns_product ON returns(product_id)');
    await dbClient.query('CREATE INDEX IF NOT EXISTS idx_returns_status ON returns(status)');
    await dbClient.query('CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id)');
    await dbClient.query('CREATE INDEX IF NOT EXISTS idx_shipments_return ON shipments(return_id)');

    console.log('✅ İndeksler oluşturuldu\n');

    // Create default admin user
    console.log('👤 Admin kullanıcısı kontrol ediliyor...\n');

    const adminCheck = await dbClient.query(
      'SELECT * FROM users WHERE email = $1',
      ['admin@iadeyonetim.com']
    );

    if (adminCheck.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('Admin123!', 10);

      await dbClient.query(
        `INSERT INTO users (email, password, name, role)
         VALUES ($1, $2, $3, $4)`,
        ['admin@iadeyonetim.com', hashedPassword, 'Admin', 'admin']
      );

      console.log('✅ Admin kullanıcısı oluşturuldu!');
      console.log('   Email: admin@iadeyonetim.com');
      console.log('   Şifre: Admin123!');
      console.log('   ⚠️  Üretim ortamında mutlaka değiştirin!\n');
    } else {
      console.log('✅ Admin kullanıcısı zaten mevcut.\n');
    }

    dbClient.release();
    await dbPool.end();

    console.log('🎉 Veritabanı kurulumu başarıyla tamamlandı!\n');
    console.log('📌 Sonraki adımlar:');
    console.log('   1. npm run dev (backend başlat)');
    console.log('   2. cd ../frontend && npm run dev (frontend başlat)');
    console.log('   3. http://localhost:3000 adresini ziyaret et\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error.message);
    console.error('\n💡 Sorun giderme:');
    console.error('   1. PostgreSQL çalışıyor mu kontrol edin');
    console.error('   2. .env dosyasındaki veritabanı bilgilerini kontrol edin');
    console.error('   3. Veritabanı kullanıcısının yetkileri yeterli mi kontrol edin\n');
    process.exit(1);
  } finally {
    await setupPool.end();
  }
}

setupDatabase();
