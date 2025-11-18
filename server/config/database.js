const { Pool } = require('pg');

// Render.com에서는 DATABASE_URL을 제공하므로 우선 사용
// 없으면 개별 환경 변수 사용
let poolConfig;

// DATABASE_URL이 PostgreSQL URL 형식인지 확인
const databaseUrl = process.env.DATABASE_URL || process.env.DB_HOST;
const isPostgresUrl = databaseUrl && (
  databaseUrl.startsWith('postgres://') || 
  databaseUrl.startsWith('postgresql://')
);

if (isPostgresUrl) {
  // DATABASE_URL이 postgres://로 시작하면 postgresql://로 변환
  let url = databaseUrl;
  if (url.startsWith('postgres://')) {
    url = url.replace('postgres://', 'postgresql://');
  }
  
  poolConfig = {
    connectionString: url,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  };
  
  console.log('DATABASE_URL을 사용하여 데이터베이스에 연결합니다.');
} else {
  // 개별 환경 변수 사용
  const dbHost = process.env.DB_HOST || 'localhost';
  
  // DB_HOST가 URL 형식이면 에러
  if (dbHost.includes('://')) {
    console.error('오류: DB_HOST에 전체 URL이 들어있습니다.');
    console.error('DATABASE_URL 환경 변수를 사용하거나, DB_HOST에는 호스트명만 입력하세요.');
    throw new Error('DB_HOST에 전체 URL이 들어있습니다. DATABASE_URL 환경 변수를 사용하세요.');
  }
  
  poolConfig = {
    host: dbHost,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'coffee_order_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  };
  
  console.log('개별 환경 변수를 사용하여 데이터베이스에 연결합니다.');
}

const pool = new Pool(poolConfig);

// 연결 테스트
pool.on('connect', () => {
  console.log('PostgreSQL 데이터베이스에 연결되었습니다.');
});

pool.on('error', (err) => {
  console.error('PostgreSQL 연결 오류:', err);
});

module.exports = pool;

