#  커피 주문 앱

##  1. 프로젝트 개요

### 1.1 프로젝트 명
커피 주문 앱

### 1.2 프로젝트 목적
사용자가 커피 메뉴를 주문하고, 관리자가 주문을 관리할 수 있는 간단한 플스택 웹 앱

### 1.3 개발범위
- 주문하기 화면 (메뉴 선택 및 장바구니 기능)
- 관리자 화면(재고 관리 및 주문 상태 관리)
- 테이터를 생성/조회/수정/삭제할 수 있는 기능

## 2. 기술 스택
- 프런트 앤드 : HTML, CSS, 리엑트, 자바스크립트
- 백앤드 : Node.js, Express
- 데이터베이스 : PostgreSQL

## 3. 기본 사항
- 프런트앤드와 백앤드를 따로 개발
- 기본적인 웹 기술만 사용
- 학습 목적이므로 사용자 인증이나 결재 기능은 제외
- 메뉴는 커피 메뉴만 있음

## 4. 주문하기 화면 상세 사항

### 4.1 화면 구성
주문하기 화면은 크게 3개의 섹션으로 구성됩니다:
1. 헤더 (Header)
2. 메뉴 아이템 섹션 (Menu Items Section)
3. 장바구니 섹션 (Shopping Cart Section)

### 4.2 헤더 (Header)

