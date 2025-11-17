import MenuCard from './MenuCard';
import './MenuSection.css';

function MenuSection({ menus, onAddToCart }) {
  return (
    <section className="menu-section">
      <div className="menu-grid">
        {menus.map(menu => (
          <MenuCard key={menu.id} menu={menu} onAddToCart={onAddToCart} />
        ))}
      </div>
    </section>
  );
}

export default MenuSection;

