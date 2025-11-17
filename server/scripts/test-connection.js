require('dotenv').config();
const pool = require('../config/database');

async function testConnection() {
  try {
    console.log('데이터베이스 연결 테스트 중...');
    console.log('연결 정보:');
    console.log(`  Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`  Port: ${process.env.DB_PORT || 5432}`);
    console.log(`  Database: ${process.env.DB_NAME || 'coffee_order_db'}`);
    console.log(`  User: ${process.env.DB_USER || 'postgres'}`);
    console.log('');
    
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    
    console.log('✅ 데이터베이스 연결 성공!');
    console.log(`현재 시간: ${result.rows[0].current_time}`);
    console.log(`PostgreSQL 버전: ${result.rows[0].pg_version.split(',')[0]}`);
    console.log('');
    
    // 테이블 존재 여부 확인
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    if (tablesResult.rows.length > 0) {
      console.log('📋 생성된 테이블:');
      tablesResult.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
    } else {
      console.log('⚠️  테이블이 아직 생성되지 않았습니다.');
      console.log('   scripts/create-database.sql 파일을 실행하여 테이블을 생성하세요.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 데이터베이스 연결 실패:');
    console.error(error.message);
    console.log('');
    console.log('다음을 확인하세요:');
    console.log('1. PostgreSQL이 실행 중인지 확인');
    console.log('2. .env 파일의 데이터베이스 설정이 올바른지 확인');
    console.log('3. 데이터베이스가 생성되었는지 확인');
    process.exit(1);
  }
}

testConnection();