#### 4.2.1 구성 요소
- **로고 영역**
  - 왼쪽 상단에 "COZY" 텍스트가 표시된 다크 그린 배경의 박스
  - 텍스트 색상: 흰색
  - 배경 색상: 다크 그린 (#2d5016 또는 유사한 색상)

- **네비게이션 버튼**
  - "주문하기" 버튼: 현재 화면으로 이동 (활성 상태)
  - "관리자" 버튼: 관리자 화면으로 이동
  - 버튼 위치: 로고 오른쪽에 가로로 배치

#### 4.2.2 기능 요구사항
- "관리자" 버튼 클릭 시 관리자 화면으로 이동
- "주문하기" 버튼은 현재 화면이므로 클릭해도 동일 화면 유지

### 4.3 메뉴 아이템 섹션 (Menu Items Section)

#### 4.3.1 레이아웃
- 메뉴 아이템은 카드 형태로 가로로 배치
- 반응형 디자인: 화면 크기에 따라 카드 개수 조정 (데스크톱: 3개 이상, 모바일: 1-2개)

#### 4.3.2 메뉴 카드 구성 요소
각 메뉴 카드는 다음 요소를 포함합니다:

1. **메뉴 이미지**
   - 상단에 메뉴 이미지 표시 영역
   - 이미지가 없을 경우 플레이스홀더 표시 (대각선이 그어진 흰색 박스)
   - 이미지 비율: 4:3 또는 16:9 권장

2. **메뉴 이름**
   - 메뉴의 이름 (예: "아메리카노(ICE)", "아메리카노(HOT)", "카페라떼")
   - 폰트 크기: 중간 크기, 굵게 표시

3. **가격**
   - 원화(₩) 단위로 표시
   - 천 단위 구분 기호 사용 (예: "4,000원", "5,000원")
   - 폰트 크기: 메뉴 이름보다 작게

4. **설명**
   - 메뉴에 대한 간단한 설명 텍스트
   - 예: "간단한 설명..."
   - 폰트 크기: 작은 크기, 회색 계열

5. **옵션 선택**
   - 체크박스 형태의 옵션 선택 UI
   - 각 옵션은 옵션명과 추가 가격을 함께 표시
   - 예시 옵션:
     - "샷 추가 (+500원)"
     - "시럽 추가 (+0원)"
   - 여러 옵션을 동시에 선택 가능
   - 옵션 선택 시 실시간으로 가격이 반영되어야 함

6. **담기 버튼**
   - 카드 하단에 회색 배경의 "담기" 버튼
   - 버튼 클릭 시 선택한 옵션과 함께 장바구니에 추가
   - 버튼 클릭 시 시각적 피드백 제공 (예: 버튼 색상 변경 또는 애니메이션)

#### 4.3.3 기능 요구사항
- 메뉴 목록은 백엔드 API를 통해 동적으로 로드
- 옵션 선택 시 해당 메뉴의 최종 가격이 실시간으로 계산되어 표시
- "담기" 버튼 클릭 시:
  - 선택한 메뉴와 옵션이 장바구니에 추가됨
  - 동일한 메뉴+옵션 조합이 이미 장바구니에 있으면 수량이 증가
  - 장바구니에 추가되었다는 시각적 피드백 제공 (예: 토스트 메시지 또는 장바구니 아이콘 애니메이션)
  - 옵션 선택 상태는 초기화되지 않음 (사용자가 여러 번 담을 수 있도록)

### 4.4 장바구니 섹션 (Shopping Cart Section)

#### 4.4.1 레이아웃
- 화면 하단에 고정된 영역으로 표시
- 배경색: 흰색 또는 연한 회색
- 테두리: 상단에 구분선 또는 그림자 효과

#### 4.4.2 구성 요소

1. **섹션 제목**
   - "장바구니" 텍스트 표시
   - 폰트 크기: 중간 크기, 굵게

2. **장바구니 아이템 목록**
   - 선택한 메뉴들이 리스트 형태로 표시
   - 각 아이템은 다음 정보를 포함:
     - 메뉴 이름
     - 선택한 옵션 (옵션이 있는 경우 괄호 안에 표시, 예: "(샷 추가)")
     - 수량 (예: "X 1", "X 2")
     - 아이템별 총 가격 (예: "4,500원", "8,000원")
   - 아이템 표시 형식 예시:
     - "아메리카노(ICE) (샷 추가) X 1 - 4,500원"
     - "아메리카노(HOT) X 2 - 8,000원"
   - 각 아이템 옆에 삭제 버튼 제공 (선택 사항)

3. **총 금액**
   - "총 금액" 레이블과 함께 전체 합계 금액 표시
   - 금액은 굵게 표시하여 강조
   - 천 단위 구분 기호 사용 (예: "12,500원")
   - 위치: 아이템 목록 오른쪽 또는 하단

4. **주문하기 버튼**
   - "주문하기" 텍스트가 표시된 회색 배경 버튼
   - 버튼 위치: 총 금액 아래 또는 오른쪽
   - 장바구니가 비어있을 경우 버튼 비활성화 또는 숨김

#### 4.4.3 기능 요구사항
- 장바구니에 아이템이 추가/삭제될 때마다 총 금액이 실시간으로 업데이트
- 동일한 메뉴+옵션 조합이 추가되면 별도 항목으로 추가하지 않고 수량 증가
- 장바구니 아이템 삭제 기능 (선택 사항)
- "주문하기" 버튼 클릭 시:
  - 주문 정보를 백엔드 API로 전송
  - 주문 성공 시 장바구니 초기화 및 성공 메시지 표시
  - 주문 실패 시 에러 메시지 표시
  - 주문 완료 후 메뉴 선택 화면으로 돌아감

### 4.5 UI/UX 요구사항

#### 4.5.1 디자인 원칙
- 깔끔하고 미니멀한 디자인
- 흰색 배경에 다크 그레이 텍스트
- 다크 그린 색상은 브랜드 컬러로 헤더 로고에만 사용
- 일관된 간격과 정렬 유지

#### 4.5.2 반응형 디자인
- 데스크톱: 메뉴 카드 3개 이상 가로 배치
- 태블릿: 메뉴 카드 2-3개 가로 배치
- 모바일: 메뉴 카드 1-2개 가로 배치, 장바구니는 하단 고정 또는 모달 형태

#### 4.5.3 사용자 피드백
- 버튼 클릭 시 시각적 피드백 제공
- 장바구니 추가 시 알림 또는 애니메이션
- 로딩 상태 표시 (API 호출 중)
- 에러 메시지 표시 (네트워크 오류, 주문 실패 등)

### 4.6 데이터 구조

#### 4.6.1 메뉴 데이터
```javascript
{
  id: number,              // 메뉴 고유 ID
  name: string,            // 메뉴 이름 (예: "아메리카노(ICE)")
  price: number,           // 기본 가격 (예: 4000)
  description: string,     // 메뉴 설명
  image: string,           // 이미지 URL (선택 사항)
  options: [               // 옵션 목록
    {
      id: number,          // 옵션 고유 ID
      name: string,        // 옵션 이름 (예: "샷 추가")
      price: number        // 추가 가격 (예: 500)
    }
  ]
}
```

#### 4.6.2 장바구니 아이템 데이터
```javascript
{
  menuId: number,          // 메뉴 ID
  menuName: string,        // 메뉴 이름
  basePrice: number,       // 기본 가격
  selectedOptions: [       // 선택한 옵션 목록
    {
      optionId: number,    // 옵션 ID
      optionName: string,  // 옵션 이름
      optionPrice: number  // 옵션 가격
    }
  ],
  quantity: number,        // 수량
  totalPrice: number       // 아이템별 총 가격 (기본가격 + 옵션가격) * 수량
}
```

#### 4.6.3 주문 데이터
```javascript
{
  items: [                 // 주문 아이템 목록
    {
      menuId: number,
      menuName: string,
      selectedOptions: [...],
      quantity: number,
      itemPrice: number
    }
  ],
  totalAmount: number      // 총 주문 금액
}
```

### 4.7 API 엔드포인트

#### 4.7.1 메뉴 조회
- **GET** `/api/menus`
- 응답: 메뉴 목록 배열

#### 4.7.2 주문 생성
- **POST** `/api/orders`
- 요청 본문: 주문 데이터
- 응답: 생성된 주문 정보

## 5. 관리자 화면 상세 사항

### 5.1 화면 구성
관리자 화면은 크게 4개의 섹션으로 구성됩니다:
1. 헤더 (Header)
2. 관리자 대시보드 요약 (Admin Dashboard Summary)
3. 재고 현황 섹션 (Inventory Status Section)
4. 주문 현황 섹션 (Order Status Section)

### 5.2 헤더 (Header)

#### 5.2.1 구성 요소
- **로고 영역**
  - 왼쪽 상단에 "COZY" 텍스트가 표시된 다크 그린 배경의 박스
  - 텍스트 색상: 흰색
  - 배경 색상: 다크 그린 (#2d5016 또는 유사한 색상)
  - 주문하기 화면과 동일한 디자인

- **네비게이션 버튼**
  - "주문하기" 버튼: 주문하기 화면으로 이동
  - "관리자" 버튼: 현재 화면으로 이동 (활성 상태 - 테두리로 강조)
  - 버튼 위치: 로고 오른쪽에 가로로 배치

#### 5.2.2 기능 요구사항
- "주문하기" 버튼 클릭 시 주문하기 화면으로 이동
- "관리자" 버튼은 현재 화면이므로 클릭해도 동일 화면 유지
- 활성 버튼은 시각적으로 구분 (테두리 또는 배경색 변경)

### 5.3 관리자 대시보드 요약 (Admin Dashboard Summary)

#### 5.3.1 구성 요소
- **섹션 제목**
  - "관리자 대시보드" 텍스트 표시
  - 폰트 크기: 중간 크기, 굵게

- **주문 상태 요약**
  - 주문 상태별 통계를 한 줄로 표시
  - 표시 형식: "총 주문 {n} / 주문 접수 {n} / 제조 중 {n} / 제조 완료 {n}"
  - 각 상태는 슬래시(/)로 구분
  - 숫자는 실시간으로 업데이트

#### 5.3.2 주문 상태 정의
- **총 주문**: 모든 주문의 총 개수
- **주문 접수**: 주문이 접수되어 제조 대기 중인 상태
- **제조 중**: 현재 제조가 진행 중인 주문
- **제조 완료**: 제조가 완료된 주문

#### 5.3.3 기능 요구사항
- 페이지 로드 시 최신 주문 상태 통계를 백엔드 API로부터 가져옴
- 주문 상태가 변경될 때마다 통계가 실시간으로 업데이트 (폴링 또는 웹소켓)
- 각 상태별 숫자는 클릭 가능하게 하여 해당 상태의 주문 목록을 필터링할 수 있음 (선택 사항)

### 5.4 재고 현황 섹션 (Inventory Status Section)

#### 5.4.1 구성 요소
- **섹션 제목**
  - "재고 현황" 텍스트 표시
  - 폰트 크기: 중간 크기, 굵게

- **재고 카드**
  - 각 메뉴별로 카드 형태로 재고 정보 표시
  - 카드는 가로로 배치 (데스크톱: 3개 이상, 모바일: 1-2개)
  - 각 카드에는 다음 요소가 포함됨:
    1. **메뉴 이름**: 메뉴의 이름 (예: "아메리카노 (ICE)", "아메리카노 (HOT)", "카페라떼")
    2. **재고 수량**: 현재 재고 수량을 "n개" 형식으로 표시 (예: "10개")
    3. **수량 조정 버튼**:
       - "+" 버튼: 재고 증가
       - "-" 버튼: 재고 감소
       - 버튼은 수량 표시 아래에 배치

#### 5.4.2 기능 요구사항
- 재고 목록은 백엔드 API를 통해 동적으로 로드
- "+" 버튼 클릭 시:
  - 해당 메뉴의 재고가 1 증가
  - 변경 사항이 즉시 화면에 반영
  - 백엔드 API로 재고 업데이트 요청 전송
- "-" 버튼 클릭 시:
  - 해당 메뉴의 재고가 1 감소
  - 재고가 0 이하로 내려가지 않도록 제한 (0일 경우 버튼 비활성화 또는 경고)
  - 변경 사항이 즉시 화면에 반영
  - 백엔드 API로 재고 업데이트 요청 전송
- 재고 변경 시 성공/실패 피드백 제공
- 재고가 일정 수준 이하로 떨어지면 시각적 경고 표시 (예: 색상 변경) (선택 사항)

### 5.5 주문 현황 섹션 (Order Status Section)

#### 5.5.1 구성 요소
- **섹션 제목**
  - "주문 현황" 텍스트 표시
  - 폰트 크기: 중간 크기, 굵게

- **주문 목록**
  - 주문들이 리스트 형태로 표시
  - 각 주문 카드/항목에는 다음 정보가 포함됨:
    1. **주문 날짜 및 시간**: "월 일 시:분" 형식 (예: "7월 31일 13:00")
    2. **주문 아이템**: 메뉴 이름과 수량 (예: "아메리카노(ICE) x 1")
    3. **주문 금액**: 해당 주문의 총 금액 (예: "4,000원")
    4. **주문 상태**: 현재 주문 상태 표시 (선택 사항)
    5. **액션 버튼**: 주문 상태에 따라 다른 버튼 표시
       - "주문 접수" 버튼: 주문 접수 대기 상태일 때 표시
       - "제조 시작" 버튼: 주문 접수 후 제조 시작할 때 표시 (선택 사항)
       - "제조 완료" 버튼: 제조 중일 때 표시 (선택 사항)

#### 5.5.2 주문 표시 형식
- 주문은 최신순으로 정렬하여 표시
- 각 주문은 카드 형태 또는 리스트 아이템 형태로 표시
- 주문 아이템이 여러 개인 경우 모두 표시하거나 "외 n개" 형식으로 요약 (선택 사항)

#### 5.5.3 기능 요구사항
- 주문 목록은 백엔드 API를 통해 동적으로 로드
- 주문 목록은 실시간으로 업데이트 (폴링 또는 웹소켓)
- "주문 접수" 버튼 클릭 시:
  - 주문 상태가 "주문 접수"로 변경됨
  - 백엔드 API로 주문 상태 업데이트 요청 전송
  - 성공 시 주문 상태가 변경되고 대시보드 요약도 업데이트
  - 실패 시 에러 메시지 표시
- 주문 상태별로 필터링 기능 제공 (선택 사항)
- 주문 상세 정보 보기 기능 (선택 사항)

### 5.6 UI/UX 요구사항

#### 5.6.1 디자인 원칙
- 주문하기 화면과 일관된 디자인 유지
- 깔끔하고 미니멀한 디자인
- 흰색 배경에 다크 그레이 텍스트
- 다크 그린 색상은 브랜드 컬러로 헤더 로고에만 사용
- 관리 기능에 적합한 명확한 정보 구조

#### 5.6.2 반응형 디자인
- 데스크톱: 재고 카드 3개 이상 가로 배치, 주문 목록 전체 표시
- 태블릿: 재고 카드 2-3개 가로 배치
- 모바일: 재고 카드 1-2개 가로 배치, 주문 목록은 스크롤 가능

#### 5.6.3 사용자 피드백
- 버튼 클릭 시 시각적 피드백 제공
- 재고 변경 시 성공/실패 알림
- 주문 상태 변경 시 성공/실패 알림
- 로딩 상태 표시 (API 호출 중)
- 에러 메시지 표시 (네트워크 오류, 업데이트 실패 등)
- 재고가 부족할 때 경고 표시 (선택 사항)

### 5.7 데이터 구조

#### 5.7.1 재고 데이터
```javascript
{
  menuId: number,          // 메뉴 ID
  menuName: string,        // 메뉴 이름
  stock: number            // 현재 재고 수량
}
```

#### 5.7.2 주문 상태 통계 데이터
```javascript
{
  totalOrders: number,     // 총 주문 수
  receivedOrders: number,  // 주문 접수 수
  inProgressOrders: number, // 제조 중 주문 수
  completedOrders: number  // 제조 완료 주문 수
}
```

#### 5.7.3 주문 목록 아이템 데이터
```javascript
{
  orderId: number,         // 주문 ID
  orderDate: string,       // 주문 날짜 (ISO 형식 또는 타임스탬프)
  displayDate: string,     // 표시용 날짜 (예: "7월 31일 13:00")
  items: [                 // 주문 아이템 목록
    {
      menuName: string,    // 메뉴 이름
      quantity: number,    // 수량
      price: number        // 아이템 가격
    }
  ],
  totalAmount: number,     // 주문 총 금액
  status: string           // 주문 상태 ("pending", "received", "in_progress", "completed")
}
```

### 5.8 API 엔드포인트

#### 5.8.1 주문 상태 통계 조회
- **GET** `/api/admin/dashboard/stats`
- 응답: 주문 상태 통계 데이터

#### 5.8.2 재고 목록 조회
- **GET** `/api/admin/inventory`
- 응답: 재고 목록 배열

#### 5.8.3 재고 업데이트
- **PUT** `/api/admin/inventory/:menuId`
- 요청 본문: `{ stock: number }`
- 응답: 업데이트된 재고 정보

#### 5.8.4 주문 목록 조회
- **GET** `/api/admin/orders`
- 쿼리 파라미터 (선택 사항):
  - `status`: 주문 상태로 필터링
  - `limit`: 조회할 주문 개수 제한
- 응답: 주문 목록 배열

#### 5.8.5 주문 상태 업데이트
- **PUT** `/api/admin/orders/:orderId/status`
- 요청 본문: `{ status: string }`
- 응답: 업데이트된 주문 정보

## 6. 백엔드 개발 사항

### 6.1 데이터 모델

#### 6.1.1 Menus (메뉴)
메뉴 정보를 저장하는 테이블입니다.

**필드:**
- `id` (PRIMARY KEY, SERIAL): 메뉴 고유 ID
- `name` (VARCHAR, NOT NULL): 커피 메뉴 이름 (예: "아메리카노(ICE)")
- `description` (TEXT): 메뉴 설명
- `price` (INTEGER, NOT NULL): 기본 가격 (원 단위)
- `image` (VARCHAR): 이미지 URL (선택 사항)
- `stock` (INTEGER, NOT NULL, DEFAULT 0): 재고 수량
- `created_at` (TIMESTAMP, DEFAULT NOW()): 생성 일시
- `updated_at` (TIMESTAMP, DEFAULT NOW()): 수정 일시

**제약 조건:**
- `price`는 0 이상이어야 함
- `stock`은 0 이상이어야 함

#### 6.1.2 Options (옵션)
메뉴 옵션 정보를 저장하는 테이블입니다.

**필드:**
- `id` (PRIMARY KEY, SERIAL): 옵션 고유 ID
- `name` (VARCHAR, NOT NULL): 옵션 이름 (예: "샷 추가", "시럽 추가")
- `price` (INTEGER, NOT NULL, DEFAULT 0): 옵션 추가 가격 (원 단위)
- `menu_id` (INTEGER, FOREIGN KEY REFERENCES menus(id)): 연결된 메뉴 ID
- `created_at` (TIMESTAMP, DEFAULT NOW()): 생성 일시
- `updated_at` (TIMESTAMP, DEFAULT NOW()): 수정 일시

**제약 조건:**
- `menu_id`는 Menus 테이블의 id를 참조
- `price`는 0 이상이어야 함

#### 6.1.3 Orders (주문)
주문 정보를 저장하는 테이블입니다.

**필드:**
- `id` (PRIMARY KEY, SERIAL): 주문 고유 ID
- `order_date` (TIMESTAMP, NOT NULL, DEFAULT NOW()): 주문 일시
- `status` (VARCHAR, NOT NULL, DEFAULT 'pending'): 주문 상태
  - 가능한 값: 'pending' (주문 접수 대기), 'received' (주문 접수), 'in_progress' (제조 중), 'completed' (제조 완료)
- `total_amount` (INTEGER, NOT NULL): 주문 총 금액 (원 단위)
- `created_at` (TIMESTAMP, DEFAULT NOW()): 생성 일시
- `updated_at` (TIMESTAMP, DEFAULT NOW()): 수정 일시

**제약 조건:**
- `total_amount`는 0 이상이어야 함
- `status`는 위에 정의된 값 중 하나여야 함

#### 6.1.4 OrderItems (주문 아이템)
주문에 포함된 메뉴와 옵션 정보를 저장하는 테이블입니다.

**필드:**
- `id` (PRIMARY KEY, SERIAL): 주문 아이템 고유 ID
- `order_id` (INTEGER, FOREIGN KEY REFERENCES orders(id)): 주문 ID
- `menu_id` (INTEGER, FOREIGN KEY REFERENCES menus(id)): 메뉴 ID
- `quantity` (INTEGER, NOT NULL): 주문 수량
- `item_price` (INTEGER, NOT NULL): 아이템 단가 (기본 가격 + 옵션 가격)
- `total_price` (INTEGER, NOT NULL): 아이템 총 가격 (단가 * 수량)
- `created_at` (TIMESTAMP, DEFAULT NOW()): 생성 일시

**제약 조건:**
- `order_id`는 Orders 테이블의 id를 참조
- `menu_id`는 Menus 테이블의 id를 참조
- `quantity`는 1 이상이어야 함
- `item_price`와 `total_price`는 0 이상이어야 함

#### 6.1.5 OrderItemOptions (주문 아이템 옵션)
주문 아이템에 선택된 옵션 정보를 저장하는 테이블입니다.

**필드:**
- `id` (PRIMARY KEY, SERIAL): 주문 아이템 옵션 고유 ID
- `order_item_id` (INTEGER, FOREIGN KEY REFERENCES order_items(id)): 주문 아이템 ID
- `option_id` (INTEGER, FOREIGN KEY REFERENCES options(id)): 옵션 ID
- `created_at` (TIMESTAMP, DEFAULT NOW()): 생성 일시

**제약 조건:**
- `order_item_id`는 OrderItems 테이블의 id를 참조
- `option_id`는 Options 테이블의 id를 참조

### 6.2 데이터 스키마를 위한 사용자 흐름

#### 6.2.1 메뉴 조회 및 표시
1. **프런트엔드**: '주문하기' 화면 접속 시 메뉴 목록 조회 요청
2. **백엔드**: `GET /api/menus` 엔드포인트 호출
3. **데이터베이스**: Menus 테이블에서 모든 메뉴 정보 조회
   - 각 메뉴에 연결된 Options 정보도 함께 조회 (JOIN 또는 별도 쿼리)
4. **백엔드**: 메뉴 정보와 옵션 정보를 결합하여 응답
5. **프런트엔드**: 받은 메뉴 정보를 화면에 표시
   - 재고 수량(`stock`) 정보는 관리자 화면에서만 사용

#### 6.2.2 장바구니 관리
1. **프런트엔드**: 사용자가 메뉴를 선택하고 옵션을 선택한 후 "담기" 버튼 클릭
2. **프런트엔드**: 선택한 메뉴와 옵션 정보를 장바구니에 추가 (로컬 상태 관리)
3. **프런트엔드**: 장바구니에 표시
   - 동일한 메뉴+옵션 조합이 있으면 수량 증가
   - 총 금액 실시간 계산

#### 6.2.3 주문 생성
1. **프런트엔드**: 장바구니에서 "주문하기" 버튼 클릭
2. **프런트엔드**: 주문 정보를 백엔드로 전송
   - 주문 아이템 목록 (메뉴 ID, 수량, 선택한 옵션 ID 목록)
   - 총 금액
3. **백엔드**: `POST /api/orders` 엔드포인트 호출
4. **백엔드**: 주문 정보 검증
   - 메뉴 ID 유효성 확인
   - 옵션 ID 유효성 확인
   - 재고 확인 (주문 수량이 재고보다 많으면 에러)
5. **데이터베이스**: 트랜잭션 시작
   - Orders 테이블에 주문 정보 저장
   - OrderItems 테이블에 주문 아이템 저장
   - OrderItemOptions 테이블에 선택한 옵션 저장
   - Menus 테이블의 재고 수량 감소 (주문 수량만큼)
6. **데이터베이스**: 트랜잭션 커밋
7. **백엔드**: 생성된 주문 정보 응답
8. **프런트엔드**: 주문 완료 메시지 표시 및 장바구니 초기화

#### 6.2.4 주문 현황 조회
1. **프런트엔드**: 관리자 화면 접속 시 주문 목록 조회 요청
2. **백엔드**: `GET /api/admin/orders` 엔드포인트 호출
3. **데이터베이스**: Orders 테이블에서 주문 목록 조회
   - OrderItems와 JOIN하여 주문 아이템 정보 포함
   - OrderItemOptions와 JOIN하여 선택한 옵션 정보 포함
   - 상태가 'completed'가 아닌 주문만 조회 (또는 쿼리 파라미터로 필터링)
   - 주문 일시 기준 내림차순 정렬
4. **백엔드**: 주문 정보를 프런트엔드 형식에 맞게 변환하여 응답
5. **프런트엔드**: 주문 현황 섹션에 표시

#### 6.2.5 주문 상태 변경
1. **프런트엔드**: 관리자가 "주문 접수" 또는 "제조 시작" 또는 "제조 완료" 버튼 클릭
2. **프런트엔드**: 주문 ID와 새로운 상태를 백엔드로 전송
3. **백엔드**: `PUT /api/admin/orders/:orderId/status` 엔드포인트 호출
4. **데이터베이스**: Orders 테이블에서 해당 주문의 상태 업데이트
5. **백엔드**: 업데이트된 주문 정보 응답
6. **프런트엔드**: 주문 목록 및 대시보드 통계 업데이트

### 6.3 API 설계

#### 6.3.1 메뉴 관련 API

##### 6.3.1.1 메뉴 목록 조회
- **엔드포인트**: `GET /api/menus`
- **설명**: 모든 메뉴 정보와 각 메뉴의 옵션 목록을 조회합니다.
- **요청**: 없음
- **응답**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "아메리카노(ICE)",
      "description": "간단한 설명...",
      "price": 4000,
      "image": "https://example.com/image.jpg",
      "options": [
        {
          "id": 1,
          "name": "샷 추가",
          "price": 500
        },
        {
          "id": 2,
          "name": "시럽 추가",
          "price": 0
        }
      ]
    }
  ]
}
```
- **에러 응답**:
```json
{
  "success": false,
  "error": "메뉴 조회 중 오류가 발생했습니다."
}
```

#### 6.3.2 주문 관련 API

##### 6.3.2.1 주문 생성
- **엔드포인트**: `POST /api/orders`
- **설명**: 새로운 주문을 생성하고 재고를 감소시킵니다.
- **요청 본문**:
```json
{
  "items": [
    {
      "menuId": 1,
      "quantity": 2,
      "selectedOptions": [1, 2]
    },
    {
      "menuId": 3,
      "quantity": 1,
      "selectedOptions": [1]
    }
  ],
  "totalAmount": 12500
}
```
- **응답**:
```json
{
  "success": true,
  "data": {
    "orderId": 123,
    "orderDate": "2024-07-31T13:00:00.000Z",
    "status": "pending",
    "totalAmount": 12500,
    "items": [
      {
        "menuId": 1,
        "menuName": "아메리카노(ICE)",
        "quantity": 2,
        "selectedOptions": [
          {
            "optionId": 1,
            "optionName": "샷 추가",
            "optionPrice": 500
          },
          {
            "optionId": 2,
            "optionName": "시럽 추가",
            "optionPrice": 0
          }
        ],
        "itemPrice": 4500,
        "totalPrice": 9000
      }
    ]
  }
}
```
- **에러 응답**:
```json
{
  "success": false,
  "error": "재고가 부족합니다."
}
```
또는
```json
{
  "success": false,
  "error": "존재하지 않는 메뉴입니다."
}
```

##### 6.3.2.2 주문 상세 조회
- **엔드포인트**: `GET /api/orders/:orderId`
- **설명**: 주문 ID를 전달하면 해당 주문의 상세 정보를 조회합니다.
- **URL 파라미터**:
  - `orderId`: 주문 ID (정수)
- **응답**:
```json
{
  "success": true,
  "data": {
    "id": 123,
    "orderDate": "2024-07-31T13:00:00.000Z",
    "status": "received",
    "totalAmount": 12500,
    "items": [
      {
        "menuId": 1,
        "menuName": "아메리카노(ICE)",
        "quantity": 2,
        "selectedOptions": [
          {
            "optionId": 1,
            "optionName": "샷 추가",
            "optionPrice": 500
          }
        ],
        "itemPrice": 4500,
        "totalPrice": 9000
      }
    ]
  }
}
```
- **에러 응답**:
```json
{
  "success": false,
  "error": "주문을 찾을 수 없습니다."
}
```

#### 6.3.3 관리자 API

##### 6.3.3.1 주문 목록 조회
- **엔드포인트**: `GET /api/admin/orders`
- **설명**: 관리자 화면에서 주문 목록을 조회합니다.
- **쿼리 파라미터** (선택 사항):
  - `status`: 주문 상태로 필터링 ('pending', 'received', 'in_progress', 'completed')
  - `limit`: 조회할 주문 개수 제한 (기본값: 50)
- **응답**:
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "orderDate": "2024-07-31T13:00:00.000Z",
      "status": "pending",
      "totalAmount": 12500,
      "items": [
        {
          "menuId": 1,
          "menuName": "아메리카노(ICE)",
          "quantity": 2,
          "selectedOptions": [
            {
              "optionId": 1,
              "optionName": "샷 추가",
              "optionPrice": 500
            }
          ],
          "itemPrice": 4500,
          "totalPrice": 9000
        }
      ]
    }
  ]
}
```

