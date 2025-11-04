const pool = require('../config/database');

// @desc    Get all returns
// @route   GET /api/returns
// @access  Private
const getReturns = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '', search = '' } = req.query;
    const offset = (page - 1) * limit;

    let query;
    let queryParams;

    if (req.user.role === 'admin') {
      // Admin sees all returns
      query = `
        SELECT r.*, p.product_name, p.sku, u.name as seller_name
        FROM returns r
        LEFT JOIN products p ON r.product_id = p.id
        LEFT JOIN users u ON r.seller_id = u.id
        WHERE 1=1
        ${status ? 'AND r.status = $1' : ''}
        ${search ? `AND (p.product_name ILIKE $${status ? '2' : '1'} OR r.tracking_number ILIKE $${status ? '2' : '1'})` : ''}
        ORDER BY r.return_date DESC
        LIMIT $${status && search ? '3' : status || search ? '2' : '1'}
        OFFSET $${status && search ? '4' : status || search ? '3' : '2'}
      `;

      if (status && search) {
        queryParams = [status, `%${search}%`, limit, offset];
      } else if (status) {
        queryParams = [status, limit, offset];
      } else if (search) {
        queryParams = [`%${search}%`, limit, offset];
      } else {
        queryParams = [limit, offset];
      }
    } else {
      // Seller sees only their returns
      query = `
        SELECT r.*, p.product_name, p.sku
        FROM returns r
        LEFT JOIN products p ON r.product_id = p.id
        WHERE r.seller_id = $1
        ${status ? 'AND r.status = $2' : ''}
        ${search ? `AND (p.product_name ILIKE $${status ? '3' : '2'} OR r.tracking_number ILIKE $${status ? '3' : '2'})` : ''}
        ORDER BY r.return_date DESC
        LIMIT $${status && search ? '4' : status || search ? '3' : '2'}
        OFFSET $${status && search ? '5' : status || search ? '4' : '3'}
      `;

      if (status && search) {
        queryParams = [req.user.id, status, `%${search}%`, limit, offset];
      } else if (status) {
        queryParams = [req.user.id, status, limit, offset];
      } else if (search) {
        queryParams = [req.user.id, `%${search}%`, limit, offset];
      } else {
        queryParams = [req.user.id, limit, offset];
      }
    }

    const result = await pool.query(query, queryParams);

    // Get total count
    let countQuery;
    let countParams;

    if (req.user.role === 'admin') {
      countQuery = `SELECT COUNT(*) FROM returns r LEFT JOIN products p ON r.product_id = p.id WHERE 1=1 ${status ? 'AND r.status = $1' : ''} ${search ? `AND (p.product_name ILIKE $${status ? '2' : '1'} OR r.tracking_number ILIKE $${status ? '2' : '1'})` : ''}`;
      if (status && search) {
        countParams = [status, `%${search}%`];
      } else if (status) {
        countParams = [status];
      } else if (search) {
        countParams = [`%${search}%`];
      } else {
        countParams = [];
      }
    } else {
      countQuery = `SELECT COUNT(*) FROM returns r LEFT JOIN products p ON r.product_id = p.id WHERE r.seller_id = $1 ${status ? 'AND r.status = $2' : ''} ${search ? `AND (p.product_name ILIKE $${status ? '3' : '2'} OR r.tracking_number ILIKE $${status ? '3' : '2'})` : ''}`;
      if (status && search) {
        countParams = [req.user.id, status, `%${search}%`];
      } else if (status) {
        countParams = [req.user.id, status];
      } else if (search) {
        countParams = [req.user.id, `%${search}%`];
      } else {
        countParams = [req.user.id];
      }
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
    console.error('Get returns error:', error);
    res.status(500).json({
      success: false,
      message: 'İadeler getirilirken hata oluştu.'
    });
  }
};

// @desc    Get single return
// @route   GET /api/returns/:id
// @access  Private
const getReturn = async (req, res) => {
  try {
    const { id } = req.params;

    let query;
    let queryParams;

    if (req.user.role === 'admin') {
      query = `
        SELECT r.*, p.product_name, p.sku, u.name as seller_name, u.email as seller_email
        FROM returns r
        LEFT JOIN products p ON r.product_id = p.id
        LEFT JOIN users u ON r.seller_id = u.id
        WHERE r.id = $1
      `;
      queryParams = [id];
    } else {
      query = `
        SELECT r.*, p.product_name, p.sku
        FROM returns r
        LEFT JOIN products p ON r.product_id = p.id
        WHERE r.id = $1 AND r.seller_id = $2
      `;
      queryParams = [id, req.user.id];
    }

    const result = await pool.query(query, queryParams);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'İade kaydı bulunamadı.'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get return error:', error);
    res.status(500).json({
      success: false,
      message: 'İade kaydı getirilirken hata oluştu.'
    });
  }
};

// @desc    Create new return
// @route   POST /api/returns
// @access  Private (Admin only)
const createReturn = async (req, res) => {
  try {
    const { product_id, return_date, reason, status, tracking_number, photos, condition, notes } = req.body;

    // Validation
    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: 'Ürün ID gereklidir.'
      });
    }

    // Get product and seller_id
    const productResult = await pool.query(
      'SELECT seller_id FROM products WHERE id = $1',
      [product_id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı.'
      });
    }

    const seller_id = productResult.rows[0].seller_id;

    const result = await pool.query(
      `INSERT INTO returns (product_id, seller_id, return_date, reason, status, tracking_number, photos, condition, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        product_id,
        seller_id,
        return_date || new Date(),
        reason || null,
        status || 'pending',
        tracking_number || null,
        photos || null,
        condition || 'good',
        notes || null
      ]
    );

    res.status(201).json({
      success: true,
      message: 'İade kaydı oluşturuldu.',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create return error:', error);
    res.status(500).json({
      success: false,
      message: 'İade kaydı oluşturulurken hata oluştu.'
    });
  }
};

// @desc    Update return
// @route   PUT /api/returns/:id
// @access  Private
const updateReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, status, tracking_number, photos, condition, notes } = req.body;

    // Check if return exists and user has permission
    let checkQuery;
    let checkParams;

    if (req.user.role === 'admin') {
      checkQuery = 'SELECT * FROM returns WHERE id = $1';
      checkParams = [id];
    } else {
      checkQuery = 'SELECT * FROM returns WHERE id = $1 AND seller_id = $2';
      checkParams = [id, req.user.id];
    }

    const checkResult = await pool.query(checkQuery, checkParams);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'İade kaydı bulunamadı veya yetkiniz yok.'
      });
    }

    const result = await pool.query(
      `UPDATE returns
       SET reason = COALESCE($1, reason),
           status = COALESCE($2, status),
           tracking_number = COALESCE($3, tracking_number),
           photos = COALESCE($4, photos),
           condition = COALESCE($5, condition),
           notes = COALESCE($6, notes)
       WHERE id = $7
       RETURNING *`,
      [reason, status, tracking_number, photos, condition, notes, id]
    );

    res.json({
      success: true,
      message: 'İade kaydı güncellendi.',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update return error:', error);
    res.status(500).json({
      success: false,
      message: 'İade kaydı güncellenirken hata oluştu.'
    });
  }
};

// @desc    Delete return
// @route   DELETE /api/returns/:id
// @access  Private (Admin only)
const deleteReturn = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM returns WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'İade kaydı bulunamadı.'
      });
    }

    res.json({
      success: true,
      message: 'İade kaydı silindi.'
    });
  } catch (error) {
    console.error('Delete return error:', error);
    res.status(500).json({
      success: false,
      message: 'İade kaydı silinirken hata oluştu.'
    });
  }
};

// @desc    Get return statistics
// @route   GET /api/returns/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    let query;
    let queryParams;

    if (req.user.role === 'admin') {
      query = `
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'pending') as pending,
          COUNT(*) FILTER (WHERE status = 'received') as received,
          COUNT(*) FILTER (WHERE status = 'shipped') as shipped,
          COUNT(*) FILTER (WHERE condition = 'good') as good_condition,
          COUNT(*) FILTER (WHERE condition = 'damaged') as damaged
        FROM returns
      `;
      queryParams = [];
    } else {
      query = `
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'pending') as pending,
          COUNT(*) FILTER (WHERE status = 'received') as received,
          COUNT(*) FILTER (WHERE status = 'shipped') as shipped
        FROM returns
        WHERE seller_id = $1
      `;
      queryParams = [req.user.id];
    }

    const result = await pool.query(query, queryParams);

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'İstatistikler getirilirken hata oluştu.'
    });
  }
};

module.exports = {
  getReturns,
  getReturn,
  createReturn,
  updateReturn,
  deleteReturn,
  getStats
};
