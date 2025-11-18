# 프론트엔드 배포 오류 해결 가이드

## 문제: "메뉴를 불러오는 중 오류가 발생했습니다"

### 증상
- 브라우저 콘솔에서 `GET http://localhost:3000/api/menus 500 (Internal Server Error)` 오류
- 프론트엔드가 배포된 환경에서도 `localhost:3000`으로 API 호출

### 원인
`VITE_API_BASE_URL` 환경 변수가 Render.com에서 제대로 설정되지 않았거나, 빌드 시점에 포함되지 않았습니다.

## 해결 방법

### 1단계: Render.com 환경 변수 확인 및 수정

1. **Render.com 대시보드 로그인**
2. **프론트엔드 서비스 선택** (예: `order-app-frontend-rivi`)
3. **"Environment"** 탭 클릭
4. **환경 변수 확인**:
   - `VITE_API_BASE_URL`이 있는지 확인
   - 값이 올바른지 확인

5. **환경 변수 수정 또는 추가**:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://order-app-nvpb.onrender.com/api` ⚠️ **중요: `/api` 포함 필수!**
   
   > 백엔드 서버 URL이 다른 경우, 실제 백엔드 URL로 변경하세요.
   > 예: `https://your-backend-name.onrender.com/api`

6. **"Save Changes"** 클릭
7. **자동 재배포 대기** (약 2-5분)

### 2단계: 빌드 로그 확인

1. Render.com 대시보드 → 프론트엔드 서비스
2. **"Logs"** 탭 클릭
3. 빌드 로그에서 다음 확인:
   - 환경 변수가 제대로 로드되었는지
   - 빌드 오류가 없는지

### 3단계: 배포 확인

1. 배포 완료 후 브라우저에서 접속
2. **개발자 도구(F12) → Console** 열기
3. 다음 명령어로 환경 변수 확인:
   ```javascript
   console.log(import.meta.env.VITE_API_BASE_URL)
   ```
4. 예상 결과: `https://order-app-nvpb.onrender.com/api`
5. 만약 `undefined` 또는 `http://localhost:3000/api`가 나오면:
   - 환경 변수가 제대로 설정되지 않은 것
   - 재배포 필요

### 4단계: 수동 재배포 (필요한 경우)

환경 변수를 수정했는데도 자동 재배포가 안 되는 경우:

1. Render.com 대시보드 → 프론트엔드 서비스
2. **"Manual Deploy"** → **"Deploy latest commit"** 클릭
3. 배포 완료 대기

## 환경 변수 설정 체크리스트

✅ **Key 이름**: `VITE_API_BASE_URL` (대소문자 정확히)
✅ **Value 형식**: `https://your-backend-url.onrender.com/api`
✅ **URL 끝에 `/api` 포함**: 필수!
✅ **백엔드 URL 확인**: 실제 배포된 백엔드 서버 URL 사용
✅ **저장 후 재배포**: 환경 변수 변경 후 자동 또는 수동 재배포

## 백엔드 URL 확인 방법

1. Render.com 대시보드 → 백엔드 서비스 선택
2. **"Settings"** 탭에서 **"URL"** 확인
3. 예: `https://order-app-nvpb.onrender.com`
4. 프론트엔드 환경 변수에는 `/api`를 추가: `https://order-app-nvpb.onrender.com/api`

## 추가 디버깅

### 브라우저 콘솔에서 API URL 확인

```javascript
// 현재 사용 중인 API URL 확인
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api')

// 모든 환경 변수 확인
console.log('All env vars:', import.meta.env)
```

### Network 탭에서 요청 확인

1. 개발자 도구(F12) → **Network** 탭
2. 페이지 새로고침
3. `/api/menus` 요청 확인
4. **Request URL**이 올바른 백엔드 URL인지 확인

## 예상되는 정상 동작

✅ **정상**: `https://order-app-nvpb.onrender.com/api/menus`
❌ **오류**: `http://localhost:3000/api/menus`

## 여전히 문제가 있는 경우

1. **백엔드 서버 상태 확인**
   - 백엔드 서버가 실행 중인지 확인
   - `https://order-app-nvpb.onrender.com/health` 접속하여 확인

2. **CORS 설정 확인**
   - 백엔드 서버의 CORS 설정이 프론트엔드 도메인을 허용하는지 확인

3. **빌드 캐시 삭제**
   - Render.com에서 서비스 삭제 후 재생성 (최후의 수단)