##### 6.3.3.2 주문 상태 업데이트
- **엔드포인트**: `PUT /api/admin/orders/:orderId/status`
- **설명**: 주문의 상태를 변경합니다.
- **URL 파라미터**:
  - `orderId`: 주문 ID (정수)
- **요청 본문**:
```json
{
  "status": "received"
}
```
- **응답**:
```json
{
  "success": true,
  "data": {
    "id": 123,
    "orderDate": "2024-07-31T13:00:00.000Z",
    "status": "received",
    "totalAmount": 12500
  }
}
```
- **에러 응답**:
```json
{
  "success": false,
  "error": "유효하지 않은 주문 상태입니다."
}
```

##### 6.3.3.3 주문 상태 통계 조회
- **엔드포인트**: `GET /api/admin/dashboard/stats`
- **설명**: 관리자 대시보드에 표시할 주문 상태별 통계를 조회합니다.
- **응답**:
```json
{
  "success": true,
  "data": {
    "totalOrders": 10,
    "receivedOrders": 3,
    "inProgressOrders": 2,
    "completedOrders": 5
  }
}
```

##### 6.3.3.4 재고 목록 조회
- **엔드포인트**: `GET /api/admin/inventory`
- **설명**: 모든 메뉴의 재고 정보를 조회합니다.
- **응답**:
```json
{
  "success": true,
  "data": [
    {
      "menuId": 1,
      "menuName": "아메리카노 (ICE)",
      "stock": 7
    },
    {
      "menuId": 2,
      "menuName": "아메리카노 (HOT)",
      "stock": 10
    },
    {
      "menuId": 3,
      "menuName": "카페라떼",
      "stock": 5
    }
  ]
}
```

