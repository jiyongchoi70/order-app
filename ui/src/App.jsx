import { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import MenuSection from './components/MenuSection';
import CartSection from './components/CartSection';
import AdminDashboard from './components/AdminDashboard';
import InventorySection from './components/InventorySection';
import OrderStatusSection from './components/OrderStatusSection';
import { calculateItemPrice } from './utils/priceUtils';
import { menuAPI, orderAPI, adminAPI } from './utils/api';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('order');
  const [menus, setMenus] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [menuResetKey, setMenuResetKey] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // 관리자 화면 상태
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    receivedOrders: 0,
    inProgressOrders: 0,
    completedOrders: 0
  });

  // 메뉴 목록 로드
  useEffect(() => {
    const loadMenus = async () => {
      try {
        setLoading(true);
        const menusData = await menuAPI.getMenus();
        setMenus(menusData);
      } catch (error) {
        console.error('메뉴 로드 오류:', error);
        alert('메뉴를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    loadMenus();
  }, []);

  // 관리자 화면 데이터 로드
  useEffect(() => {
    if (currentPage === 'admin' && menus.length > 0) {
      loadAdminData();
    }
  }, [currentPage, menus]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsData, inventoryData, ordersData] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getInventory(),
        adminAPI.getOrders()
      ]);
      setDashboardStats(statsData);
      
      // 재고 데이터에 메뉴명 추가 (메뉴 목록과 매칭)
      const inventoryWithMenuNames = inventoryData.map(invItem => {
        const menu = menus.find(m => m.id === invItem.menuId || m.id === invItem.menu_id);
        return {
          ...invItem,
          menuId: invItem.menuId || invItem.menu_id,
          menuName: invItem.menuName || invItem.menu_name || (menu ? menu.name : `메뉴 ${invItem.menuId || invItem.menu_id}`)
        };
      });
      setInventory(inventoryWithMenuNames);
      setOrders(ordersData);
    } catch (error) {
      console.error('관리자 데이터 로드 오류:', error);
      alert('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleAddToCart = async (item) => {
    // 재고 확인을 위해 현재 재고 정보 가져오기
    try {
      const inventoryData = await adminAPI.getInventory();
      const inventoryItem = inventoryData.find(inv => inv.menuId === item.menuId);
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
        
        // 수량 증가
        existingItem.quantity = existingItem.quantity + 1;
        
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
    } catch (error) {
      console.error('재고 확인 오류:', error);
      // 재고 확인 실패 시에도 장바구니 추가는 진행 (백엔드에서 최종 확인)
    }
  };

  const handleOrder = async () => {
    if (cartItems.length === 0) {
      alert('장바구니가 비어있습니다.');
      return;
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const orderData = {
      items: cartItems.map(item => ({
        menuId: item.menuId,
        selectedOptions: item.selectedOptions.map(opt => opt.id || opt.optionId),
        quantity: item.quantity
      })),
      totalAmount: totalAmount
    };

    try {
      setLoading(true);
      const result = await orderAPI.createOrder(orderData);
      
      // 주문 완료 메시지 표시
      alert('주문이 완료되었습니다.');
      
      // 화면 전체 초기화
      setCartItems([]);
      // 메뉴 카드의 옵션 선택 상태도 초기화하기 위해 key 변경
      setMenuResetKey(prev => prev + 1);
      
      // 관리자 화면이 활성화되어 있으면 데이터 새로고침
      if (currentPage === 'admin') {
        loadAdminData();
      }
    } catch (error) {
      console.error('주문 생성 오류:', error);
      alert(error.message || '주문 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 장바구니 아이템 삭제
  const handleRemoveFromCart = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  // 장바구니 아이템 수량 업데이트
  const handleUpdateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prev => {
      const updated = [...prev];
      const item = { ...updated[index] };
      
      // 개당 가격 계산
      const unitPrice = calculateItemPrice(item.basePrice, item.selectedOptions);
      
      // 수량 업데이트
      item.quantity = newQuantity;
      item.totalPrice = unitPrice * newQuantity;
      
      updated[index] = item;
      return updated;
    });
  };

  // 재고 업데이트
  const handleUpdateStock = async (menuId, newStock) => {
    try {
      const result = await adminAPI.updateInventory(menuId, newStock);
      setInventory(prev => 
        prev.map(item => 
          item.menuId === menuId 
            ? { ...item, stock: result.stock }
            : item
        )
      );
    } catch (error) {
      console.error('재고 업데이트 오류:', error);
      alert(error.message || '재고 업데이트 중 오류가 발생했습니다.');
      // 실패 시 데이터 새로고침
      loadAdminData();
    }
  };

  // 주문 상태 업데이트
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      // 성공 시 데이터 새로고침
      await loadAdminData();
    } catch (error) {
      console.error('주문 상태 업데이트 오류:', error);
      alert(error.message || '주문 상태 업데이트 중 오류가 발생했습니다.');
      // 실패 시 데이터 새로고침
      loadAdminData();
    }
  };

  return (
    <div className="app">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="main-content">
        {loading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            로딩 중...
          </div>
        )}
        {currentPage === 'order' && !loading && (
          <>
            <MenuSection key={menuResetKey} menus={menus} onAddToCart={handleAddToCart} />
            <div style={{ height: '200px' }}></div> {/* 장바구니 공간 확보 */}
          </>
        )}
        {currentPage === 'admin' && !loading && (
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
          onUpdateQuantity={handleUpdateQuantity}
        />
      )}
    </div>
  );
}

export default App;
