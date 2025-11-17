const API_BASE_URL = 'http://localhost:3000/api';

// API 호출 헬퍼 함수
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API 요청 실패');
    }

    return data;
  } catch (error) {
    console.error('API 요청 오류:', error);
    throw error;
  }
}

// 메뉴 관련 API
export const menuAPI = {
  // 메뉴 목록 조회
  getMenus: async () => {
    const response = await apiRequest('/menus');
    return response.data;
  },
};

// 주문 관련 API
export const orderAPI = {
  // 주문 생성
  createOrder: async (orderData) => {
    const response = await apiRequest('/orders', {
      method: 'POST',
      body: orderData,
    });
    return response.data;
  },

  // 주문 상세 조회
  getOrder: async (orderId) => {
    const response = await apiRequest(`/orders/${orderId}`);
    return response.data;
  },
};

// 관리자 API
export const adminAPI = {
  // 대시보드 통계 조회
  getDashboardStats: async () => {
    const response = await apiRequest('/admin/dashboard/stats');
    return response.data;
  },

  // 재고 목록 조회
  getInventory: async () => {
    const response = await apiRequest('/admin/inventory');
    return response.data;
  },

  // 재고 업데이트
  updateInventory: async (menuId, stock) => {
    const response = await apiRequest(`/admin/inventory/${menuId}`, {
      method: 'PUT',
      body: { stock },
    });
    return response.data;
  },

  // 주문 목록 조회
  getOrders: async (status = null, limit = 50) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('limit', limit);
    const response = await apiRequest(`/admin/orders?${params.toString()}`);
    return response.data;
  },

  // 주문 상태 업데이트
  updateOrderStatus: async (orderId, status) => {
    const response = await apiRequest(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: { status },
    });
    return response.data;
  },
};

