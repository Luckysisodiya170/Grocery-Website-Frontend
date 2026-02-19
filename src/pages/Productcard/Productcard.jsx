import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

const Card = ({ product }) => {
  const navigate = useNavigate();

  const goToProduct = () => {
    navigate(`/product/${product.id}`);
  };

  /* ---------------- WISHLIST STATE ---------------- */
  const [liked, setLiked] = useState(false);

  // load saved wishlist
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
    setLiked(saved.includes(product.id));
  }, [product.id]);

  // toggle like
  const toggleLike = () => {
    let saved = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (saved.includes(product.id)) {
      saved = saved.filter((id) => id !== product.id);
      setLiked(false);
    } else {
      saved.push(product.id);
      setLiked(true);
    }

    localStorage.setItem("wishlist", JSON.stringify(saved));
  };

  /* ---------------- ADD TO CART ---------------- */
  const handleAddToCart = () => {
    const isLoggedIn = localStorage.getItem("authToken");

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    console.log("Added to cart");
  };

  return (
    <StyledWrapper>
      <div className="card">
        {/* ❤️ Glass Wishlist Button */}
        <button className="wishlist-btn" onClick={toggleLike}>
          {liked ? (
            <FavoriteIcon className="liked" />
          ) : (
            <FavoriteBorderIcon className="unliked" />
          )}
        </button>

        {/* Premium Gradient Discount Badge */}
        {product.discount && (
          <span className="discount">{product.discount} OFF</span>
        )}

        {/* Floating Image Box */}
        <div className="image-box" onClick={goToProduct}>
          <div className="glow-backdrop"></div>
          <img src={`/product/${product.image}`} alt={product.name} />
        </div>

        {/* Info Section */}
        <div className="info">
          <div className="category-tag">{product.category}</div>
          
          <h4 className="name" onClick={goToProduct}>
            {product.name}
          </h4>

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
            
            <button className="add-btn" onClick={handleAddToCart}>
              + Add
            </button>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
.card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.03);
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-12px);
  box-shadow: 0 35px 60px -15px rgba(0, 95, 115, 0.15);
  border-color: rgba(20, 184, 166, 0.4); /* var(--secondary) tint */
  background: white;
}

/* ================= BADGES & BUTTONS ================= */
.discount {
  position: absolute;
  top: 16px;
  left: 16px;
  background: var(--sunset-gradient, linear-gradient(135deg, #FF9D6C 0%, #BB4E75 100%));
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.5px;
  z-index: 10;
  box-shadow: 0 8px 15px rgba(187, 78, 117, 0.25);
}

.wishlist-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  border: 1px solid rgba(255,255,255,0.8);
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  width: 42px;
  height: 42px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.wishlist-btn:hover {
  transform: scale(1.15);
  background: white;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.liked { color: #ef4444; filter: drop-shadow(0 4px 8px rgba(239, 68, 68, 0.3)); }
.unliked { color: var(--text-light); }

/* ================= FLOATING IMAGE ================= */
.image-box {
  height: 220px;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top left, #ffffff, #f0f9ff);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.glow-backdrop {
  position: absolute;
  width: 120px;
  height: 120px;
  background: var(--primary);
  filter: blur(60px);
  opacity: 0.05;
  border-radius: 50%;
  transition: 0.5s;
}

.image-box img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 2;
}

.card:hover img {
  transform: scale(1.15) translateY(-8px) rotate(-3deg);
  filter: drop-shadow(0 20px 25px rgba(0,0,0,0.15));
}

.card:hover .glow-backdrop {
  opacity: 0.15;
  transform: scale(1.5);
}

/* ================= INFO SECTION ================= */
.info {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.category-tag {
  font-size: 11px;
  font-weight: 700;
  color: var(--secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.name {
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 12px;
  color: var(--text-main);
  cursor: pointer;
  line-height: 1.3;
  transition: color 0.3s ease;
  /* Truncate long names */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card:hover .name {
  color: var(--primary);
}

/* ================= RATINGS ================= */
.rating {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  margin-bottom: 16px;
}

.stars {
  color: #f59e0b;
  font-weight: 700;
  background: rgba(245, 158, 11, 0.1);
  padding: 4px 8px;
  border-radius: 8px;
}

.reviews {
  color: var(--text-light);
  font-weight: 500;
}

/* ================= PRICE & CART ROW ================= */
.price-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid rgba(0,0,0,0.04);
}

.price-stack {
  display: flex;
  flex-direction: column;
}

.price {
  font-size: 22px;
  font-weight: 800;
  color: var(--text-main);
}

.old {
  text-decoration: line-through;
  color: var(--text-light);
  font-size: 13px;
  font-weight: 500;
}

/* Glowing Add Button */
.add-btn {
  padding: 12px 20px;
  border-radius: 14px;
  border: none;
  background: var(--accent-gradient, linear-gradient(135deg, #005f73 0%, #14b8a6 100%));
  color: white;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.4s ease;
  box-shadow: 0 8px 20px rgba(0, 95, 115, 0.15);
}

.add-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 25px rgba(0, 95, 115, 0.3);
  filter: brightness(1.1);
}
`;

export default Card;