import { Link } from "react-router-dom";
import "./Navbar.css";

// Icons
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined"; // Added for the new Cart link
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import { useWishlist } from "../../pages/wishlist/WishlistContext";
import logo from "../../assets/logonew.jpeg";
import HeaderSearch from "../common/HeaderSearch/HeaderSearch";

// Import our global cart brain
import { useCart } from "../../pages/cart/CartContext"; 

function Navbar() {
  const isLoggedIn = false; // later from auth

  // We only need the count now! The drawer is gone.
  const { getCartCount } = useCart();
const { wishlist } = useWishlist();
  const handleProtectedClick = (e) => {
    if (!isLoggedIn) e.preventDefault();
  };

  return (
    <header className="navbar glass-nav">
      <div className="container navbar__inner">

        {/* LOGO */}
        <Link to="/" className="navbar__logo" onClick={() => window.scrollTo(0,0)}>
          <div className="logo-img-wrapper">
            <img src={logo} alt="Delivery App" />
          </div>
          <span className="logo-text">Ship<span className="text-gradient">zyy</span></span>
        </Link>

        {/* NAV LINKS WITH ICONS */}
        <nav className="navbar__links">
          <Link to="/" className="nav-item" onClick={() => window.scrollTo(0,0)}>
            <HomeOutlinedIcon fontSize="small" />
            <span>Home</span>
          </Link>

          <Link 
            to="/shop" 
            className="nav-item"
            onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
          >
            <StorefrontOutlinedIcon fontSize="small" />
            <span>Category</span>
          </Link>

          {/* 🔴 CHANGED: This is now the Cart page link! */}
          <Link 
            to="/cart" 
            className="nav-item"
            onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
          >
            <ShoppingCartOutlinedIcon fontSize="small" />
            <span>Cart</span>
            {/* Show badge next to text if there are items */}
            {getCartCount() > 0 && (
              <span className="cart-badge-inline" style={{ 
                background: '#ec4899', color: 'white', borderRadius: '50px', 
                padding: '2px 8px', fontSize: '11px', fontWeight: 'bold', marginLeft: '6px' 
              }}>
                {getCartCount()}
              </span>
            )}
          </Link>

          <Link to="/contact" className="nav-item">
            <CallOutlinedIcon fontSize="small" />
            <span>Help</span>
          </Link>
        </nav>

        {/* RIGHT SIDE ACTIONS */}
        <div className="navbar__actions">

          <Link to="/wishlist" className="icon-btn" aria-label="Wishlist">
  <FavoriteBorderIcon />
  {wishlist.length > 0 && <span className="cart-badge">{wishlist.length}</span>}
</Link>

          {/* 🔴 CHANGED: This icon is now your Order History link! */}
          <Link
            to="/orders"
            className="icon-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
            aria-label="My Orders"
          >
            <ShoppingBagOutlinedIcon />
          </Link>

          <div className="auth-section">
            {!isLoggedIn ? (
              <Link to="/login" className="login-btn premium-shadow">
                Login
              </Link>
            ) : (
              <div className="profile-pill">
                <div className="avatar">L</div>
                <span>Lakshya</span>
              </div>
            )}
          </div>
        </div>

      </div>
      
      {/* Search Bar Container */}
      <div className="navbar-search-wrapper">
         <HeaderSearch/>
      </div>
    </header>
  );
}

export default Navbar;