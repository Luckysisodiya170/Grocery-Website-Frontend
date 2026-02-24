import React from "react";
import "./categoryPage.css"

const CategoryRow = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <div className="main-cat-section">
      <div className="section-header-row">
        <h4 className="section-subtitle">Explore Categories</h4>
        <span className="swipe-hint">Swipe ➔</span>
      </div>
      
      <div className="main-cat-row">
        {categories.map((cat, index) => (
          <button
            key={index}
            className={`main-cat-btn ${activeCategory === cat.name ? "active" : ""}`}
            onClick={() => onSelectCategory(cat.name)}
          >
            <div className="cat-icon-box">
              <img src={`/category/${cat.image}`} alt={cat.name} />
            </div>
            <span className="cat-name">{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryRow;