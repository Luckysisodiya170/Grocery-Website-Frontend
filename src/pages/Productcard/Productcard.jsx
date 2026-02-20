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

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
    setLiked(saved.includes(product.id));
  }, [product.id]);

  const toggleLike = (e) => {
    e.stopPropagation(); // Prevents navigating to product when clicking heart
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
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevents navigating to product
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
            <FavoriteIcon className="liked" style={{ color: "#ec4899" }} />
          ) : (
            <FavoriteBorderIcon className="unliked" />
          )}
        </button>

        {/* Premium Gradient Discount Badge */}
        {product.discount && (
          <span className="discount">{product.discount} OFF</span>
        )}

        {/* Floating Image Box (FIXED TO COVER TOP HALF perfectly) */}
        <div className="image-box" onClick={goToProduct}>
          <img src={product.image.startsWith('http') ? product.image : `/product/${product.image}`} alt={product.name} />
        </div>

        {/* Info Section */}
        <div className="info" onClick={goToProduct}>
          <div className="category-tag">{product.category}</div>
          
          <h4 className="name">
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
  height: 100%;
  
  .card {
    background: linear-gradient(145deg, #ffffff, #f0f9ff);
    border-radius: var(--radius-lg, 16px);
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
    transition: all 0.4s ease;
    cursor: pointer;
  }

  .card:hover {
    transform: translateY(-8px);
    box-shadow: 0 35px 70px rgba(99, 102, 241, 0.28);
    border-color: var(--primary);
  }

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

  .wishlist-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background: rgba(255, 255, 255, 0.9);
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    transition: 0.3s;
  }
  
  .wishlist-btn:hover {
    transform: scale(1.1);
    color: #ec4899;
  }

  /* THE MAGIC IMAGE FIX */
  .image-box {
    height: 200px;
    width: 100%;
    padding: 0; /* Removed padding so image goes edge-to-edge */
    background: #f8fafc; 
    overflow: hidden;
  }

  .image-box img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Forces image to stretch and cover perfectly */
    transition: transform 0.5s ease;
  }

  .card:hover .image-box img {
    transform: scale(1.08); /* Nice subtle zoom effect */
  }

  .info {
    padding: 20px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  .category-tag {
    font-size: 11px;
    font-weight: 800;
    color: var(--text-light);
    margin-bottom: 6px;
    text-transform: uppercase;
  }

  .name {
    font-size: 16px;
    font-weight: 800;
    margin-bottom: 12px;
    line-height: 1.3;
    color: var(--text-main);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .rating {
    display: flex;
    gap: 8px;
    font-size: 12px;
    margin-bottom: 15px;
    color: #f59e0b;
    font-weight: bold;
  }

  .reviews {
    color: var(--text-light);
    font-weight: normal;
  }

  .price-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
  }

  .price-stack {
    display: flex;
    flex-direction: column;
  }

  .price {
    font-size: 20px;
    font-weight: 900;
    color: var(--primary, #005f73);
  }

  .old {
    text-decoration: line-through;
    font-size: 12px;
    color: var(--text-light);
  }

  .add-btn {
    padding: 10px 18px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #6366f1, #ec4899);
    color: white;
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;
    transition: 0.3s;
  }
  
  .add-btn:hover {
    box-shadow: 0 5px 15px rgba(236, 72, 153, 0.4);
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    .image-box { height: 160px; }
    .info { padding: 14px; }
    .name { font-size: 14px; }
    .price { font-size: 18px; }
    .add-btn { padding: 8px 14px; font-size: 12px; }
  }
`;

export default Card;