# CORS 오류 해결 가이드

## 문제

프론트엔드에서 백엔드 API 호출 시 CORS 오류 발생:
```
Access to fetch at 'https://order-app-nypb.onrender.com/api/menus' 
from origin 'https://order-app-frontend-rivi.onrender.com' 
has been blocked by CORS policy
```

## 해결 방법

### 1단계: 백엔드 서버 CORS 설정 확인

백엔드 서버(`server/index.js`)에서 CORS 설정이 업데이트되었는지 확인하세요.

### 2단계: Render.com 환경 변수 설정

Render.com 백엔드 서비스에서 환경 변수를 추가하세요:

1. **Render.com 대시보드** → **백엔드 서비스** 선택
2. **"Environment"** 탭 클릭
3. **환경 변수 추가**:
   - **Key**: `ALLOWED_ORIGINS`
   - **Value**: `https://order-app-frontend-rivi.onrender.com`
   
   여러 프론트엔드 도메인이 있는 경우 쉼표로 구분:
   ```
   https://order-app-frontend-rivi.onrender.com,https://order-app-frontend.onrender.com
   ```

4. **"Save Changes"** 클릭
5. **백엔드 서버 재배포** (자동 또는 수동)

### 3단계: 백엔드 서버 재배포

1. Render.com 대시보드 → 백엔드 서비스
2. **"Manual Deploy"** → **"Deploy latest commit"** 클릭
3. 배포 완료 대기

### 4단계: 확인

1. 프론트엔드 페이지 새로고침
2. 개발자 도구(F12) → Network 탭
3. `/api/menus` 요청이 성공하는지 확인
4. Response Headers에 `Access-Control-Allow-Origin` 헤더가 있는지 확인

## 환경 변수 설정 예시

### 단일 프론트엔드 도메인
```
ALLOWED_ORIGINS=https://order-app-frontend-rivi.onrender.com
```

### 여러 프론트엔드 도메인
```
ALLOWED_ORIGINS=https://order-app-frontend-rivi.onrender.com,https://order-app-frontend.onrender.com,http://localhost:5173
```

## 문제 해결

### 여전히 CORS 오류가 발생하는 경우

1. **백엔드 서버 로그 확인**
   - Render.com 대시보드 → 백엔드 서비스 → Logs 탭
   - CORS 관련 오류 메시지 확인

2. **환경 변수 확인**
   - `ALLOWED_ORIGINS` 환경 변수가 올바르게 설정되었는지 확인
   - 프론트엔드 URL이 정확한지 확인 (http/https, 도메인명)

3. **브라우저 캐시 삭제**
   - 하드 새로고침: `Ctrl + Shift + R` (Windows) 또는 `Cmd + Shift + R` (Mac)

4. **OPTIONS 요청 확인**
   - 개발자 도구 → Network 탭
   - OPTIONS 요청이 성공하는지 확인
   - OPTIONS 요청이 실패하면 CORS 설정이 제대로 작동하지 않는 것

## 참고

- CORS는 브라우저 보안 정책입니다
- 서버에서 `Access-Control-Allow-Origin` 헤더를 보내야 합니다
- Preflight 요청(OPTIONS)도 처리해야 합니다

