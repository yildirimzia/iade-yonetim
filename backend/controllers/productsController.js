const pool = require('../config/database');

// @desc    Get all products (filtered by seller or all for admin)
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category = '' } = req.query;
    const offset = (page - 1) * limit;

    let query;
    let queryParams;

    if (req.user.role === 'admin') {
      // Admin sees all products
      query = `
        SELECT p.*, u.name as seller_name, u.email as seller_email
        FROM products p
        LEFT JOIN users u ON p.seller_id = u.id
        WHERE (p.product_name ILIKE $1 OR p.sku ILIKE $1)
        ${category ? 'AND p.category = $4' : ''}
        ORDER BY p.created_at DESC
        LIMIT $2 OFFSET $3
      `;
      queryParams = category
        ? [`%${search}%`, limit, offset, category]
        : [`%${search}%`, limit, offset];
    } else {
      // Seller sees only their products
      query = `
        SELECT * FROM products
        WHERE seller_id = $1
        AND (product_name ILIKE $2 OR sku ILIKE $2)
        ${category ? 'AND category = $5' : ''}
        ORDER BY created_at DESC
        LIMIT $3 OFFSET $4
      `;
      queryParams = category
        ? [req.user.id, `%${search}%`, limit, offset, category]
        : [req.user.id, `%${search}%`, limit, offset];
    }

    const result = await pool.query(query, queryParams);

    // Get total count
    let countQuery;
    let countParams;

    if (req.user.role === 'admin') {
      countQuery = `SELECT COUNT(*) FROM products WHERE (product_name ILIKE $1 OR sku ILIKE $1) ${category ? 'AND category = $2' : ''}`;
      countParams = category ? [`%${search}%`, category] : [`%${search}%`];
    } else {
      countQuery = `SELECT COUNT(*) FROM products WHERE seller_id = $1 AND (product_name ILIKE $2 OR sku ILIKE $2) ${category ? 'AND category = $3' : ''}`;
      countParams = category ? [req.user.id, `%${search}%`, category] : [req.user.id, `%${search}%`];
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Ürünler getirilirken hata oluştu.'
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    let query;
    let queryParams;

    if (req.user.role === 'admin') {
      query = `
        SELECT p.*, u.name as seller_name, u.email as seller_email
        FROM products p
        LEFT JOIN users u ON p.seller_id = u.id
        WHERE p.id = $1
      `;
      queryParams = [id];
    } else {
      query = 'SELECT * FROM products WHERE id = $1 AND seller_id = $2';
      queryParams = [id, req.user.id];
    }

    const result = await pool.query(query, queryParams);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı.'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Ürün getirilirken hata oluştu.'
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Seller/Admin)
const createProduct = async (req, res) => {
  try {
    const { product_name, sku, barcode, category, original_price, notes } = req.body;

    // Validation
    if (!product_name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Ürün adı ve kategori zorunludur.'
      });
    }

    const result = await pool.query(
      `INSERT INTO products (seller_id, product_name, sku, barcode, category, original_price, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.user.id, product_name, sku || null, barcode || null, category, original_price || null, notes || null]
    );

    res.status(201).json({
      success: true,
      message: 'Ürün başarıyla oluşturuldu.',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Ürün oluşturulurken hata oluştu.'
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_name, sku, barcode, category, original_price, notes } = req.body;

    // Check ownership (sellers can only update their own products)
    if (req.user.role !== 'admin') {
      const checkOwner = await pool.query(
        'SELECT * FROM products WHERE id = $1 AND seller_id = $2',
        [id, req.user.id]
      );

      if (checkOwner.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Bu ürünü güncelleme yetkiniz yok.'
        });
      }
    }

    const result = await pool.query(
      `UPDATE products
       SET product_name = COALESCE($1, product_name),
           sku = COALESCE($2, sku),
           barcode = COALESCE($3, barcode),
           category = COALESCE($4, category),
           original_price = COALESCE($5, original_price),
           notes = COALESCE($6, notes)
       WHERE id = $7
       RETURNING *`,
      [product_name, sku, barcode, category, original_price, notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı.'
      });
    }

    res.json({
      success: true,
      message: 'Ürün güncellendi.',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Ürün güncellenirken hata oluştu.'
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check ownership (sellers can only delete their own products)
    if (req.user.role !== 'admin') {
      const checkOwner = await pool.query(
        'SELECT * FROM products WHERE id = $1 AND seller_id = $2',
        [id, req.user.id]
      );

      if (checkOwner.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Bu ürünü silme yetkiniz yok.'
        });
      }
    }

    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı.'
      });
    }

    res.json({
      success: true,
      message: 'Ürün silindi.'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Ürün silinirken hata oluştu.'
    });
  }
};

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Private
const getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category'
    );

    res.json({
      success: true,
      data: result.rows.map(row => row.category)
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Kategoriler getirilirken hata oluştu.'
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
};
