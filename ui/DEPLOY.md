# 프론트엔드 Render.com 배포 가이드

이 문서는 프론트엔드(React + Vite)를 Render.com에 배포하는 방법을 설명합니다.

## 사전 준비

1. **백엔드 서버가 배포되어 있어야 합니다**
   - 백엔드 서버의 URL을 확인하세요 (예: `https://coffee-order-api.onrender.com`)
   - 백엔드 서버가 정상적으로 작동하는지 확인하세요

2. **GitHub 저장소에 코드가 푸시되어 있어야 합니다**
   - 모든 변경사항을 커밋하고 푸시하세요

## 코드 확인

프론트엔드 코드는 이미 배포 준비가 되어 있습니다:

- ✅ `ui/src/utils/api.js`에서 환경 변수 `VITE_API_BASE_URL` 사용
- ✅ 로컬 개발 시 기본값으로 `http://localhost:3000/api` 사용
- ✅ 빌드 스크립트: `npm run build`
- ✅ 빌드 출력 디렉토리: `dist`

## Render.com 배포 과정

### 1단계: Static Site 생성

1. Render.com 대시보드에 로그인
2. **"New +"** 버튼 클릭
3. **"Static Site"** 선택

### 2단계: 저장소 연결

1. **"Connect account"** 또는 **"Connect repository"** 클릭
2. GitHub 계정 연결 (처음인 경우)
3. 저장소 선택:
   - 저장소: `order-app` (또는 프로젝트 이름)
   - Branch: `main` (또는 기본 브랜치)

### 3단계: 빌드 설정

다음 설정을 입력하세요:

- **Name**: `coffee-order-app` (원하는 이름)
- **Branch**: `main` (또는 기본 브랜치)
- **Root Directory**: `ui` ⚠️ **중요!**
- **Build Command**: 
  ```bash
  npm install && npm run build
  ```
- **Publish Directory**: `dist`

### 4단계: 환경 변수 설정

**Environment Variables** 섹션에서 다음 환경 변수를 추가하세요:

```
VITE_API_BASE_URL=https://coffee-order-api.onrender.com/api
```

> **중요**: 
> - `VITE_` 접두사가 필수입니다. Vite는 `VITE_`로 시작하는 환경 변수만 클라이언트에 노출합니다.
> - 백엔드 서버 URL은 실제 배포된 URL로 변경하세요.
> - URL 끝에 `/api`를 포함해야 합니다.

### 5단계: 배포 시작

1. **"Create Static Site"** 버튼 클릭
2. 배포가 시작됩니다 (약 2-5분 소요)
3. 빌드 로그를 확인하여 오류가 없는지 확인

### 6단계: 배포 확인

1. 배포가 완료되면 프론트엔드 URL이 생성됩니다 (예: `https://coffee-order-app.onrender.com`)
2. 브라우저에서 접속하여 확인:
   - 메뉴 목록이 표시되는지 확인
   - 브라우저 개발자 도구(F12) → Network 탭에서 API 요청이 성공하는지 확인
   - 주문 기능 테스트
   - 관리자 화면 테스트

## 배포 후 확인 사항

### ✅ 정상 작동 확인

1. **메뉴 목록 로드**
   - 주문 화면에서 메뉴가 정상적으로 표시되는지 확인
   - 이미지가 정상적으로 로드되는지 확인

2. **API 연결 확인**
   - 브라우저 개발자 도구(F12) → Console 탭
   - API 요청 오류가 없는지 확인
   - Network 탭에서 API 응답이 정상인지 확인

3. **주문 기능 테스트**
   - 메뉴 선택 → 옵션 선택 → 장바구니 추가
   - 주문하기 버튼 클릭
   - 주문 완료 메시지 확인

4. **관리자 화면 테스트**
   - 관리자 화면으로 전환
   - 주문 현황, 재고 관리 기능 확인

## 문제 해결

### API 요청 실패 (CORS 오류)

**증상**: 브라우저 콘솔에 CORS 오류 메시지

**해결 방법**:
1. 백엔드 서버의 CORS 설정 확인
2. 백엔드 서버가 프론트엔드 도메인을 허용하는지 확인
3. 백엔드 서버 재시작

### 이미지가 표시되지 않음

**증상**: 메뉴 이미지가 표시되지 않음

**해결 방법**:
1. `public` 폴더의 이미지 파일이 Git에 커밋되었는지 확인
2. 이미지 경로가 `/coffee-ice.jpg` 형식인지 확인 (절대 경로)
3. 빌드 후 `dist` 폴더에 이미지가 포함되었는지 확인

### 환경 변수가 적용되지 않음

**증상**: API 요청이 여전히 `localhost:3000`으로 가는 경우

**해결 방법**:
1. Render.com의 환경 변수 설정 확인
2. 환경 변수 이름이 `VITE_API_BASE_URL`인지 확인 (대소문자 구분)
3. 빌드를 다시 시작 (환경 변수 변경 후 재배포 필요)

### 빌드 실패

**증상**: 빌드 로그에 오류 메시지

**해결 방법**:
1. 로컬에서 빌드 테스트:
   ```bash
   cd ui
   npm install
   npm run build
   ```
2. 빌드 오류를 수정
3. Git에 커밋하고 푸시
4. Render.com에서 자동으로 재배포됨

## 환경 변수 업데이트

환경 변수를 변경한 경우:

1. Render.com 대시보드 → 프론트엔드 서비스 선택
2. **"Environment"** 탭으로 이동
3. 환경 변수 수정
4. **"Save Changes"** 클릭
5. 자동으로 재배포됨

## 자동 배포

Render.com은 기본적으로 Git 푸시 시 자동으로 재배포됩니다:

1. 코드 수정
2. Git 커밋 및 푸시
3. Render.com이 자동으로 감지하여 재배포

자동 배포를 비활성화하려면:
- 서비스 설정 → **"Auto-Deploy"** 옵션을 끄기

## 성능 최적화 (선택사항)

### Vite 빌드 최적화

`vite.config.js`에 다음 설정을 추가할 수 있습니다:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
})
```

## 참고 자료

- [Render.com Static Sites 문서](https://render.com/docs/static-sites)
- [Vite 환경 변수 문서](https://vitejs.dev/guide/env-and-mode.html)
- [Vite 배포 가이드](https://vitejs.dev/guide/static-deploy.html)

