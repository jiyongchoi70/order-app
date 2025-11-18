require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  // Render.com에서는 DATABASE_URL을 사용, 로컬에서는 개별 환경 변수 사용
  let pool;
  
  // DATABASE_URL 또는 DB_HOST에 PostgreSQL URL이 있는지 확인
  // DB_HOST에 URL이 들어있는 경우도 처리
  let databaseUrl = process.env.DATABASE_URL;
  
  // DATABASE_URL이 PostgreSQL URL이 아니고, DB_HOST에 URL이 있으면 DB_HOST 사용
  const isCurrentUrlPostgres = databaseUrl && (
    databaseUrl.startsWith('postgres://') || 
    databaseUrl.startsWith('postgresql://')
  );
  
  if (!isCurrentUrlPostgres && process.env.DB_HOST && process.env.DB_HOST.includes('://')) {
    const dbHostUrl = process.env.DB_HOST;
    const isDbHostPostgres = dbHostUrl.startsWith('postgres://') || dbHostUrl.startsWith('postgresql://');
    if (isDbHostPostgres) {
      databaseUrl = dbHostUrl;
      console.log('DB_HOST에서 PostgreSQL URL을 감지하여 사용합니다.');
    }
  }
  
  const isPostgresUrl = databaseUrl && (
    databaseUrl.startsWith('postgres://') || 
    databaseUrl.startsWith('postgresql://')
  );
  
  if (databaseUrl && !isPostgresUrl) {
    console.log('경고: DATABASE_URL이 PostgreSQL 형식이 아닙니다:', databaseUrl.substring(0, 50) + '...');
  }
  
  if (isPostgresUrl) {
    // Render.com 또는 DATABASE_URL이 제공된 경우
    console.log('DATABASE_URL을 사용하여 데이터베이스에 연결합니다...');
    console.log('연결 정보:', databaseUrl.replace(/:[^:@]+@/, ':****@')); // 비밀번호 숨김
    
    // DATABASE_URL이 postgres://로 시작하면 postgresql://로 변환
    let url = databaseUrl;
    if (url.startsWith('postgres://')) {
      url = url.replace('postgres://', 'postgresql://');
    }
    
    // Render.com External Database URL은 항상 SSL이 필요
    // Internal Database URL도 SSL이 필요할 수 있음
    pool = new Pool({
      connectionString: url,
      ssl: { rejectUnauthorized: false },
    });
  } else {
    // 로컬 개발 환경: 먼저 postgres 데이터베이스에 연결하여 새 데이터베이스 생성
    // DB_HOST에 URL이 들어있는 경우는 이미 위에서 처리했으므로 여기서는 hostname만 사용
    const dbHost = process.env.DB_HOST || 'localhost';
    
    // DB_HOST가 URL 형식이면 에러 (이미 위에서 처리되어야 함)
    if (dbHost.includes('://')) {
      console.error('오류: DB_HOST에 전체 URL이 들어있습니다.');
      console.error('해결 방법: .env 파일에서 DB_HOST 대신 DATABASE_URL을 사용하세요.');
      console.error('예: DATABASE_URL=' + dbHost);
      throw new Error('DB_HOST에 전체 URL이 들어있습니다. DATABASE_URL 환경 변수를 사용하거나, DB_HOST에는 호스트명만 입력하세요.');
    }
    
    const adminPool = new Pool({
      host: dbHost,
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
      pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: dbName,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
      });
    } catch (error) {
      console.error('데이터베이스 생성 오류:', error);
      throw error;
    }
  }

  try {
    // SQL 파일 읽기 및 실행
    if (process.env.DATABASE_URL) {
      console.log('📋 테이블 생성 중...');
    } else {
      console.log('');
      console.log('📋 테이블 생성 중...');
    }
    
    const createTableSQL = fs.readFileSync(
      path.join(__dirname, 'create-database.sql'),
      'utf8'
    );
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

