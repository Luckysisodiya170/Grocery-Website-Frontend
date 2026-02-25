import { NavLink, Link } from "react-router-dom"; import "./Navbar.css";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../pages/wishlist/WishlistContext";
import { useCart } from "../../pages/cart/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import logo from "../../assets/logonew.jpeg";
import HeaderSearch from "../common/HeaderSearch/HeaderSearch";

function Navbar() {

  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();
  const [helpOpen, setHelpOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="navbar glass-nav">
      <div className="container navbar__inner">

        <Link to="/" className="navbar__logo">
          <div className="logo-img-wrapper">
            <img src={logo} alt="Delivery App" />
          </div>
          <span className="logo-text">
            Ship<span className="text-gradient">zyy</span>
          </span>
        </Link>

        <nav className="navbar__links">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-item active-nav" : "nav-item"
            }
          >
            <HomeOutlinedIcon fontSize="small" />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/shop"
            className={({ isActive }) =>
              isActive ? "nav-item active-nav" : "nav-item"
            }
          >
            <StorefrontOutlinedIcon fontSize="small" />
            <span>Category</span>
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive ? "nav-item active-nav" : "nav-item"
            }
          >
            <ShoppingCartOutlinedIcon fontSize="small" />
            <span>Cart</span>
            {getCartCount() > 0 && (
              <span className="cart-badge-inline">
                {getCartCount()}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/help"
            className={({ isActive }) =>
              isActive ? "nav-item active-nav" : "nav-item"
            }
          >
            <CallOutlinedIcon fontSize="small" />
            <span>Help</span>
          </NavLink>

        </nav>
        <div className="navbar__actions">

          {/* Wishlist */}
          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              isActive ? "icon-btn active-icon" : "icon-btn"
            }
          >
            <FavoriteBorderIcon />
            {wishlist.length > 0 && (
              <span className="cart-badge">
                {wishlist.length}
              </span>
            )}
          </NavLink>

          {/* Orders */}
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              isActive ? "icon-btn active-icon" : "icon-btn"
            }
          >
            <ShoppingBagOutlinedIcon />
          </NavLink>

          <div className="auth-section">
            {!isLoggedIn ? (
              <Link to="/login" className="login-btn premium-shadow">
                Login
              </Link>
            ) : (
              <div className="profile-wrapper" ref={dropdownRef}>
                <div
                  className="profile-pill"
                  onClick={() => setOpen(!open)}
                >
                  <div className="avatar">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span>{user?.name}</span>
                </div>

                {open && (
                  <div className="profile-dropdown">
                    <Link to="/profile" onClick={() => setOpen(false)}>
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                        navigate("/", { replace: true });
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      <div className="navbar-search-wrapper">
        <HeaderSearch />
      </div>
    </header>
  );
}

export default Navbar;