import React from "react";
import { Link } from "react-router-dom";
import "./categoryPage.css"


const CategoryHero = ({ activeCategory, activeSub, productCount, searchTerm, setSearchTerm }) => {
  return (
    <header className="cat-hero">
      <div className="cat-hero-bg-glow"></div>
      
      <div className="cat-breadcrumbs">
        <Link to="/">Home</Link>
        <span className="separator">/</span>
        <span className="current">{activeCategory}</span>
        {activeSub !== "All" && (
          <>
            <span className="separator">/</span>
            <span className="current sub">{activeSub}</span>
          </>
        )}
      </div>

      <div className="cat-hero-content">
        <h1>{activeCategory} Collection</h1>
        <p>Discover {productCount} premium items handpicked for you.</p>
      </div>

      {/* --- UPGRADED SEARCH BAR --- */}
      <div className="cat-search-wrapper">
        <div className="cat-search-box">
          <span className="search-icon">
            {/* Crisp SVG Search Icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            type="text"
            placeholder={`Search inside ${activeCategory}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn">Search</button>
        </div>
      </div>
      
    </header>
  );
};

export default CategoryHero;