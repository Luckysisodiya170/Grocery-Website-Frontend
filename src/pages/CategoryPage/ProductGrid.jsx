import React from "react";
import Card from "../../components/Product/Productcard/Productcard"; // Adjust path as needed
import "./categoryPage.css"

// 🔴 ADDED sortOrder and setSortOrder to props
const ProductGrid = ({ products, activeCategory, activeSub, clearFilters, sortOrder, setSortOrder }) => {
  return (
    <main className="cat-product-area">
      <div className="cat-area-header">
        <h2>{activeSub === "All" ? `All ${activeCategory}` : activeSub}</h2>
      
        
        <div className="header-actions">
          <span className="product-count">{products.length} items</span>
          <select 
            className="sort-dropdown"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="featured">Sort by: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      
   </div>
      {products.length > 0 ? (
        <div className="cat-product-grid">
          {products.map((product) => (
            <Card key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="cat-empty-state">
          <div className="empty-icon-wrapper glass-panel">
            <span className="empty-icon">🛒</span>
          </div>
          <h3>No products found!</h3>
          <p>We couldn't find anything matching your search for {activeSub}.</p>
          <button className="btn-primary" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      )}
    </main>
  );
};

export default ProductGrid;