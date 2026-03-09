import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useAuth } from "../../../context/AuthContext";

import { useCart } from "../../../pages/cart/CartContext";
import { useWishlist } from "../../../pages/wishlist/WishlistContext";

const Card = ({ product }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { cart, addToCart, removeFromCart } = useCart();
  const cartItem = cart.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const { toggleWishlist, isProductLiked } = useWishlist();
  const liked = isProductLiked(product.id);

  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null);

  const requireLogin = () => {
    if (!user) {
      navigate("/login");
      return false;
    }
    return true;
  };

  const handleInitialAdd = (e) => {
    e.stopPropagation();
    if (!requireLogin()) return;

    const productToAdd = {
      ...product,
      selectedSize,
      selectedColor,
    };

    addToCart(productToAdd);
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

  const handleToggleLike = (e) => {
    e.stopPropagation();
    if (!requireLogin()) return;
    toggleWishlist(product);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
  };

  const goToProduct = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    navigate(`/product/${product.id}`);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "star filled" : "star"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <StyledWrapper>
      <div className="card">
        <button className="wishlist-btn" onClick={handleToggleLike}>
          {liked ? (
            <FavoriteIcon style={{ color: "#f24c4c", fontSize: "16px" }} />
          ) : (
            <FavoriteBorderIcon style={{ color: "#ed3c42", fontSize: "16px" }} />
          )}
        </button>

        {product.discount && (
          <span className="discount">{product.discount} OFF</span>
        )}

        <div className="image-box" onClick={goToProduct}>
          <img
            src={
              product?.image
                ? product.image.startsWith("http")
                  ? product.image
                  : `/product/${product.image}`
                : "/placeholder.jpg"
            }
            alt={product?.name || "Product"}
          />
        </div>

        <div className="info" onClick={goToProduct}>
          <div className="cat-rating-row">
            <span className="category-tag">{product.category || "Fruits"}</span>

            {product.rating && (
              <div className="rating-stars">{renderStars(product.rating)}</div>
            )}
          </div>

          <h4 className="name">{product.name}</h4>
          
          <div className="price-row">
            <span className="price">
              ₹{product.price}
              {product.unit && <span className="unit">/{product.unit}</span>}
            </span>

            {product.originalPrice && (
              <span className="old">₹{product.originalPrice}</span>
            )}
          </div>

          <div className="review-row">(120 reviews)</div>

          <div className="variants-container">
            {product.sizes && product.sizes.length > 0 && (
              <div className="variant-options">
                {product.sizes.map((size) => (
                  <span
                    key={size}
                    className={`size-pill ${selectedSize === size ? "active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSize(size);
                    }}
                  >
                    {size}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="action-row" onClick={(e) => e.stopPropagation()}>
            <button className="buy-now-btn" onClick={handleBuyNow}>
              Buy Now
            </button>

            {quantity === 0 ? (
              <button className="add-cart-btn" onClick={handleInitialAdd}>
                ADD
              </button>
            ) : (
              <div className="qty-controls">
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

const StyledWrapper = styled.div`
  height: 100%;

  .card {
    background: #ffffff;
    border: 1px solid #f1f5f9; 
    border-radius: 12px; 
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    transition: all 0.2s ease;
  }

  .card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
    border-color: #e2e8f0;
  }

  .wishlist-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(4px);
    border: none;
    border-radius: 50%;
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 2;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  }

  .discount {
    position: absolute;
    top: 8px;
    left: 8px;
    background: #2563eb; 
    color: white;
    padding: 3px 6px;
    border-radius: 6px;
    font-size: 9px;
    font-weight: 800;
    z-index: 2;
    letter-spacing: 0.3px;
  }

  /* 🌟 IMAGE COVER PART */
  .image-box {
    width: 100%;
    aspect-ratio: 4/3; 
    background: #f8fafc;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0; 
  }

  .image-box img {
    width: 100%;
    height: 100%;
    object-fit: cover; 
  }

  .info {
    padding: 10px 12px; 
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  .cat-rating-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px; 
  }

  .category-tag {
    font-size: 10px;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
  }

  .rating-stars {
    display: flex;
    gap: 2px;
  }

  .star { color: #e2e8f0; font-size: 10px; }
  .star.filled { color: #fbbf24; }

  /* 🌟 TIGHTEST NAME LOCK (Sirf 2 lines ki fixed jagah) */
  .name {
    font-size: 13px !important; /* Aur chota kiya */
    font-weight: 700 !important;
    color: #1e293b !important;
    line-height: 18px !important; /* Fixed line height */
    height: 36px !important; /* Exact 2 lines space (18x2) */
    min-height: 36px !important;
    max-height: 36px !important;
    margin: 0 0 4px 0 !important; /* Koi gap nahi */
    display: -webkit-box !important;
    -webkit-line-clamp: 2 !important; 
    -webkit-box-orient: vertical !important;
    overflow: hidden !important;
    flex: none !important; /* Overstretch hone se rokega */
  }

  /* 🌟 PRICE AUR REVIEWS KO NAAM SE CHIPKANE KE LIYE */
  .price-row {
    display: flex;
    align-items: baseline;
    gap: 6px;
    margin-top: 0 !important;
    margin-bottom: 2px !important; 
  }

  .price {
    font-size: 16px; 
    font-weight: 800;
    color: #16a34a;
  }

  .unit {
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
  }

  .old {
    font-size: 12px;
    color: #94a3b8;
    text-decoration: line-through;
    font-weight: 500;
  }

  .review-row {
    font-size: 10px;
    color: #94a3b8;
    margin-bottom: 4px; /* Gap kam kiya */
  }

  .variants-container {
    margin-bottom: 4px; 
  }

  .variant-options {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
  }

  .size-pill {
    font-size: 10px;
    font-weight: 600;
    padding: 3px 6px;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    cursor: pointer;
    color: #64748b;
    transition: all 0.2s;
  }

  .size-pill.active {
    border-color: #16a34a;
    background: #f0fdf4;
    color: #16a34a;
  }

  /* 🌟 BUTTONS BOTTOM ALIGN (Khali space iske UPAR aayegi) */
  .action-row {
    display: flex;
    gap: 6px;
    margin-top: auto; /* Buttons hamesha card ke ekdum base par rahenge */
  }

  .buy-now-btn, .add-cart-btn {
    flex: 1;
    padding: 6px 0;
    border-radius: 6px;
    font-weight: 800;
    font-size: 12px;
    cursor: pointer;
    text-transform: uppercase;
    transition: 0.2s;
    text-align: center;
  }

  .buy-now-btn {
    background: #16a34a;
    color: white;
    border: none;
  }
  .buy-now-btn:hover { background: #15803d; }

  .add-cart-btn {
    background: white;
    color: #16a34a;
    border: 1px solid #16a34a;
  }
  .add-cart-btn:hover { background: #f0fdf4; }

  .qty-controls {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between; 
    padding: 0 4px;
    background: #16a34a;
    color: white;
    border-radius: 6px;
    height: 32px;
  }

  .qty-btn {
    border: none;
    background: transparent;
    color: white;
    cursor: pointer;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
  }

  .qty-btn:hover { background: rgba(255,255,255,0.2); }

  .qty-count {
    font-weight: 800;
    font-size: 13px;
  }
`;

export default Card;