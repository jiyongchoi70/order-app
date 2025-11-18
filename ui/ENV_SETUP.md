# 환경 변수 설정 가이드

## 로컬 개발 환경

### 1. `.env` 파일 생성

`ui` 폴더에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
VITE_API_BASE_URL=https://order-app-nvpb.onrender.com
```

### 2. 파일 위치

```
ui/
├── .env          ← 여기에 생성
├── .env.example  ← 예제 파일 (참고용)
├── src/
└── ...
```

### 3. 사용 방법

- 로컬 개발: `VITE_API_BASE_URL=https://order-app-nvpb.onrender.com`
- 배포 환경: Render.com에서 환경 변수로 설정 (아래 참고)

## Render.com 배포 환경

### 환경 변수 설정 위치

Render.com 대시보드에서 설정합니다:

1. Render.com 대시보드 로그인
2. 프론트엔드 서비스 선택 (예: `coffee-order-app`)
3. **"Environment"** 탭 클릭
4. **"Add Environment Variable"** 클릭
5. 다음 입력:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://coffee-order-api.onrender.com/api`
6. **"Save Changes"** 클릭
7. 자동으로 재배포됨

### 중요 사항

- ✅ `VITE_` 접두사 필수 (Vite는 `VITE_`로 시작하는 환경 변수만 클라이언트에 노출)
- ✅ 백엔드 서버 URL은 실제 배포된 URL로 변경
- ✅ URL 끝에 `/api` 포함
- ❌ `.env` 파일을 Git에 커밋하지 마세요 (`.gitignore`에 포함됨)

## 환경 변수 확인

### 로컬 개발

개발 서버 실행 시 콘솔에서 확인:
```bash
cd ui
npm run dev
```

브라우저 개발자 도구(F12) → Console에서:
```javascript
console.log(import.meta.env.VITE_API_BASE_URL)
```

### 배포 환경

배포 후 브라우저 개발자 도구(F12) → Console에서:
```javascript
console.log(import.meta.env.VITE_API_BASE_URL)
```

## 문제 해결

### 환경 변수가 적용되지 않는 경우

1. **파일 이름 확인**: `.env` (점으로 시작)
2. **파일 위치 확인**: `ui` 폴더 루트에 있어야 함
3. **변수 이름 확인**: `VITE_API_BASE_URL` (대소문자 구분)
4. **개발 서버 재시작**: 환경 변수 변경 후 서버 재시작 필요

### Render.com에서 환경 변수가 적용되지 않는 경우

1. 환경 변수 이름이 `VITE_API_BASE_URL`인지 확인
2. 환경 변수 저장 후 재배포 확인
3. 빌드 로그에서 환경 변수 확인

