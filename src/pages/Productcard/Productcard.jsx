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
  background: linear-gradient(145deg, #ffffff, #f0f9ff);
  border-radius: 26px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  transition: all 0.4s ease;
  border: 4px solid linear-gradient(135deg, #6366f1, #ec4899, #14b8a6) 1;
}

.card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 35px 70px rgba(99, 102, 241, 0.28);
 

}

/* ================= DISCOUNT BADGE ================= */
.discount {
  position: absolute;
  top: 15px;
  left: 15px;
  background: linear-gradient(135deg, #ff6a00, #ee0979);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.5px;
  z-index: 10;
  box-shadow: 0 8px 20px rgba(238, 9, 121, 0.4);
}

/* ================= WISHLIST ================= */
.wishlist-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: white;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.wishlist-btn:hover {
  transform: scale(1.15);
}

.liked {
  color: #ff006e;
  filter: drop-shadow(0 6px 10px rgba(255, 0, 110, 0.4));
}

.unliked {
  color: #94a3b8;
}

/* ================= IMAGE SECTION ================= */
.image-box {
  height: 230px;
  padding: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #dbeafe, #fce7f3);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.image-box::before {
  content: "";
  position: absolute;
  width: 160px;
  height: 160px;
  background: radial-gradient(circle, #6366f1, transparent);
  opacity: 0.15;
  border-radius: 50%;
  transition: 0.5s;
}

.card:hover .image-box::before {
  transform: scale(1.6);
  opacity: 0.25;
}

.image-box img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: all 0.5s ease;
  z-index: 2;
}

.card:hover img {
  transform: scale(1.15) rotate(-4deg);
  filter: drop-shadow(0 20px 30px rgba(0,0,0,0.2));
}

/* ================= INFO ================= */
.info {
  padding: 22px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.category-tag {
  font-size: 11px;
  font-weight: 800;
  background: linear-gradient(90deg, #6366f1, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.name {
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 12px;
  color: #111827;
  cursor: pointer;
  line-height: 1.3;
  transition: 0.3s;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card:hover .name {
  background: linear-gradient(90deg, #6366f1, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ================= RATING ================= */
.rating {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  margin-bottom: 14px;
}

.stars {
  background: linear-gradient(135deg, #facc15, #f97316);
  color: white;
  padding: 4px 8px;
  border-radius: 8px;
  font-weight: 700;
}

.reviews {
  color: #64748b;
  font-weight: 500;
}

/* ================= PRICE ================= */
.price-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: auto;
}

.price-stack {
  display: flex;
  flex-direction: column;
}

.price {
  font-size: 22px;
  font-weight: 900;
  background: linear-gradient(90deg, #14b8a6, #6366f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.old {
  text-decoration: line-through;
  color: #94a3b8;
  font-size: 13px;
}

/* ================= ADD BUTTON ================= */
.add-btn {
  padding: 12px 20px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  color: white;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.4s ease;
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
}

.add-btn:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 20px 35px rgba(236, 72, 153, 0.4);
}
`;

export default Card;