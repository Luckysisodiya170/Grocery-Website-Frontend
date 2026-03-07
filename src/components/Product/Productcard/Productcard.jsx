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
  width: 100%;

  .card {
    background: linear-gradient(145deg, #ffffff, #f0f9ff);
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08); /* Darker and softer base shadow */
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    cursor: pointer;
    will-change: transform, box-shadow;
  }

  .card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 242, 254, 0.15); /* Premium glowing shadow */
  }

  /* IMAGE */

  .image-box {
    width: 100%;
    aspect-ratio: 4 / 3;
    background: #f8fafc;
    overflow: hidden;
    position: relative;
  }

  .image-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .card:hover .image-box img {
    transform: scale(1.08);
  }

  /* BADGES */

  .discount {
    position: absolute;
    top: 10px;
    left: 10px;
    background: linear-gradient(135deg, #ff6a00, #ee0979);
    color: white;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: clamp(10px, 0.7vw, 12px);
    font-weight: 800;
    z-index: 10;
  }

  .wishlist-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.9);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    transition: 0.3s;
  }

  .wishlist-btn svg {
    font-size: 18px;
  }

  .wishlist-btn:hover {
    transform: scale(1.1);
    color: #ec4899;
  }

  /* INFO */

  .info {
    padding: clamp(12px, 1vw, 18px);
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  .category-tag {
    font-size: clamp(10px, 0.8vw, 12px);
    font-weight: 800;
    color: #64748b;
    margin-bottom: 6px;
    text-transform: uppercase;
  }

  .name {
    font-size: clamp(13px, 1vw, 16px);
    font-weight: 800;
    margin-bottom: 8px;
    line-height: 1.3;
    color: #0f172a;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 36px;
  }

  .rating {
    display: flex;
    gap: 6px;
    font-size: clamp(11px, 0.8vw, 13px);
    margin-bottom: 12px;
    color: #f59e0b;
    font-weight: bold;
    align-items: center;
  }

  /* PRICE */

  .price-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
  }

  .price-stack {
    display: flex;
    align-items: center; /* Align prices side-by-side */
    gap: 8px; /* Space out old and new price */
    flex-wrap: wrap; /* Allows wrapping on very small screens */
  }

  .price {
    font-size: clamp(16px, 1.2vw, 20px);
    font-weight: 900;
    color: #005f73;
  }

  .old {
    text-decoration: line-through;
    text-decoration-color: #ef4444; /* Red strikethrough */
    text-decoration-thickness: 2px;
    font-size: clamp(12px, 0.9vw, 14px);
    color: #94a3b8;
    font-weight: 600;
  }

  /* ADD BUTTON */

  .add-btn {
    padding: clamp(6px, 0.8vw, 10px) clamp(10px, 1vw, 16px);
    border-radius: 8px;
    border: none;
    background: linear-gradient(135deg, #6366f1, #ec4899);
    color: white;
    font-weight: 700;
    font-size: clamp(11px, 0.8vw, 13px);
    cursor: pointer;
    transition: 0.3s;
    min-width: 70px;
  }

  .add-btn:hover {
    box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
    transform: scale(1.05);
  }

  /* QTY */

  .qty-controls {
    display: flex;
    align-items: center;
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    overflow: hidden;
    height: 32px;
  }

  .qty-btn {
    background: transparent;
    border: none;
    color: #0f172a;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
    cursor: pointer;
    height: 100%;
  }

  .qty-btn:hover {
    background: #e2e8f0;
    color: #ec4899;
  }

  .qty-count {
    font-weight: 800;
    font-size: clamp(12px, 0.9vw, 14px);
    color: #0f172a;
    width: 24px;
    text-align: center;
  }

  /* ---------- BREAKPOINTS ---------- */

  /* Large Screens */
  @media (min-width: 1500px) {
    .image-box {
      aspect-ratio: 16 / 10;
    }
  }

  /* Laptop */
  @media (max-width: 1200px) {
    .image-box {
      aspect-ratio: 4 / 3;
    }
  }

  /* Tablet */
  @media (max-width: 996px) {
    .image-box {
      aspect-ratio: 3 / 2;
    }
  }

  /* Mobile */
  @media (max-width: 768px) {
    .image-box {
      aspect-ratio: 1 / 1;
    }

    .name {
      font-size: 13px;
    }

    .price {
      font-size: 15px;
    }

    .add-btn {
      min-width: 60px;
    }
  }
`;

export default Card;