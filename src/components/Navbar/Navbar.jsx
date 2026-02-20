import { Link } from "react-router-dom";
import "./Navbar.css";

import SearchBar from "../common/SearchBar";
import LocationPicker from "../common/LocationPicker";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";

import logo from "../../assets/logonew.jpeg";
import HeaderSearch from "../common/HeaderSearch/HeaderSearch";

function Navbar() {
  const isLoggedIn = false; // later from auth

  const handleProtectedClick = (e) => {
    if (!isLoggedIn) e.preventDefault();
  };

  return (
    <header className="navbar glass-nav">
      <div className="container navbar__inner">

        {/* LOGO */}
        <Link to="/" className="navbar__logo">
          <div className="logo-img-wrapper">
            <img src={logo} alt="Delivery App" />
          </div>
          <span className="logo-text">Ship<span className="text-gradient">zyy</span></span>
        </Link>

        {/* NAV LINKS WITH ICONS */}
        <nav className="navbar__links">
          <Link to="/" className="nav-item">
            <HomeOutlinedIcon fontSize="small" />
            <span>Home</span>
          </Link>

          <Link to="/shop" className="nav-item">
            <StorefrontOutlinedIcon fontSize="small" />
            <span>Category</span>
          </Link>

          <Link to="/about" className="nav-item">
            <InfoOutlinedIcon fontSize="small" />
            <span>Orders</span>
          </Link>

          <Link to="/contact" className="nav-item">
            <CallOutlinedIcon fontSize="small" />
            <span>Help</span>
          </Link>
        </nav>

        {/* RIGHT SIDE ACTIONS */}
        <div className="navbar__actions">

          <button
            className={`icon-btn ${!isLoggedIn ? "disabled" : ""}`}
            onClick={handleProtectedClick}
            aria-label="Wishlist"
          >
            <FavoriteBorderIcon />
          </button>

          <button
            className={`icon-btn cart-btn ${!isLoggedIn ? "disabled" : ""}`}
            onClick={handleProtectedClick}
            aria-label="Cart"
          >
            <ShoppingBagOutlinedIcon />
            {isLoggedIn && <span className="cart-badge">3</span>}
          </button>

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