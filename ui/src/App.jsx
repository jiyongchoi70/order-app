import { useState, useMemo } from 'react';
import Header from './components/Header';
import MenuSection from './components/MenuSection';
import CartSection from './components/CartSection';
import AdminDashboard from './components/AdminDashboard';
import InventorySection from './components/InventorySection';
import OrderStatusSection from './components/OrderStatusSection';
import { calculateItemPrice } from './utils/priceUtils';
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
  
  // 관리자 화면 상태
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([
    { menuId: 1, menuName: '아메리카노 (ICE)', stock: 10 },
    { menuId: 2, menuName: '아메리카노 (HOT)', stock: 10 },
    { menuId: 3, menuName: '카페라떼', stock: 10 }
  ]);

  // 대시보드 통계 계산 (useMemo로 최적화)
  const dashboardStats = useMemo(() => ({
    totalOrders: orders.length,
    receivedOrders: orders.filter(o => o.status === 'pending' || o.status === 'received').length,
    inProgressOrders: orders.filter(o => o.status === 'in_progress').length,
    completedOrders: orders.filter(o => o.status === 'completed').length
  }), [orders]);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleAddToCart = (item) => {
    // 재고 확인
    const inventoryItem = inventory.find(inv => inv.menuId === item.menuId);
    if (inventoryItem && inventoryItem.stock === 0) {
      alert(`${item.menuName}은(는) 품절되었습니다.`);
      return;
    }

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
        
        // 재고 확인 (장바구니에 있는 수량 + 추가하려는 수량)
        const totalQuantity = existingItem.quantity + 1;
        if (inventoryItem && totalQuantity > inventoryItem.stock) {
          alert(`재고가 부족합니다. (현재 재고: ${inventoryItem.stock}개)`);
          return prev;
        }
        
        // 수량 증가
        existingItem.quantity = totalQuantity;
        
        // 개당 가격 계산
        const unitPrice = calculateItemPrice(
          existingItem.basePrice,
          existingItem.selectedOptions
        );
        
        // 총 가격 = 개당 가격 * 수량
        existingItem.totalPrice = unitPrice * existingItem.quantity;
        
        updated[existingItemIndex] = existingItem;
        return updated;
      } else {
        // 새 아이템 추가 (수량 1로 시작)
        const unitPrice = calculateItemPrice(item.basePrice, item.selectedOptions);
        
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

    // 주문 전 재고 최종 확인
    const stockCheck = cartItems.every(item => {
      const invItem = inventory.find(inv => inv.menuId === item.menuId);
      if (!invItem) return true; // 재고 정보가 없으면 통과
      return invItem.stock >= item.quantity;
    });

    if (!stockCheck) {
      alert('재고가 부족한 메뉴가 있습니다. 장바구니를 확인해주세요.');
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
    
    // 주문을 관리자 화면의 주문 목록에 추가
    const newOrder = {
      orderId: Date.now(), // 임시 ID
      orderDate: new Date().toISOString(),
      items: orderData.items,
      totalAmount: totalAmount,
      status: 'pending' // 주문 접수 상태
    };
    setOrders(prev => [newOrder, ...prev]);
    
    // 주문된 메뉴에 따라 재고 감소
    setInventory(prev => {
      return prev.map(invItem => {
        // 주문된 아이템 중에서 해당 메뉴 찾기
        const orderedItem = orderData.items.find(item => item.menuId === invItem.menuId);
        if (orderedItem) {
          // 재고에서 주문 수량만큼 감소
          const newStock = Math.max(0, invItem.stock - orderedItem.quantity);
          return { ...invItem, stock: newStock };
        }
        return invItem;
      });
    });
    
    // 화면 전체 초기화
    setCartItems([]);
    // 메뉴 카드의 옵션 선택 상태도 초기화하기 위해 key 변경
    setMenuResetKey(prev => prev + 1);
  };

  // 장바구니 아이템 삭제
  const handleRemoveFromCart = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  // 재고 업데이트
  const handleUpdateStock = (menuId, newStock) => {
    setInventory(prev => 
      prev.map(item => 
        item.menuId === menuId 
          ? { ...item, stock: Math.max(0, newStock) }
          : item
      )
    );
  };

  // 주문 상태 업데이트
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.orderId === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );
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
        {currentPage === 'admin' && (
          <>
            <AdminDashboard stats={dashboardStats} />
            <InventorySection 
              inventory={inventory} 
              onUpdateStock={handleUpdateStock}
            />
            <OrderStatusSection 
              orders={orders.filter(o => o.status !== 'completed')} 
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          </>
        )}
      </main>
      {currentPage === 'order' && (
        <CartSection 
          cartItems={cartItems} 
          onOrder={handleOrder}
          onRemoveItem={handleRemoveFromCart}
        />
      )}
    </div>
  );
}

export default App;
