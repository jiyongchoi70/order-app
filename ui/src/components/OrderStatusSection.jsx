import './OrderStatusSection.css';

function OrderStatusSection({ orders, onUpdateOrderStatus }) {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '날짜 오류';
      }
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${month}월 ${day}일 ${hours}:${minutes}`;
    } catch (error) {
      return '날짜 오류';
    }
  };

  const formatOrderItems = (items) => {
    return items.map(item => {
      const optionsText = item.selectedOptions && item.selectedOptions.length > 0
        ? ` (${item.selectedOptions.map(opt => opt.optionName || opt.name).join(', ')})`
        : '';
      return `${item.menuName}${optionsText} x ${item.quantity}`;
    }).join(', ');
  };

  const getStatusButton = (order) => {
    if (order.status === 'pending') {
      return (
        <button
          className="status-button receive-button"
          onClick={() => onUpdateOrderStatus(order.orderId, 'received')}
        >
          주문 접수
        </button>
      );
    } else if (order.status === 'received') {
      return (
        <button
          className="status-button start-button"
          onClick={() => onUpdateOrderStatus(order.orderId, 'in_progress')}
        >
          제조 시작
        </button>
      );
    } else if (order.status === 'in_progress') {
      return (
        <button
          className="status-button complete-button"
          onClick={() => onUpdateOrderStatus(order.orderId, 'completed')}
        >
          제조 완료
        </button>
      );
    }
    return null;
  };

  return (
    <section className="order-status-section">
      <h2 className="section-title">주문 현황</h2>
      <div className="orders-list">
        {orders.length === 0 ? (
          <p className="empty-orders">주문이 없습니다.</p>
        ) : (
          orders.map(order => (
            <div key={order.orderId} className="order-card">
              <div className="order-info">
                <div className="order-date">{formatDate(order.orderDate)}</div>
                <div className="order-items">{formatOrderItems(order.items)}</div>
                <div className="order-amount">{order.totalAmount.toLocaleString()}원</div>
              </div>
              <div className="order-actions">
                {getStatusButton(order)}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default OrderStatusSection;

