import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useAuth } from "../../../context/AuthContext";
// Context Hooks
import { useCart } from "../../../pages/cart/CartContext";
import { useWishlist } from "../../../pages/wishlist/WishlistContext"; // 👈 Added global wishlist brain

const Card = ({ product }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  // 1. Cart Context
  const { cart, addToCart, removeFromCart, setIsCartOpen } = useCart();
  const cartItem = cart.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  // 2. Global Wishlist Context 👈 REPLACED local state with global brain
  const { toggleWishlist, isProductLiked } = useWishlist();
  const liked = isProductLiked(product.id);

  // 3. Login Protection Helper
 const requireLogin = () => {
  if (!user) {
    navigate("/login");
    return false;
  }
  return true;
};

  /* ---------------- QUANTITY CONTROLS ---------------- */
  const handleInitialAdd = (e) => {
    e.stopPropagation();
    if (!requireLogin()) return;
    addToCart(product);
    setIsCartOpen(true);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    if (!requireLogin()) return;
    addToCart(product);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    if (!requireLogin()) return;
    removeFromCart(product.id);
  };

  /* ---------------- WISHLIST CONTROL ---------------- */
  const handleToggleLike = (e) => {
    e.stopPropagation();
    if (!requireLogin()) return;
    toggleWishlist(product); // 👈 One function now handles both add/remove globally
  };

  /* ---------------- CARD NAVIGATION ---------------- */
  const goToProduct = () => {
    window.scrollTo({ top: 0, behavior: "instant" }); // Changed to instant for better UX
    navigate(`/product/${product.id}`);
  };

  return (
    <StyledWrapper>
      <div className="card">
        {/* ❤️ Global Wishlist Button */}
        <button className="wishlist-btn" onClick={handleToggleLike}>
          {liked ? (
            <FavoriteIcon className="liked" style={{ color: "#ec4899" }} />
          ) : (
            <FavoriteBorderIcon className="unliked" />
          )}
        </button>

        {/* Discount Badge */}
        {product.discount && (
          <span className="discount">{product.discount} OFF</span>
        )}

        {/* Image Box */}
        <div className="image-box" onClick={goToProduct}>
         <img 
  src={product?.image ? (product.image.startsWith('http') ? product.image : `/product/${product.image}`) : '/placeholder.jpg'} 
  alt={product?.name || "Product"} 
/>
        </div>

        {/* Info Section */}
        <div className="info" onClick={goToProduct}>
          <div className="category-tag">{product.category}</div>
          <h4 className="name">{product.name}</h4>

          {product.rating && (
            <div className="rating">
              <span className="stars">★ {product.rating}</span>
              <span className="reviews">({product.reviews} reviews)</span>
            </div>
          )}

          <div className="price-row">
            <div className="price-stack">
              <span className="price">₹{product.price}</span>
              {product.originalPrice && (
                <span className="old">₹{product.originalPrice}</span>
              )}
            </div>
            
            {/* Conditional Render for Add/Qty */}
            {quantity === 0 ? (
              <button className="add-btn" onClick={handleInitialAdd}>
                + Add
              </button>
            ) : (
              <div className="qty-controls" onClick={(e) => e.stopPropagation()}>
                <button className="qty-btn" onClick={handleDecrement}>
                  <RemoveIcon fontSize="small" />
                </button>
                <span className="qty-count">{quantity}</span>
                <button className="qty-btn" onClick={handleIncrement}>
                  <AddIcon fontSize="small" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

// --- STYLES (No changes needed here) ---
const StyledWrapper = styled.div`
  height: 100%;
  .card {
    background: linear-gradient(145deg, #ffffff, #f0f9ff);
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    cursor: pointer;
  }
  .card:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(99, 102, 241, 0.2); }
  .image-box { height: 150px; width: 100%; padding: 0; background: #f8fafc; overflow: hidden; position: relative; }
  .image-box img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
  .card:hover .image-box img { transform: scale(1.08); }
  .discount { position: absolute; top: 10px; left: 10px; background: linear-gradient(135deg, #ff6a00, #ee0979); color: white; padding: 4px 10px; border-radius: 12px; font-size: 10px; font-weight: 800; z-index: 10; }
  .wishlist-btn { position: absolute; top: 10px; right: 10px; background: rgba(255, 255, 255, 0.9); width: 32px; height: 32px; border-radius: 50%; border: none; display: flex; align-items: center; justify-content: center; z-index: 10; box-shadow: 0 4px 10px rgba(0,0,0,0.1); transition: 0.3s; }
  .wishlist-btn svg { font-size: 18px; }
  .wishlist-btn:hover { transform: scale(1.1); color: #ec4899; }
  .info { padding: 12px 14px; display: flex; flex-direction: column; flex-grow: 1; }
  .category-tag { font-size: 10px; font-weight: 800; color: #64748b; margin-bottom: 6px; text-transform: uppercase; }
  .name { font-size: 14px; font-weight: 800; margin-bottom: 8px; line-height: 1.3; color: #0f172a; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 36px; }
  .rating { display: flex; gap: 6px; font-size: 11px; margin-bottom: 12px; color: #f59e0b; font-weight: bold; align-items: center; }
  .price-row { display: flex; align-items: center; justify-content: space-between; margin-top: auto; }
  .price { font-size: 16px; font-weight: 900; color: #005f73; }
  .old { text-decoration: line-through; font-size: 11px; color: #94a3b8; }
  .add-btn { padding: 8px 14px; border-radius: 8px; border: none; background: linear-gradient(135deg, #6366f1, #ec4899); color: white; font-weight: 700; font-size: 12px; cursor: pointer; transition: 0.3s; min-width: 70px; }
  .add-btn:hover { box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3); transform: scale(1.05); }
  .qty-controls { display: flex; align-items: center; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; height: 32px; }
  .qty-btn { background: transparent; border: none; color: #0f172a; display: flex; align-items: center; justify-content: center; padding: 0 8px; cursor: pointer; height: 100%; transition: background 0.2s; }
  .qty-btn:hover { background: #e2e8f0; color: #ec4899; }
  .qty-count { font-weight: 800; font-size: 13px; color: #0f172a; width: 20px; text-align: center; }
  @media (max-width: 768px) { .image-box { height: 130px; } .name { font-size: 12px; min-height: 31px; } .price { font-size: 14px; } .add-btn { padding: 6px 10px; font-size: 11px; min-width: 60px; } .qty-controls { height: 28px; } }
`;

export default Card;