import './CartSection.css';

function CartSection({ cartItems, onOrder, onRemoveItem, onUpdateQuantity }) {
  const totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const formatCartItemName = (item) => {
    let name = item.menuName;
    if (item.selectedOptions && item.selectedOptions.length > 0) {
      const optionsText = item.selectedOptions.map(opt => opt.optionName || opt.name).join(', ');
      name += ` (${optionsText})`;
    }
    return name;
  };

  return (
    <section className="cart-section">
      <h2 className="cart-title">장바구니</h2>
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p className="empty-cart">장바구니가 비어있습니다.</p>
          ) : (
            <ul className="cart-list">
              {cartItems.map((item, index) => (
                <li key={index} className="cart-item">
                  <span className="item-name">
                    {formatCartItemName(item)}
                  </span>
                  <div className="item-quantity-controls">
                    {onUpdateQuantity && (
                      <>
                        <button
                          className="quantity-button decrease"
                          onClick={() => {
                            if (item.quantity > 1) {
                              onUpdateQuantity(index, item.quantity - 1);
                            }
                          }}
                          disabled={item.quantity <= 1}
                          aria-label="수량 감소"
                        >
                          -
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button
                          className="quantity-button increase"
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                          aria-label="수량 증가"
                        >
                          +
                        </button>
                      </>
                    )}
                  </div>
                  <div className="item-actions">
                    <span className="item-price">
                      {item.totalPrice.toLocaleString()}원
                    </span>
                    {onRemoveItem && (
                      <button
                        className="remove-button"
                        onClick={() => onRemoveItem(index)}
                        aria-label="장바구니에서 삭제"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="cart-summary">
          <div className="total-amount">
            <span className="total-label">총 금액</span>
            <span className="total-value">{totalAmount.toLocaleString()}원</span>
          </div>
          <button
            className="order-button"
            onClick={onOrder}
            disabled={cartItems.length === 0}
          >
            주문하기
          </button>
        </div>
      </div>
    </section>
  );
}

export default CartSection;

