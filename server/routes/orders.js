const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// 주문 생성
router.post('/', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { items, totalAmount } = req.body;
    
    // 입력 검증
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: '주문 아이템이 필요합니다.'
      });
    }
    
    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: '유효한 총 금액이 필요합니다.'
      });
    }
    
    // 재고 확인 및 주문 처리
    for (const item of items) {
      const menuResult = await client.query(
        'SELECT id, name, price, stock FROM menus WHERE id = $1',
        [item.menuId]
      );
      
      if (menuResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          error: `존재하지 않는 메뉴입니다. (메뉴 ID: ${item.menuId})`
        });
      }
      
      const menu = menuResult.rows[0];
      
      if (menu.stock < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          error: `재고가 부족합니다. (${menu.name}: 현재 재고 ${menu.stock}개)`
        });
      }
      
      // 옵션 유효성 확인
      if (item.selectedOptions && item.selectedOptions.length > 0) {
        for (const optionId of item.selectedOptions) {
          const optionResult = await client.query(
            'SELECT id FROM options WHERE id = $1 AND menu_id = $2',
            [optionId, item.menuId]
          );
          
          if (optionResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({
              success: false,
              error: `유효하지 않은 옵션입니다. (옵션 ID: ${optionId})`
            });
          }
        }
      }
    }
    
    // 주문 생성
    const orderResult = await client.query(
      'INSERT INTO orders (order_date, status, total_amount) VALUES (NOW(), $1, $2) RETURNING id, order_date, status, total_amount',
      ['pending', totalAmount]
    );
    
    const order = orderResult.rows[0];
    const orderItems = [];
    
    // 주문 아이템 생성 및 재고 감소
    for (const item of items) {
      // 아이템 가격 계산
      const menuResult = await client.query(
        'SELECT price FROM menus WHERE id = $1',
        [item.menuId]
      );
      const menuPrice = menuResult.rows[0].price;
      
      let optionsPrice = 0;
      if (item.selectedOptions && item.selectedOptions.length > 0) {
        const optionsResult = await client.query(
          'SELECT SUM(price) as total FROM options WHERE id = ANY($1)',
          [item.selectedOptions]
        );
        optionsPrice = parseInt(optionsResult.rows[0].total || 0);
      }
      
      const itemPrice = menuPrice + optionsPrice;
      const totalPrice = itemPrice * item.quantity;
      
      // 주문 아이템 저장
      const orderItemResult = await client.query(
        'INSERT INTO order_items (order_id, menu_id, quantity, item_price, total_price) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [order.id, item.menuId, item.quantity, itemPrice, totalPrice]
      );
      
      const orderItemId = orderItemResult.rows[0].id;
      
      // 선택한 옵션 저장
      if (item.selectedOptions && item.selectedOptions.length > 0) {
        for (const optionId of item.selectedOptions) {
          await client.query(
            'INSERT INTO order_item_options (order_item_id, option_id) VALUES ($1, $2)',
            [orderItemId, optionId]
          );
        }
      }
      
      // 재고 감소
      await client.query(
        'UPDATE menus SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.menuId]
      );
      
      // 메뉴 이름 조회
      const menuNameResult = await client.query(
        'SELECT name FROM menus WHERE id = $1',
        [item.menuId]
      );
      
      // 옵션 정보 조회
      let selectedOptions = [];
      if (item.selectedOptions && item.selectedOptions.length > 0) {
        const optionsInfoResult = await client.query(
          'SELECT id, name, price FROM options WHERE id = ANY($1)',
          [item.selectedOptions]
        );
        selectedOptions = optionsInfoResult.rows.map(opt => ({
          optionId: opt.id,
          optionName: opt.name,
          optionPrice: opt.price
        }));
      }
      
      orderItems.push({
        menuId: item.menuId,
        menuName: menuNameResult.rows[0].name,
        quantity: item.quantity,
        selectedOptions: selectedOptions,
        itemPrice: itemPrice,
        totalPrice: totalPrice
      });
    }
    
    await client.query('COMMIT');
    
    res.json({
      success: true,
      data: {
        orderId: order.id,
        orderDate: order.order_date,
        status: order.status,
        totalAmount: order.total_amount,
        items: orderItems
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('주문 생성 오류:', error);
    res.status(500).json({
      success: false,
      error: '주문 생성 중 오류가 발생했습니다.'
    });
  } finally {
    client.release();
  }
});

// 주문 상세 조회
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // 주문 조회
    const orderResult = await pool.query(
      'SELECT id, order_date, status, total_amount FROM orders WHERE id = $1',
      [orderId]
    );
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '주문을 찾을 수 없습니다.'
      });
    }
    
    const order = orderResult.rows[0];
    
    // 주문 아이템 조회
    const itemsResult = await pool.query(
      `SELECT oi.id, oi.menu_id, oi.quantity, oi.item_price, oi.total_price, m.name as menu_name
       FROM order_items oi
       JOIN menus m ON oi.menu_id = m.id
       WHERE oi.order_id = $1`,
      [orderId]
    );
    
    // 각 아이템의 옵션 조회
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
    
    res.json({
      success: true,
      data: {
        id: order.id,
        orderDate: order.order_date,
        status: order.status,
        totalAmount: order.total_amount,
        items: items
      }
    });
  } catch (error) {
    console.error('주문 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '주문 조회 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;

