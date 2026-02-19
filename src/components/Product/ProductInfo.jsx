import { useState } from "react";

function ProductInfo({ product }) {
  const [qty, setQty] = useState(1);
  const [weight, setWeight] = useState("500g");

  return (
    <div className="product-info">

      <p className="category">{product.category}</p>
      <h1>{product.name}</h1>

      <div className="rating">
        ⭐ {product.rating} ({product.reviews})
      </div>

      <div className="price-row">
        <span className="price">₹{product.price}</span>
        <span className="old">₹{product.originalPrice}</span>
      </div>

      <p className="desc">
        Lorem ipsum dolor sit amet consectetur adipiscing.
      </p>

      {/* weight selector */}
     {/* WEIGHT */}
<div className="weight-section">
  <p className="weight-title">Weight</p>

  <div className="weight-options">
    <button className="weight-btn active">500g</button>
    <button className="weight-btn">1kg</button>
    <button className="weight-btn">2kg</button>
    <button className="weight-btn">5kg</button>
  </div>
</div>

{/* QUANTITY */}
<div className="qty-box">
  <button className="qty-btn">−</button>
  <span className="qty-value">1</span>
  <button className="qty-btn">+</button>
</div>

      <div className="actions">
        <button className="add">Add to cart</button>
        <button className="buy">Buy now</button>
      </div>

    </div>
  );
}

export default ProductInfo;