##### 6.3.3.5 재고 업데이트
- **엔드포인트**: `PUT /api/admin/inventory/:menuId`
- **설명**: 특정 메뉴의 재고 수량을 업데이트합니다.
- **URL 파라미터**:
  - `menuId`: 메뉴 ID (정수)
- **요청 본문**:
```json
{
  "stock": 15
}
```
- **응답**:
```json
{
  "success": true,
  "data": {
    "menuId": 1,
    "menuName": "아메리카노 (ICE)",
    "stock": 15
  }
}
```
- **에러 응답**:
```json
{
  "success": false,
  "error": "재고는 0 이상이어야 합니다."
}
```

### 6.4 데이터베이스 스키마 예시

```sql
-- Menus 테이블 생성
CREATE TABLE menus (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL CHECK (price >= 0),
    image VARCHAR(255),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Options 테이블 생성
CREATE TABLE options (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL DEFAULT 0 CHECK (price >= 0),
    menu_id INTEGER NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders 테이블 생성
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_date TIMESTAMP NOT NULL DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'received', 'in_progress', 'completed')),
    total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- OrderItems 테이블 생성
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_id INTEGER NOT NULL REFERENCES menus(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    item_price INTEGER NOT NULL CHECK (item_price >= 0),
    total_price INTEGER NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMP DEFAULT NOW()
);

-- OrderItemOptions 테이블 생성
CREATE TABLE order_item_options (
    id SERIAL PRIMARY KEY,
    order_item_id INTEGER NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    option_id INTEGER NOT NULL REFERENCES options(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_date ON orders(order_date DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_menu_id ON order_items(menu_id);
CREATE INDEX idx_options_menu_id ON options(menu_id);
```

### 6.5 API 에러 처리

모든 API는 다음 형식의 에러 응답을 반환해야 합니다:

```json
{
  "success": false,
  "error": "에러 메시지"
}
```

**HTTP 상태 코드:**
- `200 OK`: 성공
- `400 Bad Request`: 잘못된 요청 (유효성 검사 실패 등)
- `404 Not Found`: 리소스를 찾을 수 없음
- `500 Internal Server Error`: 서버 내부 오류

### 6.6 트랜잭션 처리

주문 생성 시 다음 작업들이 하나의 트랜잭션으로 처리되어야 합니다:
1. Orders 테이블에 주문 정보 저장
2. OrderItems 테이블에 주문 아이템 저장
3. OrderItemOptions 테이블에 선택한 옵션 저장
4. Menus 테이블의 재고 수량 감소

이 중 하나라도 실패하면 전체 트랜잭션이 롤백되어야 합니다.
