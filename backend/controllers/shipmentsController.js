const pool = require('../config/database');

// @desc    Get all shipments
// @route   GET /api/shipments
// @access  Private
const getShipments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '' } = req.query;
    const offset = (page - 1) * limit;

    let query;
    let queryParams;

    if (req.user.role === 'admin') {
      query = `
        SELECT s.*, r.id as return_id, p.product_name, u.name as seller_name
        FROM shipments s
        LEFT JOIN returns r ON s.return_id = r.id
        LEFT JOIN products p ON r.product_id = p.id
        LEFT JOIN users u ON r.seller_id = u.id
        WHERE 1=1
        ${status ? 'AND s.status = $1' : ''}
        ORDER BY s.shipping_date DESC
        LIMIT $${status ? '2' : '1'}
        OFFSET $${status ? '3' : '2'}
      `;
      queryParams = status ? [status, limit, offset] : [limit, offset];
    } else {
      query = `
        SELECT s.*, r.id as return_id, p.product_name
        FROM shipments s
        LEFT JOIN returns r ON s.return_id = r.id
        LEFT JOIN products p ON r.product_id = p.id
        WHERE r.seller_id = $1
        ${status ? 'AND s.status = $2' : ''}
        ORDER BY s.shipping_date DESC
        LIMIT $${status ? '3' : '2'}
        OFFSET $${status ? '4' : '3'}
      `;
      queryParams = status
        ? [req.user.id, status, limit, offset]
        : [req.user.id, limit, offset];
    }

    const result = await pool.query(query, queryParams);

    // Get total count
    let countQuery;
    let countParams;

    if (req.user.role === 'admin') {
      countQuery = `SELECT COUNT(*) FROM shipments ${status ? 'WHERE status = $1' : ''}`;
      countParams = status ? [status] : [];
    } else {
      countQuery = `
        SELECT COUNT(*)
        FROM shipments s
        LEFT JOIN returns r ON s.return_id = r.id
        WHERE r.seller_id = $1
        ${status ? 'AND s.status = $2' : ''}
      `;
      countParams = status ? [req.user.id, status] : [req.user.id];
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
    console.error('Get shipments error:', error);
    res.status(500).json({
      success: false,
      message: 'Kargolar getirilirken hata oluştu.'
    });
  }
};

// @desc    Get single shipment
// @route   GET /api/shipments/:id
// @access  Private
const getShipment = async (req, res) => {
  try {
    const { id } = req.params;

    let query;
    let queryParams;

    if (req.user.role === 'admin') {
      query = `
        SELECT s.*, r.id as return_id, p.product_name, u.name as seller_name, u.email as seller_email
        FROM shipments s
        LEFT JOIN returns r ON s.return_id = r.id
        LEFT JOIN products p ON r.product_id = p.id
        LEFT JOIN users u ON r.seller_id = u.id
        WHERE s.id = $1
      `;
      queryParams = [id];
    } else {
      query = `
        SELECT s.*, r.id as return_id, p.product_name
        FROM shipments s
        LEFT JOIN returns r ON s.return_id = r.id
        LEFT JOIN products p ON r.product_id = p.id
        WHERE s.id = $1 AND r.seller_id = $2
      `;
      queryParams = [id, req.user.id];
    }

    const result = await pool.query(query, queryParams);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Kargo kaydı bulunamadı.'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get shipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Kargo kaydı getirilirken hata oluştu.'
    });
  }
};

// @desc    Create new shipment
// @route   POST /api/shipments
// @access  Private (Admin only)
const createShipment = async (req, res) => {
  try {
    const {
      return_id,
      shipping_date,
      tracking_number,
      carrier,
      status,
      recipient_name,
      recipient_address,
      recipient_phone,
      notes
    } = req.body;

    // Validation
    if (!return_id) {
      return res.status(400).json({
        success: false,
        message: 'İade ID gereklidir.'
      });
    }

    // Check if return exists
    const returnCheck = await pool.query(
      'SELECT * FROM returns WHERE id = $1',
      [return_id]
    );

    if (returnCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'İade kaydı bulunamadı.'
      });
    }

    const result = await pool.query(
      `INSERT INTO shipments (
        return_id, shipping_date, tracking_number, carrier, status,
        recipient_name, recipient_address, recipient_phone, notes
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        return_id,
        shipping_date || new Date(),
        tracking_number || null,
        carrier || null,
        status || 'preparing',
        recipient_name || null,
        recipient_address || null,
        recipient_phone || null,
        notes || null
      ]
    );

    // Update return status
    await pool.query(
      'UPDATE returns SET status = $1 WHERE id = $2',
      ['shipped', return_id]
    );

    res.status(201).json({
      success: true,
      message: 'Kargo kaydı oluşturuldu.',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create shipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Kargo kaydı oluşturulurken hata oluştu.'
    });
  }
};

// @desc    Update shipment
// @route   PUT /api/shipments/:id
// @access  Private (Admin only)
const updateShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      tracking_number,
      carrier,
      status,
      recipient_name,
      recipient_address,
      recipient_phone,
      notes
    } = req.body;

    const result = await pool.query(
      `UPDATE shipments
       SET tracking_number = COALESCE($1, tracking_number),
           carrier = COALESCE($2, carrier),
           status = COALESCE($3, status),
           recipient_name = COALESCE($4, recipient_name),
           recipient_address = COALESCE($5, recipient_address),
           recipient_phone = COALESCE($6, recipient_phone),
           notes = COALESCE($7, notes)
       WHERE id = $8
       RETURNING *`,
      [tracking_number, carrier, status, recipient_name, recipient_address, recipient_phone, notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Kargo kaydı bulunamadı.'
      });
    }

    res.json({
      success: true,
      message: 'Kargo kaydı güncellendi.',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update shipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Kargo kaydı güncellenirken hata oluştu.'
    });
  }
};

// @desc    Delete shipment
// @route   DELETE /api/shipments/:id
// @access  Private (Admin only)
const deleteShipment = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM shipments WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Kargo kaydı bulunamadı.'
      });
    }

    res.json({
      success: true,
      message: 'Kargo kaydı silindi.'
    });
  } catch (error) {
    console.error('Delete shipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Kargo kaydı silinirken hata oluştu.'
    });
  }
};

// @desc    Get shipment statistics
// @route   GET /api/shipments/stats
// @access  Private
const getShipmentStats = async (req, res) => {
  try {
    let query;
    let queryParams;

    if (req.user.role === 'admin') {
      query = `
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'preparing') as preparing,
          COUNT(*) FILTER (WHERE status = 'shipped') as shipped,
          COUNT(*) FILTER (WHERE status = 'delivered') as delivered
        FROM shipments
      `;
      queryParams = [];
    } else {
      query = `
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE s.status = 'preparing') as preparing,
          COUNT(*) FILTER (WHERE s.status = 'shipped') as shipped,
          COUNT(*) FILTER (WHERE s.status = 'delivered') as delivered
        FROM shipments s
        LEFT JOIN returns r ON s.return_id = r.id
        WHERE r.seller_id = $1
      `;
      queryParams = [req.user.id];
    }

    const result = await pool.query(query, queryParams);

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get shipment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Kargo istatistikleri getirilirken hata oluştu.'
    });
  }
};

module.exports = {
  getShipments,
  getShipment,
  createShipment,
  updateShipment,
  deleteShipment,
  getShipmentStats
};
