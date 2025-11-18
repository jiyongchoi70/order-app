# 데이터베이스 연결 오류 해결 가이드

## 문제

백엔드 서버에서 데이터베이스 연결 오류 발생:
```
Error: getaddrinfo ENOTFOUND postgresql://order_app_db_doen_user:...
```

## 원인

`DATABASE_URL` 환경 변수가 제대로 파싱되지 않아 전체 URL이 hostname으로 잘못 해석되고 있습니다.

## 해결 방법

### 1단계: Render.com 환경 변수 확인

Render.com 백엔드 서비스에서 환경 변수를 확인하세요:

1. **Render.com 대시보드** → **백엔드 서비스** 선택
2. **"Environment"** 탭 클릭
3. **환경 변수 확인**:
   - `DATABASE_URL`이 있는지 확인
   - 값이 올바른 PostgreSQL URL 형식인지 확인

### 2단계: DATABASE_URL 설정

Render.com PostgreSQL 데이터베이스는 자동으로 `DATABASE_URL` 환경 변수를 제공합니다.

**확인 방법:**
1. Render.com 대시보드 → PostgreSQL 데이터베이스 선택
2. **"Connections"** 탭 클릭
3. **"Internal Database URL"** 복사
4. 백엔드 서비스의 환경 변수에 `DATABASE_URL`로 설정되어 있는지 확인

**중요:**
- `DATABASE_URL`은 Render.com이 자동으로 제공하므로 별도로 설정할 필요가 없을 수 있습니다
- 만약 수동으로 설정해야 한다면, **Internal Database URL**을 사용하세요
- **External Database URL**은 외부 접속용이므로 사용하지 마세요

### 3단계: DB_HOST 환경 변수 제거

`DB_HOST`에 전체 URL이 들어가 있는 경우:

1. Render.com 대시보드 → 백엔드 서비스 → Environment 탭
2. `DB_HOST` 환경 변수가 전체 URL 형식(`postgresql://...`)인지 확인
3. 전체 URL 형식이면 **삭제**하세요
4. `DATABASE_URL`만 사용하도록 설정

### 4단계: 백엔드 서버 재배포

1. 코드가 Git에 푸시되었는지 확인
2. Render.com에서 자동 재배포 대기
3. 또는 수동 재배포: **"Manual Deploy"** → **"Deploy latest commit"**

### 5단계: 확인

1. Render.com 대시보드 → 백엔드 서비스 → **"Logs"** 탭
2. 다음 메시지가 보이는지 확인:
   ```
   DATABASE_URL을 사용하여 데이터베이스에 연결합니다.
   PostgreSQL 데이터베이스에 연결되었습니다.
   ```
3. 오류가 없으면 정상입니다

## 환경 변수 설정 예시

### 올바른 설정

```
DATABASE_URL=postgresql://user:password@host:port/database
```

또는 Render.com이 자동으로 제공하는 경우:
- 환경 변수에 `DATABASE_URL`이 자동으로 추가됨
- 별도 설정 불필요

### 잘못된 설정

```
DB_HOST=postgresql://user:password@host:port/database  ❌
```

이 경우 `DB_HOST`를 삭제하고 `DATABASE_URL`만 사용하세요.

## 문제 해결

### 여전히 연결 오류가 발생하는 경우

1. **데이터베이스 상태 확인**
   - Render.com 대시보드 → PostgreSQL 데이터베이스
   - 데이터베이스가 실행 중인지 확인

2. **환경 변수 확인**
   - 백엔드 서비스 → Environment 탭
   - `DATABASE_URL`이 올바른 형식인지 확인
   - `DB_HOST`에 URL이 들어가 있지 않은지 확인

3. **로그 확인**
   - 백엔드 서비스 → Logs 탭
   - 연결 관련 오류 메시지 확인

4. **데이터베이스 연결 테스트**
   - Render.com Shell을 사용하여 연결 테스트:
     ```bash
     npm run test:db
     ```

## 참고

- Render.com PostgreSQL은 `DATABASE_URL` 환경 변수를 자동으로 제공합니다
- Internal Database URL은 Render.com 내부 네트워크에서만 접근 가능합니다
- External Database URL은 외부에서 접속할 때만 사용합니다

