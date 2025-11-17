import { useState } from 'react';
import Header from './components/Header';
import MenuSection from './components/MenuSection';
import CartSection from './components/CartSection';
import './App.css';

// 임시 메뉴 데이터
const initialMenus = [
  {
    id: 1,
    name: '아메리카노(ICE)',
    price: 4000,
    description: '간단한 설명...',
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop',
    options: [
      { id: 1, name: '샷 추가', price: 500 },
      { id: 2, name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 2,
    name: '아메리카노(HOT)',
    price: 4000,
    description: '간단한 설명...',
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop',
    options: [
      { id: 1, name: '샷 추가', price: 500 },
      { id: 2, name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 3,
    name: '카페라떼',
    price: 5000,
    description: '간단한 설명...',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
    options: [
      { id: 1, name: '샷 추가', price: 500 },
      { id: 2, name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 4,
    name: '카푸치노',
    price: 5000,
    description: '부드러운 우유 거품과 에스프레소의 조화',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop',
    options: [
      { id: 1, name: '샷 추가', price: 500 },
      { id: 2, name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 5,
    name: '바닐라라떼',
    price: 5500,
    description: '바닐라 시럽이 들어간 달콤한 라떼',
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop',
    options: [
      { id: 1, name: '샷 추가', price: 500 },
      { id: 2, name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 6,
    name: '카라멜마키아토',
    price: 6000,
    description: '카라멜 시럽과 우유, 에스프레소의 완벽한 조합',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
    options: [
      { id: 1, name: '샷 추가', price: 500 },
      { id: 2, name: '시럽 추가', price: 0 }
    ]
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState('order');
  const [menus] = useState(initialMenus);
  const [cartItems, setCartItems] = useState([]);
  const [menuResetKey, setMenuResetKey] = useState(0);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    // 관리자 페이지는 나중에 구현
    if (page === 'admin') {
      alert('관리자 페이지는 준비 중입니다.');
    }
  };

  const handleAddToCart = (item) => {
    setCartItems(prev => {
      // 옵션 정규화 함수 - 옵션 ID를 문자열로 변환하여 비교
      const normalizeOptions = (options) => {
        if (!options || options.length === 0) return '';
        return options
          .map(opt => String(opt.id || opt.optionId || ''))
          .sort()
          .join(',');
      };

      // 동일한 메뉴+옵션 조합 찾기
      const itemOptionsKey = normalizeOptions(item.selectedOptions);
      
      const existingItemIndex = prev.findIndex(cartItem => {
        // 메뉴 ID가 다르면 다른 아이템
        if (cartItem.menuId !== item.menuId) return false;
        
        // 옵션 키 비교
        const cartOptionsKey = normalizeOptions(cartItem.selectedOptions);
        return cartOptionsKey === itemOptionsKey;
      });

      if (existingItemIndex !== -1) {
        // 기존 아이템이 있으면 수량 1씩 증가
        const updated = [...prev];
        const existingItem = { ...updated[existingItemIndex] };
        
        // 수량 증가
        existingItem.quantity = existingItem.quantity + 1;
        
        // 개당 가격 계산 (기본가격 + 옵션가격)
        const unitPrice = existingItem.basePrice + 
          (existingItem.selectedOptions || []).reduce((sum, opt) => {
            const optPrice = opt.price || opt.optionPrice || 0;
            return sum + optPrice;
          }, 0);
        
        // 총 가격 = 개당 가격 * 수량
        existingItem.totalPrice = unitPrice * existingItem.quantity;
        
        updated[existingItemIndex] = existingItem;
        return updated;
      } else {
        // 새 아이템 추가 (수량 1로 시작)
        const unitPrice = item.basePrice + 
          (item.selectedOptions || []).reduce((sum, opt) => sum + (opt.price || 0), 0);
        
        const newItem = {
          menuId: item.menuId,
          menuName: item.menuName,
          basePrice: item.basePrice,
          quantity: 1,
          selectedOptions: (item.selectedOptions || []).map(opt => ({
            optionId: opt.id,
            optionName: opt.name,
            optionPrice: opt.price,
            id: opt.id,
            name: opt.name,
            price: opt.price
          })),
          totalPrice: unitPrice
        };
        return [...prev, newItem];
      }
    });
  };

  const handleOrder = () => {
    if (cartItems.length === 0) {
      alert('장바구니가 비어있습니다.');
      return;
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const orderData = {
      items: cartItems.map(item => ({
        menuId: item.menuId,
        menuName: item.menuName,
        selectedOptions: item.selectedOptions,
        quantity: item.quantity,
        itemPrice: item.totalPrice / item.quantity
      })),
      totalAmount: totalAmount
    };

    // TODO: 백엔드 API 호출
    console.log('주문 데이터:', orderData);
    
    // 주문 완료 메시지 표시
    alert('주문이 완료되었습니다.');
    
    // 화면 전체 초기화
    setCartItems([]);
    // 메뉴 카드의 옵션 선택 상태도 초기화하기 위해 key 변경
    setMenuResetKey(prev => prev + 1);
  };

  return (
    <div className="app">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="main-content">
        {currentPage === 'order' && (
          <>
            <MenuSection key={menuResetKey} menus={menus} onAddToCart={handleAddToCart} />
            <div style={{ height: '300px' }}></div> {/* 장바구니 공간 확보 */}
          </>
        )}
      </main>
      {currentPage === 'order' && (
        <CartSection cartItems={cartItems} onOrder={handleOrder} />
      )}
    </div>
  );
}

export default App;
