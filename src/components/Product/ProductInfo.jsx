import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { useCart } from "../../pages/cart/CartContext"; 
import { useAuth } from "../../context/AuthContext"; 
import { toast } from "react-toastify";

function ProductInfo({ product }) {
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const { addToCart } = useCart();
  
  const [qty, setQty] = useState(1);
  const [weight, setWeight] = useState("1kg"); 

  // --- LOGIN CHECK LOGIC ---
  const requireLogin = () => {
    if (!user) {
      toast.warn("Please login to add items to cart"); 
      navigate("/login");
      return false;
    }
    return true;
  };

  // --- PRICE MATH ---
  const weightMultipliers = {
    "500g": 0.5,
    "1kg": 1,
    "2kg": 2,
    "5kg": 5,
  };

  const currentMultiplier = weightMultipliers[weight] || 1;
  const currentPrice = Math.round(product.price * currentMultiplier);

  // --- ADD TO CART HANDLER ---
  const handleAddToCart = () => {

    if (!requireLogin()) return; 

    const uniqueId = `${product.id}-${weight}`; 

    addToCart({ 
      ...product, 
      id: uniqueId, 
      price: currentPrice,
      selectedWeight: weight,
      quantity: qty 
    });

    toast.success(`${product.name} (${weight}) added to cart!`);
  };

  return (
    <div className="product-info">
      <p className="category">{product.category}</p>
      <h1 className="title">{product.name}</h1>

      <div className="rating">
        <span>⭐ {product.rating}</span> <span>({product.reviews} reviews)</span>
      </div>

      <div className="price-row">
        <span className="price">₹{currentPrice}</span>
        {product.originalPrice && (
            <span className="old">₹{Math.round(product.originalPrice * currentMultiplier)}</span>
        )}
      </div>

      <p className="desc">
        Sourced for peak freshness and quality. Perfect for your daily needs.
      </p>

      {/* WEIGHT SELECTOR */}
      <div className="weight-section">
        <p className="weight-title">Select Weight</p>
        <div className="weight-options">
          {["500g", "1kg", "2kg", "5kg"].map((w) => (
            <button 
              key={w}
              className={`weight-btn ${weight === w ? "active" : ""}`}
              onClick={() => {
                setWeight(w);
                setQty(1);
              }}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* QUANTITY CONTROLS */}
      <div className="qty-box">
        <button className="qty-btn" onClick={() => setQty(qty > 1 ? qty - 1 : 1)}>−</button>
        <span className="qty-value">{qty}</span>
        <button className="qty-btn" onClick={() => setQty(qty + 1)}>+</button>
      </div>

      <div className="actions">
        <button className="add" onClick={handleAddToCart}>Add to Cart</button>
        <button className="buy" onClick={() => requireLogin() && console.log("Proceed to Buy")}>Buy Now</button>
      </div>

      <div className="delivery">
        🚚 Delivery in 15-20 minutes
      </div>
    </div>
  );
}

export default ProductInfo;