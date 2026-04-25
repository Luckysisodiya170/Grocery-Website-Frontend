// src/components/Product/Productcard/Productcard.jsx
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
  const { toggleWishlist, isProductLiked } = useWishlist();

  const cartItem = cart.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const liked = isProductLiked(product.id);

  const requireLogin = () => {
    if (!user) { navigate("/login"); return false; }
    return true;
  };

  const goToProduct = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    navigate(`/product/${product.id}`);
  };

  // Convert strings to numbers for safety
  const offerPrice = parseFloat(product.offer_price);
  const mrp = parseFloat(product.mrp);

  return (
    <div className="group relative bg-white border border-slate-100 rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:border-slate-200">
      
      {/* Wishlist Button */}
      <button 
        className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:scale-110 transition-transform"
        onClick={(e) => { e.stopPropagation(); if(requireLogin()) toggleWishlist(product); }}
      >
        {liked ? <FavoriteIcon className="text-red-500 !text-lg" /> : <FavoriteBorderIcon className="text-red-400 !text-lg" />}
      </button>

      {/* Discount Badge */}
      {product.discount_percentage > 0 && (
        <span className="absolute top-2 left-2 z-10 bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
          {Math.round(product.discount_percentage)}% OFF
        </span>
      )}

      {/* Image Container */}
      <div className="w-full aspect-square bg-slate-50 overflow-hidden cursor-pointer flex items-center justify-center" onClick={goToProduct}>
        <img 
          src={product.product_image} 
          alt={product.name} 
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500" 
        />
      </div>

      {/* Info Section */}
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate mr-2">
            {product.category_name}
          </span>
          {/* Backend se aane wala rating */}
          <div className="flex text-amber-400 text-[10px] font-bold shrink-0">
             ★ {parseFloat(product.avg_rating || 0).toFixed(1)}
          </div>
        </div>

        <h4 className="text-sm font-bold text-slate-800 line-clamp-2 h-10 leading-5 mb-2 cursor-pointer" onClick={goToProduct}>
          {product.name}
        </h4>

        {/* 🔥 PRICE ROW FIXED: MRP dikhega ab cut hoke */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base font-black text-green-600">₹{offerPrice}</span>
          {mrp > offerPrice && (
            <span className="text-xs text-slate-400 line-through font-medium">₹{mrp}</span>
          )}
        </div>

        {/* Action Row */}
        <div className="mt-auto flex gap-2">
          <button className="flex-1 bg-cyan-900 text-white text-[10px] font-black py-2 rounded-lg hover:bg-cyan-400 transition-colors uppercase">
            Buy Now
          </button>

          {quantity === 0 ? (
            <button 
              className="flex-1 bg-white border border-cyan-600 text-cyan-600 text-[10px] font-black py-2 rounded-lg hover:bg-cyan-30 transition-colors uppercase"
              onClick={(e) => { e.stopPropagation(); if(requireLogin()) addToCart(product); }}
            >
              Add
            </button>
          ) : (
            <div className="flex-1 flex items-center justify-between bg-cyan-600 text-white rounded-lg px-2 h-[34px]">
              <button onClick={(e) => { e.stopPropagation(); removeFromCart(product.id); }} className="hover:bg-white/20 rounded p-0.5">
                <RemoveIcon className="!text-md" />
              </button>
              <span className="text-xs font-black">{quantity}</span>
              <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="hover:bg-white/20 rounded p-0.5">
                <AddIcon className="!text-md" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;