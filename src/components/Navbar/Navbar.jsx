import { NavLink, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

// Icons
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded"; 

import { useWishlist } from "../../pages/wishlist/WishlistContext";
import { useCart } from "../../pages/cart/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useOrders } from "../../pages/cart/OrdersContext";
import logo from "../../assets/logonew.jpeg";
import HeaderSearch from "../common/HeaderSearch/HeaderSearch";

function Navbar() {
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();
  const { orders } = useOrders();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Standard Link Classes matching Cyan 900
  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 font-extrabold text-base ${
      isActive 
      ? "bg-cyan-900 text-white shadow-xl shadow-cyan-900/20 scale-105" 
      : "text-slate-600 hover:bg-cyan-50 hover:text-cyan-900"
    }`;

  return (
    <header className="sticky top-0 z-[1000] w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <img src={logo} alt="Logo" className="w-10 h-10 rounded-xl object-cover border border-slate-100 group-hover:border-cyan-900/30 transition-all" />
              <span className="text-2xl font-black text-cyan-900 tracking-tighter">Shipzyy</span>
            </Link>
          </div>

          {/* Nav Links with Cyan 900 Theme */}
          <nav className="hidden lg:flex items-center gap-2">
            <NavLink to="/" className={navLinkClasses}>
              <HomeOutlinedIcon fontSize="small" />
              <span>Home</span>
            </NavLink>

            <NavLink to="/wishlist" className={navLinkClasses}>
              <div className="relative flex items-center">
                <FavoriteBorderIcon fontSize="small" />
                {wishlist?.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full border border-white animate-pulse"></span>
                )}
              </div>
              <span>Wishlist</span>
            </NavLink>

            <NavLink to="/orders" className={navLinkClasses}>
              <div className="relative flex items-center">
                <ShoppingBagOutlinedIcon fontSize="small" />
                {orders?.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-cyan-600 w-2 h-2 rounded-full border border-white"></span>
                )}
              </div>
              <span>Orders</span>
            </NavLink>

            <NavLink to="/cart" className={navLinkClasses}>
              <div className="relative flex items-center">
                <ShoppingCartOutlinedIcon fontSize="small" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-cyan-900 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-black shadow-sm">
                    {getCartCount()}
                  </span>
                )}
              </div>
              <span>Cart</span>
            </NavLink>

            <NavLink to="/help" className={navLinkClasses}>
              <CallOutlinedIcon fontSize="small" />
              <span>Help</span>
            </NavLink>
          </nav>

          {/* Profile Section */}
          <div className="flex items-center gap-3">
            <div className="relative" ref={dropdownRef}>
              {!isLoggedIn ? (
                <Link to="/login" className="bg-cyan-900 text-white font-black px-8 py-3 rounded-2xl hover:bg-cyan-950 transition-all shadow-lg shadow-cyan-900/20 text-sm">
                  Login
                </Link>
              ) : (
                <div 
                  className="w-12 h-12 rounded-2xl bg-cyan-900 border border-cyan-800 cursor-pointer hover:scale-105 transition-all flex items-center justify-center shadow-lg shadow-cyan-900/10"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <PersonRoundedIcon className="text-white scale-110" />
                </div>
              )}

              {/* Profile Dropdown matching Cyan 900 */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-5 w-72 bg-white border border-slate-100 rounded-[32px] shadow-[0_25px_70px_rgba(8,47,55,0.15)] p-2 animate-in fade-in zoom-in duration-200 z-[1100]">
                  <div className="flex items-center gap-4 px-4 py-5 mb-2 bg-cyan-50/50 rounded-[24px]">
                    <div className="w-12 h-12 rounded-full bg-cyan-900 flex items-center justify-center text-white shadow-md">
                      <PersonRoundedIcon fontSize="medium" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-[10px] font-black text-cyan-900/40 uppercase tracking-widest leading-none mb-1">Account</p>
                      <p className="text-cyan-900 font-black text-base truncate">
                        {user?.phone || user?.name || "User"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Link 
                      to="/profile" 
                      onClick={() => setIsDropdownOpen(false)} 
                      className="flex items-center justify-between px-5 py-4 text-slate-700 hover:bg-cyan-50 rounded-[20px] transition-all group"
                    >
                      <div className="flex items-center gap-3 font-bold text-sm">
                        <PersonOutlineRoundedIcon className="text-slate-400 group-hover:text-cyan-900" /> 
                        Profile Details
                      </div>
                      <span className="text-slate-300 group-hover:text-cyan-900 transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                    
                    <button 
                      onClick={() => { logout(); setIsDropdownOpen(false); }} 
                      className="w-full flex items-center gap-3 px-5 py-4 text-red-500 hover:bg-red-50 rounded-[20px] font-extrabold text-sm transition-all group"
                    >
                      <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-colors">
                        <LogoutRoundedIcon fontSize="small" /> 
                      </div>
                      Logout Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sub Header - Search */}
      <div className="bg-slate-50/50 py-3 border-t border-slate-100">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8">
          <HeaderSearch />
        </div>
      </div>
    </header>
  );
}

export default Navbar;