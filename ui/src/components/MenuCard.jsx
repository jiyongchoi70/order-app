import { useState } from 'react';
import './MenuCard.css';

function MenuCard({ menu, onAddToCart }) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionChange = (option) => {
    setSelectedOptions(prev => {
      if (prev.find(opt => opt.id === option.id)) {
        return prev.filter(opt => opt.id !== option.id);
      } else {
        return [...prev, option];
      }
    });
  };

  const calculatePrice = () => {
    const optionsPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
    return menu.price + optionsPrice;
  };

  const handleAddToCart = () => {
    onAddToCart({
      menuId: menu.id,
      menuName: menu.name,
      basePrice: menu.price,
      selectedOptions: selectedOptions.map(opt => ({
        id: opt.id,
        name: opt.name,
        price: opt.price
      })),
      quantity: 1,
      totalPrice: calculatePrice()
    });
  };

  return (
    <div className="menu-card">
      <div className="menu-image">
        {menu.image ? (
          <img src={menu.image} alt={menu.name} />
        ) : (
          <div className="image-placeholder">이미지</div>
        )}
      </div>
      <div className="menu-info">
        <h3 className="menu-name">{menu.name}</h3>
        <p className="menu-price">{menu.price.toLocaleString()}원</p>
        <p className="menu-description">{menu.description}</p>
        
        <div className="menu-options">
          {menu.options && menu.options.map(option => (
            <label key={option.id} className="option-label">
              <input
                type="checkbox"
                checked={selectedOptions.some(opt => opt.id === option.id)}
                onChange={() => handleOptionChange(option)}
              />
              <span>
                {option.name} {option.price > 0 && `(+${option.price.toLocaleString()}원)`}
                {option.price === 0 && '(+0원)'}
              </span>
            </label>
          ))}
        </div>

        {selectedOptions.length > 0 && (
          <p className="calculated-price">
            최종 가격: {calculatePrice().toLocaleString()}원
          </p>
        )}

        <button className="add-to-cart-button" onClick={handleAddToCart}>
          담기
        </button>
      </div>
    </div>
  );
}

export default MenuCard;

