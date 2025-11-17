const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// 메뉴 목록 조회
router.get('/', async (req, res) => {
  try {
    // 메뉴 조회
    const menusResult = await pool.query('SELECT * FROM menus ORDER BY id');
    
    // 각 메뉴의 옵션 조회
    const menus = await Promise.all(
      menusResult.rows.map(async (menu) => {
        const optionsResult = await pool.query(
          'SELECT id, name, price FROM options WHERE menu_id = $1 ORDER BY id',
          [menu.id]
        );
        return {
          id: menu.id,
          name: menu.name,
          description: menu.description,
          price: menu.price,
          image: menu.image,
          options: optionsResult.rows
        };
      })
    );

    res.json({
      success: true,
      data: menus
    });
  } catch (error) {
    console.error('메뉴 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '메뉴 조회 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;

