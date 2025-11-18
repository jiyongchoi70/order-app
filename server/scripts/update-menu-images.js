require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'coffee_order_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || ''
});

async function updateMenuImages() {
  try {
    console.log('메뉴 이미지 업데이트 시작...');
    
    // 메뉴 이미지 업데이트
    const updateQueries = [
      { name: '아메리카노 (ICE)', image: '/coffee-ice.jpg' },
      { name: '아메리카노 (HOT)', image: '/coffee-hot.jpg' },
      { name: '카페라떼', image: '/coffee-latte.jpg' }
    ];

    for (const menu of updateQueries) {
      const result = await pool.query(
        'UPDATE menus SET image = $1 WHERE name = $2',
        [menu.image, menu.name]
      );
      console.log(`✓ ${menu.name}: ${result.rowCount}개 업데이트됨`);
    }

    console.log('✅ 메뉴 이미지 업데이트 완료!');
    process.exit(0);
  } catch (error) {
    console.error('❌ 메뉴 이미지 업데이트 실패:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

updateMenuImages();

