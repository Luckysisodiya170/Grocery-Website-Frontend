import React, { useRef, useState } from "react";
import "./categoryPage.css";

const CategoryRow = ({ categories, activeCategory, onSelectCategory }) => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 🌟 CLICK TO SCROLL FUNCTIONALITY
  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400; // Ek click me kitna aage jayega
      scrollRef.current.scrollBy({ 
        left: direction === "right" ? scrollAmount : -scrollAmount, 
        behavior: "smooth" 
      });
    }
  };

  // 🌟 MOUSE DRAG / SWIPE FUNCTIONALITY
  const onMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);

  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Drag speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="main-cat-section">
      <div className="section-header-row">
        <h4 className="section-subtitle">Explore 3D Categories</h4>
        <div className="cat-nav-buttons">
          <button className="nav-arrow" onClick={() => handleScroll("left")}>❮</button>
          <span className="swipe-hint">Swipe or Click ➔</span>
          <button className="nav-arrow" onClick={() => handleScroll("right")}>❯</button>
        </div>
      </div>
      
      {/* 3D Perspective Wrapper */}
      <div className="cat-perspective-wrapper">
        <div 
          className={`main-cat-row ${isDragging ? 'dragging' : ''}`}
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
        >
          {categories.map((cat, index) => (
            <button
              key={index}
              className={`cat-3d-card ${activeCategory === cat.name ? "active" : ""}`}
              onClick={() => {
                if (!isDragging) onSelectCategory(cat.name);
              }}
            >
              <div className="cat-3d-content">
                <div className="cat-icon-box">
                  <img src={`/category/${cat.image}`} alt={cat.name} loading="lazy" draggable="false" />
                </div>
                <span className="cat-name">{cat.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryRow;