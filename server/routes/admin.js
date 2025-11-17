const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// 주문 상태 통계 조회
router.get('/dashboard/stats', async (req, res) => {
  try {
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_orders,
        COUNT(*) FILTER (WHERE status IN ('pending', 'received')) as received_orders,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_orders,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_orders
      FROM orders
    `);
    
    const stats = statsResult.rows[0];
    
    res.json({
      success: true,
      data: {
        totalOrders: parseInt(stats.total_orders),
        receivedOrders: parseInt(stats.received_orders),
        inProgressOrders: parseInt(stats.in_progress_orders),
        completedOrders: parseInt(stats.completed_orders)
      }
    });
  } catch (error) {
    console.error('통계 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '통계 조회 중 오류가 발생했습니다.'
    });
  }
});

// 재고 목록 조회
router.get('/inventory', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id as menu_id, name as menu_name, stock FROM menus ORDER BY id'
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('재고 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '재고 조회 중 오류가 발생했습니다.'
    });
  }
});

// 재고 업데이트
router.put('/inventory/:menuId', async (req, res) => {
  try {
    const { menuId } = req.params;
    const { stock } = req.body;
    
    if (stock === undefined || stock < 0) {
      return res.status(400).json({
        success: false,
        error: '재고는 0 이상이어야 합니다.'
      });
    }
    
    const result = await pool.query(
      'UPDATE menus SET stock = $1, updated_at = NOW() WHERE id = $2 RETURNING id as menu_id, name as menu_name, stock',
      [stock, menuId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '메뉴를 찾을 수 없습니다.'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('재고 업데이트 오류:', error);
    res.status(500).json({
      success: false,
      error: '재고 업데이트 중 오류가 발생했습니다.'
    });
  }
});

// 주문 목록 조회
router.get('/orders', async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    
    let query = `
      SELECT o.id, o.order_date, o.status, o.total_amount
      FROM orders o
    `;
    const params = [];
    
    if (status) {
      query += ' WHERE o.status = $1';
      params.push(status);
    } else {
      query += ' WHERE o.status != $1';
      params.push('completed');
    }
    
    query += ' ORDER BY o.order_date DESC LIMIT $' + (params.length + 1);
    params.push(parseInt(limit));
    
    const ordersResult = await pool.query(query, params);
    
    // 각 주문의 아이템 조회
    const orders = await Promise.all(
      ordersResult.rows.map(async (order) => {
        const itemsResult = await pool.query(
          `SELECT oi.id, oi.menu_id, oi.quantity, oi.item_price, oi.total_price, m.name as menu_name
           FROM order_items oi
           JOIN menus m ON oi.menu_id = m.id
           WHERE oi.order_id = $1`,
          [order.id]
        );
        
        const items = await Promise.all(
          itemsResult.rows.map(async (item) => {
            const optionsResult = await pool.query(
              `SELECT o.id, o.name, o.price
               FROM order_item_options oio
               JOIN options o ON oio.option_id = o.id
               WHERE oio.order_item_id = $1`,
              [item.id]
            );
            
            return {
              menuId: item.menu_id,
              menuName: item.menu_name,
              quantity: item.quantity,
              selectedOptions: optionsResult.rows.map(opt => ({
                optionId: opt.id,
                optionName: opt.name,
                optionPrice: opt.price
              })),
              itemPrice: item.item_price,
              totalPrice: item.total_price
            };
          })
        );
        
        return {
          id: order.id,
          orderDate: order.order_date,
          status: order.status,
          totalAmount: order.total_amount,
          items: items
        };
      })
    );
    
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('주문 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '주문 목록 조회 중 오류가 발생했습니다.'
    });
  }
});

// 주문 상태 업데이트
router.put('/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'received', 'in_progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: '유효하지 않은 주문 상태입니다.'
      });
    }
    
    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id, order_date, status, total_amount',
      [status, orderId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '주문을 찾을 수 없습니다.'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('주문 상태 업데이트 오류:', error);
    res.status(500).json({
      success: false,
      error: '주문 상태 업데이트 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;

