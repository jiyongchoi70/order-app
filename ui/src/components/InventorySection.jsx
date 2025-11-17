import './InventorySection.css';

function InventorySection({ inventory, onUpdateStock }) {
  const getStockStatus = (stock) => {
    if (stock === 0) return { text: '품절', className: 'status-out' };
    if (stock < 3) return { text: '주의', className: 'status-warning' };
    return { text: '정상', className: 'status-normal' };
  };

  const handleIncrease = (menuId) => {
    const item = inventory.find(inv => (inv.menuId || inv.menu_id) === menuId);
    if (item) {
      onUpdateStock(menuId, item.stock + 1);
    }
  };

  const handleDecrease = (menuId) => {
    const item = inventory.find(inv => (inv.menuId || inv.menu_id) === menuId);
    if (item && item.stock > 0) {
      onUpdateStock(menuId, item.stock - 1);
    }
  };

  return (
    <section className="inventory-section">
      <h2 className="section-title">재고 현황</h2>
      <div className="inventory-grid">
        {inventory.map(item => {
          const status = getStockStatus(item.stock);
          const menuId = item.menuId || item.menu_id;
          const menuName = item.menuName || item.menu_name || item.name || `메뉴 ${menuId}`;
          return (
            <div key={menuId} className="inventory-card">
              <h3 className="inventory-menu-name">{menuName}</h3>
              <div className="inventory-stock">
                <span className="stock-quantity">{item.stock}개</span>
                <span className={`stock-status ${status.className}`}>
                  {status.text}
                </span>
              </div>
              <div className="inventory-controls">
                <button
                  className="stock-button decrease"
                  onClick={() => handleDecrease(menuId)}
                  disabled={item.stock === 0}
                >
                  -
                </button>
                <button
                  className="stock-button increase"
                  onClick={() => handleIncrease(menuId)}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default InventorySection;

