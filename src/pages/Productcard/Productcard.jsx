import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

const Card = ({ product }) => {
  const navigate = useNavigate();

 const goToProduct = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

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
}

/* ================= HOVER ================= */
.card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 35px 70px rgba(99, 102, 241, 0.28);
}

/* ================= DISCOUNT ================= */
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
  z-index: 10;
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
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ================= IMAGE ================= */
.image-box {
  height: 230px;
  padding: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #dbeafe, #fce7f3);
  cursor: pointer;
}

.image-box img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
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
  margin-bottom: 8px;
}

.name {
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 12px;
  line-height: 1.3;
}

/* ================= PRICE ================= */
.price-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: auto;
}

.price {
  font-size: 22px;
  font-weight: 900;
}

.old {
  text-decoration: line-through;
  font-size: 13px;
}

/* ================= BUTTON ================= */
.add-btn {
  padding: 12px 20px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  color: white;
  font-weight: 700;
  font-size: 14px;
}

/* ===================================================== */
/* ⭐⭐⭐ MOBILE ONLY FIX (DESKTOP UNCHANGED) ⭐⭐⭐ */
/* ===================================================== */

@media (max-width: 768px) {

  .card {
    border-radius: 18px;
  }

  /* smaller image area */
  .image-box {
    height: 140px;
    padding: 12px;
  }

  /* reduce spacing */
  .info {
    padding: 14px;
  }

  /* smaller text */
  .name {
    font-size: 15px;
  }

  .price {
    font-size: 18px;
  }

  .category-tag {
    font-size: 10px;
  }

  /* smaller button */
  .add-btn {
    padding: 8px 14px;
    font-size: 12px;
    border-radius: 10px;
  }

  /* smaller wishlist */
  .wishlist-btn {
    width: 34px;
    height: 34px;
  }
}
  /* ================= PRODUCT GRID ================= */
.product-grid-elite {
  display: grid;
  gap: 20px;
}

/* Desktop → auto layout */
@media (min-width: 1025px) {
  .product-grid-elite {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  }
}

/* Tablet → 3 cards */
@media (max-width: 1024px) {
  .product-grid-elite {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Mobile → 3 cards (what you want) */
@media (max-width: 768px) {
  .product-grid-elite {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
}

/* Small phone → still 3 but tighter */
@media (max-width: 480px) {
  .product-grid-elite {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
}


/* small phones */
@media (max-width: 480px) {

  .image-box {
    height: 120px;
  }

  .name {
    font-size: 14px;
  }

  .price {
    font-size: 16px;
  }
}
`;
 export default Card