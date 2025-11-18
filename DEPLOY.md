# Render.com 배포 가이드

이 문서는 커피 주문 앱을 Render.com에 배포하는 방법을 설명합니다.

## 배포 순서

### 1단계: PostgreSQL 데이터베이스 생성

1. Render.com 대시보드에 로그인
2. **"New +"** 버튼 클릭 → **"PostgreSQL"** 선택
3. 데이터베이스 설정:
   - **Name**: `coffee-order-db` (원하는 이름)
   - **Database**: `coffee_order_db`
   - **User**: 자동 생성됨
   - **Region**: 가장 가까운 지역 선택
   - **PostgreSQL Version**: 최신 버전 선택
   - **Plan**: Free 또는 원하는 플랜 선택
4. **"Create Database"** 클릭
5. 데이터베이스가 생성되면 **"Connections"** 탭에서 다음 정보를 복사해두세요:
   - **Internal Database URL** (백엔드에서 사용)
   - **External Database URL** (로컬에서 접속 시 사용)

### 2단계: 백엔드 서버 배포

1. Render.com 대시보드에서 **"New +"** 버튼 클릭 → **"Web Service"** 선택
2. GitHub 저장소 연결:
   - GitHub 저장소를 선택하거나 연결
   - **Branch**: `main` (또는 기본 브랜치)
3. 서비스 설정:
   - **Name**: `coffee-order-api` (원하는 이름)
   - **Region**: 데이터베이스와 동일한 지역 선택
   - **Branch**: `main`
   - **Root Directory**: `server` (중요!)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free 또는 원하는 플랜 선택
4. 환경 변수 설정 (Environment Variables):
   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=<데이터베이스 호스트>
   DB_PORT=5432
   DB_NAME=coffee_order_db
   DB_USER=<데이터베이스 사용자>
   DB_PASSWORD=<데이터베이스 비밀번호>
   ```
   
   또는 **Internal Database URL**을 사용하는 경우:
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=<Internal Database URL>
   ```
   
   > **참고**: Render.com의 PostgreSQL은 `DATABASE_URL` 환경 변수를 자동으로 제공합니다.
   > `server/config/database.js`에서 `DATABASE_URL`을 우선 사용하도록 설정되어 있습니다.

5. **"Create Web Service"** 클릭
6. 배포가 완료되면 백엔드 URL을 복사해두세요 (예: `https://coffee-order-api.onrender.com`)

### 3단계: 데이터베이스 초기화

백엔드 서버가 배포된 후, 데이터베이스를 초기화해야 합니다.

**방법 1: Render.com Shell 사용 (권장)**

1. 백엔드 서비스의 **"Shell"** 탭으로 이동
2. 다음 명령어 실행:
   ```bash
   npm run setup:db
   ```

**방법 2: 로컬에서 실행**

1. 로컬 터미널에서:
   ```bash
   cd server
   ```
2. `.env` 파일에 External Database URL 설정:
   ```env
   DATABASE_URL=<External Database URL>
   ```
3. 다음 명령어 실행:
   ```bash
   npm run setup:db
   ```

### 4단계: 프론트엔드 배포

1. Render.com 대시보드에서 **"New +"** 버튼 클릭 → **"Static Site"** 선택
2. GitHub 저장소 연결:
   - 동일한 GitHub 저장소 선택
   - **Branch**: `main`
3. 빌드 설정:
   - **Name**: `coffee-order-app` (원하는 이름)
   - **Root Directory**: `ui` (중요!)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. 환경 변수 설정 (Environment Variables):
   ```
   VITE_API_BASE_URL=https://coffee-order-api.onrender.com/api
   ```
   > **중요**: `VITE_` 접두사가 필요합니다. Vite는 `VITE_`로 시작하는 환경 변수만 클라이언트에 노출합니다.

5. **"Create Static Site"** 클릭
6. 배포가 완료되면 프론트엔드 URL을 확인하세요 (예: `https://coffee-order-app.onrender.com`)

## 배포 후 확인 사항

1. **프론트엔드 접속**: 프론트엔드 URL로 접속하여 화면이 정상적으로 표시되는지 확인
2. **API 연결 확인**: 브라우저 개발자 도구(F12) → Network 탭에서 API 요청이 성공하는지 확인
3. **주문 기능 테스트**: 메뉴 선택 → 장바구니 추가 → 주문하기 테스트
4. **관리자 화면 테스트**: 관리자 화면에서 주문 현황, 재고 관리 기능 테스트

## 문제 해결

### 백엔드 서버가 시작되지 않는 경우
- 환경 변수가 올바르게 설정되었는지 확인
- Build Logs와 Runtime Logs 확인
- `server/package.json`의 `start` 스크립트 확인

### 데이터베이스 연결 오류
- `DATABASE_URL` 또는 데이터베이스 관련 환경 변수가 올바른지 확인
- Internal Database URL을 사용하는지 확인 (External URL은 외부 접속용)
- 데이터베이스가 생성되었는지 확인

### 프론트엔드에서 API 호출 실패
- `VITE_API_BASE_URL` 환경 변수가 올바르게 설정되었는지 확인
- 백엔드 서버가 실행 중인지 확인
- CORS 설정 확인 (백엔드에서 모든 origin 허용하도록 설정되어 있음)

### 이미지가 표시되지 않는 경우
- `public` 폴더의 이미지 파일이 Git에 커밋되었는지 확인
- 이미지 경로가 `/coffee-ice.jpg` 형식인지 확인 (절대 경로)

## 주의사항

1. **Free 플랜 제한사항**:
   - 서비스가 15분간 비활성 상태이면 자동으로 sleep 모드로 전환됨
   - 첫 요청 시 깨어나는 데 시간이 걸릴 수 있음 (Cold Start)
   - 데이터베이스는 90일간 비활성 시 삭제될 수 있음

2. **환경 변수 보안**:
   - 민감한 정보는 환경 변수로 관리
   - `.env` 파일은 Git에 커밋하지 않음 (`.gitignore`에 포함)

3. **데이터베이스 백업**:
   - 정기적으로 데이터베이스 백업 권장
   - Render.com의 PostgreSQL은 자동 백업 기능 제공 (유료 플랜)

## 추가 최적화

### 백엔드 헬스체크 엔드포인트 추가
Render.com이 서비스 상태를 확인할 수 있도록 헬스체크 엔드포인트를 추가할 수 있습니다:

```javascript
// server/index.js
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
```

### 프론트엔드 빌드 최적화
`vite.config.js`에서 빌드 최적화 설정을 추가할 수 있습니다:

```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
  },
});
```

## 참고 자료

- [Render.com 공식 문서](https://render.com/docs)
- [Render.com PostgreSQL 가이드](https://render.com/docs/databases)
- [Render.com Node.js 가이드](https://render.com/docs/node)

