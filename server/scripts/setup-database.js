require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  // 먼저 postgres 데이터베이스에 연결하여 새 데이터베이스 생성
  const adminPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'postgres', // 기본 데이터베이스
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  });

  const dbName = process.env.DB_NAME || 'coffee_order_db';

  try {
    console.log('데이터베이스 설정을 시작합니다...');
    console.log('');

    // 데이터베이스 존재 여부 확인
    const dbCheckResult = await adminPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (dbCheckResult.rows.length === 0) {
      console.log(`📦 데이터베이스 "${dbName}" 생성 중...`);
      await adminPool.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ 데이터베이스 "${dbName}" 생성 완료!`);
    } else {
      console.log(`ℹ️  데이터베이스 "${dbName}"가 이미 존재합니다.`);
    }

    await adminPool.end();

    // 이제 생성된 데이터베이스에 연결
    const pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: dbName,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
    });

    // SQL 파일 읽기 및 실행
    const createTableSQL = fs.readFileSync(
      path.join(__dirname, 'create-database.sql'),
      'utf8'
    );

    console.log('');
    console.log('📋 테이블 생성 중...');
    await pool.query(createTableSQL);
    console.log('✅ 테이블 생성 완료!');

    // 샘플 데이터 삽입 여부 확인
    const menuCheck = await pool.query('SELECT COUNT(*) as count FROM menus');
    if (parseInt(menuCheck.rows[0].count) === 0) {
      console.log('');
      console.log('📦 샘플 데이터 삽입 중...');
      const seedSQL = fs.readFileSync(
        path.join(__dirname, 'seed-data.sql'),
        'utf8'
      );
      await pool.query(seedSQL);
      console.log('✅ 샘플 데이터 삽입 완료!');
    } else {
      console.log('');
      console.log('ℹ️  샘플 데이터가 이미 존재합니다.');
    }

    // 최종 확인
    console.log('');
    console.log('📊 데이터베이스 상태:');
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    tablesResult.rows.forEach(row => {
      console.log(`  ✓ ${row.table_name}`);
    });

    const menuCount = await pool.query('SELECT COUNT(*) as count FROM menus');
    const optionCount = await pool.query('SELECT COUNT(*) as count FROM options');
    console.log('');
    console.log(`  메뉴: ${menuCount.rows[0].count}개`);
    console.log(`  옵션: ${optionCount.rows[0].count}개`);

    await pool.end();

    console.log('');
    console.log('🎉 데이터베이스 설정이 완료되었습니다!');
    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('❌ 오류 발생:');
    console.error(error.message);
    console.log('');
    console.log('다음을 확인하세요:');
    console.log('1. PostgreSQL이 실행 중인지 확인');
    console.log('2. .env 파일의 데이터베이스 설정이 올바른지 확인');
    console.log('3. PostgreSQL 사용자 권한 확인');
    process.exit(1);
  }
}

setupDatabase();

