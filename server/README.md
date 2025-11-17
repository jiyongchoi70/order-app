# 커피 주문 앱 - 백엔드 서버

커피 주문 앱의 백엔드 API 서버입니다.

## 기술 스택

- **Node.js**
- **Express.js**
- **PostgreSQL**
- **pg** (PostgreSQL 클라이언트)

## 설치

```bash
npm install
```

## 환경 변수 설정

`.env.example` 파일을 참고하여 `.env` 파일을 생성하고 데이터베이스 정보를 입력하세요.

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_order_db
DB_USER=postgres
DB_PASSWORD=your_password
```

## 데이터베이스 설정

1. PostgreSQL이 설치되어 있어야 합니다.
2. `.env` 파일에서 데이터베이스 설정을 확인하세요:
   - `DB_HOST`: PostgreSQL 호스트 (기본값: localhost)
   - `DB_PORT`: PostgreSQL 포트 (기본값: 5432)
   - `DB_NAME`: 데이터베이스 이름 (기본값: coffee_order_db)
   - `DB_USER`: PostgreSQL 사용자 (기본값: postgres)
   - `DB_PASSWORD`: PostgreSQL 비밀번호 (실제 비밀번호로 변경 필요)

3. 데이터베이스 및 테이블 자동 생성:
```bash
npm run setup:db
```
이 명령어는 다음을 수행합니다:
- 데이터베이스 생성 (없는 경우)
- 모든 테이블 생성
- 샘플 메뉴 및 옵션 데이터 삽입

4. 데이터베이스 연결 테스트:
```bash
npm run test:db
```

## 실행

### 개발 모드 (nodemon 사용)
```bash
npm run dev
```

### 프로덕션 모드
```bash
npm start
```

서버는 기본적으로 포트 3000에서 실행됩니다.

## API 엔드포인트

### 메뉴 관련
- `GET /api/menus` - 메뉴 목록 조회

### 주문 관련
- `POST /api/orders` - 주문 생성
- `GET /api/orders/:orderId` - 주문 상세 조회

### 관리자 API
- `GET /api/admin/dashboard/stats` - 주문 상태 통계
- `GET /api/admin/inventory` - 재고 목록 조회
- `PUT /api/admin/inventory/:menuId` - 재고 업데이트
- `GET /api/admin/orders` - 주문 목록 조회
- `PUT /api/admin/orders/:orderId/status` - 주문 상태 업데이트

자세한 API 명세는 `docs/PRD.md`의 6.3 섹션을 참고하세요.

