# 커피 주문 앱 - 프런트엔드

커피 주문 앱의 프런트엔드 프로젝트입니다.

## 기술 스택

- **React** 19.2.0
- **Vite** 7.2.2
- **JavaScript** (Vanilla JavaScript)

## 개발 환경 설정

### 필수 요구사항

- Node.js (v18 이상 권장)
- npm

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

개발 서버가 실행되면 브라우저에서 `http://localhost:5173` (또는 표시된 포트)로 접속할 수 있습니다.

### 빌드

프로덕션 빌드를 생성하려면:

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

### 빌드 미리보기

빌드된 앱을 미리보려면:

```bash
npm run preview
```

## 프로젝트 구조

```
ui/
├── public/          # 정적 파일
├── src/
│   ├── assets/      # 이미지, 폰트 등 리소스
│   ├── App.jsx      # 메인 App 컴포넌트
│   ├── main.jsx     # 애플리케이션 진입점
│   └── index.css    # 전역 스타일
├── index.html       # HTML 템플릿
├── vite.config.js   # Vite 설정
└── package.json     # 프로젝트 의존성 및 스크립트
```

## 주요 기능

- 주문하기 화면 (메뉴 선택 및 장바구니 기능)
- 관리자 화면 (재고 관리 및 주문 상태 관리)

## 개발 가이드

자세한 내용은 프로젝트 루트의 `docs/PRD.md` 파일을 참고하세요.
