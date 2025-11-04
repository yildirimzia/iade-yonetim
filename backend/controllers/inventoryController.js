const pool = require('../config/database');

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private
const getInventory = async (req, res) => {
  try {
    const { page = 1, limit = 10, location = '', condition = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT i.*, p.product_name, p.sku, u.name as seller_name
      FROM inventory i
      LEFT JOIN products p ON i.product_id = p.id
      LEFT JOIN users u ON p.seller_id = u.id
      WHERE 1=1
      ${location ? 'AND i.location ILIKE $1' : ''}
      ${condition ? `AND i.condition = $${location ? '2' : '1'}` : ''}
      ORDER BY i.last_updated DESC
      LIMIT $${location && condition ? '3' : location || condition ? '2' : '1'}
      OFFSET $${location && condition ? '4' : location || condition ? '3' : '2'}
    `;

    let queryParams;
    if (location && condition) {
      queryParams = [`%${location}%`, condition, limit, offset];
    } else if (location) {
      queryParams = [`%${location}%`, limit, offset];
    } else if (condition) {
      queryParams = [condition, limit, offset];
    } else {
      queryParams = [limit, offset];
    }

    const result = await pool.query(query, queryParams);

    // Get total count
    let countQuery = `SELECT COUNT(*) FROM inventory i WHERE 1=1 ${location ? 'AND i.location ILIKE $1' : ''} ${condition ? `AND i.condition = $${location ? '2' : '1'}` : ''}`;
    let countParams;
    if (location && condition) {
      countParams = [`%${location}%`, condition];
    } else if (location) {
      countParams = [`%${location}%`];
    } else if (condition) {
      countParams = [condition];
    } else {
      countParams = [];
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
    console.error('Get inventory error:', error);
    res.status(500).json({
      success: false,
      message: 'Envanter getirilirken hata oluştu.'
    });
  }
};

// @desc    Get single inventory item
// @route   GET /api/inventory/:id
// @access  Private
const getInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT i.*, p.product_name, p.sku, u.name as seller_name, u.email as seller_email
       FROM inventory i
       LEFT JOIN products p ON i.product_id = p.id
       LEFT JOIN users u ON p.seller_id = u.id
       WHERE i.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Envanter kaydı bulunamadı.'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get inventory item error:', error);
    res.status(500).json({
      success: false,
      message: 'Envanter kaydı getirilirken hata oluştu.'
    });
  }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Private (Admin only)
const updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, condition, location, notes } = req.body;

    const result = await pool.query(
      `UPDATE inventory
       SET quantity = COALESCE($1, quantity),
           condition = COALESCE($2, condition),
           location = COALESCE($3, location),
           notes = COALESCE($4, notes),
           last_updated = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [quantity, condition, location, notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Envanter kaydı bulunamadı.'
      });
    }

    res.json({
      success: true,
      message: 'Envanter güncellendi.',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({
      success: false,
      message: 'Envanter güncellenirken hata oluştu.'
    });
  }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Private (Admin only)
const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM inventory WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Envanter kaydı bulunamadı.'
      });
    }

    res.json({
      success: true,
      message: 'Envanter kaydı silindi.'
    });
  } catch (error) {
    console.error('Delete inventory error:', error);
    res.status(500).json({
      success: false,
      message: 'Envanter kaydı silinirken hata oluştu.'
    });
  }
};

// @desc    Get inventory statistics
// @route   GET /api/inventory/stats
// @access  Private (Admin only)
const getInventoryStats = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) as total_items,
        SUM(quantity) as total_quantity,
        COUNT(*) FILTER (WHERE condition = 'good') as good_condition,
        COUNT(*) FILTER (WHERE condition = 'damaged') as damaged,
        COUNT(*) FILTER (WHERE condition = 'missing_parts') as missing_parts,
        COUNT(DISTINCT location) as locations
      FROM inventory
    `);

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get inventory stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Envanter istatistikleri getirilirken hata oluştu.'
    });
  }
};

// @desc    Get inventory locations
// @route   GET /api/inventory/locations
// @access  Private (Admin only)
const getLocations = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT DISTINCT location FROM inventory WHERE location IS NOT NULL ORDER BY location'
    );

    res.json({
      success: true,
      data: result.rows.map(row => row.location)
    });
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({
      success: false,
      message: 'Lokasyonlar getirilirken hata oluştu.'
    });
  }
};

module.exports = {
  getInventory,
  getInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryStats,
  getLocations
};
