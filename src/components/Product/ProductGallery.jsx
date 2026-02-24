import { useState, useEffect } from "react";

function ProductGallery({ product }) {
  const [active, setActive] = useState(product.image);

  // Update active image if the product changes
  useEffect(() => {
    setActive(product.image);
  }, [product.image]);

  return (
    <div className="product-gallery">
      <div className="main-image">
        <img 
          src={active.startsWith('http') ? active : `/product/${active}`} 
          alt={product.name} 
        />
      </div>

      <div className="thumbs">
        {/* If you have an images array, map that. Otherwise, we show the main one */}
        {[1, 2, 3].map((_, i) => (
          <img
            key={i}
            src={product.image.startsWith('http') ? product.image : `/product/${product.image}`}
            onClick={() => setActive(product.image)}
            alt="thumbnail"
            className={active === product.image ? "active-thumb" : ""}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductGallery;