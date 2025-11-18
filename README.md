# 커피 주문 앱 (Coffee Order App)

커피 주문 및 관리 시스템입니다. React + Vite 프론트엔드와 Node.js + Express + PostgreSQL 백엔드로 구성되어 있습니다.

## 프로젝트 구조

```
order-app/
├── ui/          # 프론트엔드 (React + Vite)
├── server/      # 백엔드 (Node.js + Express + PostgreSQL)
└── docs/        # 문서 (PRD 등)
```

## 사전 요구사항

1. **Node.js** (v16 이상)
2. **PostgreSQL** (v12 이상)
3. **npm** 또는 **yarn**

## 설치 및 실행 방법

### 1단계: PostgreSQL 실행 확인

PostgreSQL이 설치되어 있고 실행 중인지 확인하세요.

### 2단계: 백엔드 서버 설정 및 실행

```bash
# server 폴더로 이동
cd server

# 의존성 설치
npm install

# 환경 변수 설정 (.env 파일 생성)
# .env 파일에 다음 내용을 입력하세요:
# PORT=3000
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=coffee_order_db
# DB_USER=postgres
# DB_PASSWORD=your_password

# 데이터베이스 및 테이블 생성 (최초 1회만 실행)
npm run setup:db

# 백엔드 서버 실행 (개발 모드)
npm run dev
```

백엔드 서버는 **포트 3000**에서 실행됩니다.

### 3단계: 프론트엔드 개발 서버 실행

**새 터미널 창**을 열고:

```bash
# 프로젝트 루트로 이동
cd order-app

# ui 폴더로 이동
cd ui

# 의존성 설치 (최초 1회만)
npm install

# 프론트엔드 개발 서버 실행
npm run dev
```

프론트엔드 개발 서버는 **포트 5173**에서 실행됩니다.

### 4단계: 브라우저에서 접속

브라우저에서 다음 주소로 접속하세요:
- **http://localhost:5173**

## 실행 순서 요약

1. **터미널 1** (백엔드):
   ```bash
   cd server
   npm run dev
   ```

2. **터미널 2** (프론트엔드):
   ```bash
   cd ui
   npm run dev
   ```

3. 브라우저에서 **http://localhost:5173** 접속

## 주요 기능

### 주문 화면
- 커피 메뉴 조회
- 옵션 선택 (샷 추가, 시럽 추가 등)
- 장바구니 관리
- 주문하기

### 관리자 화면
- 주문 현황 대시보드
- 재고 관리
- 주문 상태 변경 (주문 접수 → 제조 시작 → 제조 완료)

## API 엔드포인트

### 메뉴
- `GET /api/menus` - 메뉴 목록 조회

### 주문
- `POST /api/orders` - 주문 생성
- `GET /api/orders/:orderId` - 주문 상세 조회

### 관리자
- `GET /api/admin/dashboard/stats` - 주문 상태 통계
- `GET /api/admin/inventory` - 재고 목록 조회
- `PUT /api/admin/inventory/:menuId` - 재고 업데이트
- `GET /api/admin/orders` - 주문 목록 조회
- `PUT /api/admin/orders/:orderId/status` - 주문 상태 업데이트

## 문제 해결

### 데이터베이스 연결 오류
- PostgreSQL이 실행 중인지 확인
- `.env` 파일의 데이터베이스 정보가 올바른지 확인
- `npm run test:db` 명령어로 데이터베이스 연결 테스트

### 포트 충돌
- 백엔드: `.env` 파일에서 `PORT` 변경
- 프론트엔드: `vite.config.js`에서 `server.port` 변경

## 추가 정보

- 백엔드 상세 문서: `server/README.md`
- 프론트엔드 상세 문서: `ui/README.md`
- PRD 문서: `docs/PRD.md`

