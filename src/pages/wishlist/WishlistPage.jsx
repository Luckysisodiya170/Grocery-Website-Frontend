import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from './WishlistContext';
import { useCart } from '../cart/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getWishlistItems, toggleWishlistApi, clearAllWishlistApi } from '../../utils/wishlistApi';
import { toast } from 'react-toastify';
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { encodeId } from '../../utils/crypto';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlist, setWishlist, toggleWishlist, loading } = useWishlist();
  const { cart, addToCart, removeFromCart } = useCart();
  const { user } = useAuth();

  const [apiWishlist, setApiWishlist] = useState([]);
  const [isApiLoading, setIsApiLoading] = useState(true);

  const fetchItems = async () => {
    if (user) {
      try {
        const res = await getWishlistItems();
        if (res && res.success) {
          setApiWishlist(res.data?.items || []);
        }
      } catch (err) { 
        console.error(err); 
      }
    }
    setIsApiLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [user]);

  const displayItems = user ? apiWishlist : wishlist;

  const handleRemoveItem = async (item) => {
    if (user) {
      try {
        setApiWishlist(prev => prev.filter(i => i.id !== item.id));
        
        const res = await toggleWishlistApi(item.id, false);
        if (res.success) {
          toast.success("Removed from wishlist");
        }
      } catch (err) {
        toast.error("Could not remove item", err);
        fetchItems();
      }
    } else {
      toggleWishlist(item); 
    }
  };

  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to clear your entire wishlist?")) {
      if (user) {
        try {
          const res = await clearAllWishlistApi();
          if (res.success) {
            setApiWishlist([]);
            toast.success("Wishlist cleared!");
          }
        } catch (err) {
          toast.error("Failed to clear wishlist", err);
        }
      } else {
        setWishlist([]); 
      }
    }
  };

  if (loading || isApiLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen pt-[60px] pb-[40px] px-4 md:px-8 max-w-[1000px] mx-auto w-full">
        
      {displayItems.length > 0 ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-[30px] gap-4">
            <div>
              <h1 className="text-[32px] md:text-[40px] font-extrabold flex items-center gap-[15px] text-[var(--secondary)]">
                My Wishlist
                <span className="bg-[var(--primary)] text-[var(--secondary)] px-3 py-1 rounded-full text-[16px] font-bold">
                  {displayItems.length}
                </span>
              </h1>
              <p className="text-[var(--secondary)] font-bold uppercase text-[12px] tracking-[2px] mt-1">
                Saved Products
              </p>
            </div>

            <div className='bg-[var(--card-bg)] p-2.5 rounded-lg'>
              <button 
                onClick={handleClearAll}
                className="bg-[var(--danger)]/10 text-[var(--danger)] border-none px-5 py-2.5 rounded-lg font-bold cursor-pointer transition-colors hover:bg-[var(--danger)] hover:text-white"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {displayItems.map((item, index) => {
              const cartItem = cart.find((c) => c.id === item.id);
              const quantity = cartItem ? cartItem.quantity : 0;
              const isAvailable = parseInt(item.stock_available || 1) > 0;
              const itemPrice = Number(item.offer_price || item.price || 0).toFixed(0); 

              const handleProductClick = () => {
                window.scrollTo({ top: 0, behavior: "instant" });
                const maskedKey = encodeId(item.id); 
                navigate(`/product/${maskedKey}`); 
              };

              return (
                <div 
                  key={item.id}
                  className="flex flex-wrap md:flex-nowrap items-center bg-[var(--card-bg)] p-5 rounded-[16px] shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-[var(--border)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)] animate-[fadeIn_0.4s_ease]"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  
                  <div 
                    className="w-full md:w-[100px] h-[120px] md:h-[100px] bg-[var(--bg-soft)] border border-[var(--border)] rounded-[12px] p-2.5 mr-0 md:mr-6 mb-4 md:mb-0 shrink-0 flex justify-center items-center cursor-pointer"
                    onClick={handleProductClick}
                  >
                    <img 
                      src={item.product_image || item.image || "https://via.placeholder.com/80?text=No+Image"} 
                      className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-300"
                      alt={item.name}
                    />
                  </div>

                  <div className="flex-1 min-w-[200px] w-full md:w-auto mb-4 md:mb-0 cursor-pointer" onClick={handleProductClick}>
                    <p className="text-[12px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1">{item.category || "General"}</p>
                    <h3 className="text-[18px] text-[var(--text-main)] font-bold m-0 line-clamp-2">{item.name}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[20px] font-black text-[var(--success)]">
                        ₹{itemPrice}
                      </span>
                      {item.mrp && (
                        <span className="text-[13px] text-[var(--text-muted)] line-through font-bold">
                          ₹{item.mrp}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    
                    {quantity === 0 ? (
                      <button 
                        onClick={() => addToCart(item)}
                        disabled={!isAvailable}
                        className="bg-[image:var(--brand-gradient)] text-white border-none py-2.5 px-6 rounded-[10px] font-bold cursor-pointer transition-transform duration-300 hover:scale-105 shadow-[var(--shadow-sm)] disabled:opacity-50 disabled:hover:scale-100"
                      >
                        {isAvailable ? "Add to Cart" : "Out of Stock"}
                      </button>
                    ) : (
                      <div className="flex items-center gap-[15px] bg-[var(--bg-soft)] py-1.5 px-2.5 rounded-[12px]">
                        <button 
                          className="bg-[var(--card-bg)] border border-[var(--border)] w-[32px] h-[32px] rounded-[8px] flex justify-center items-center font-bold text-[var(--text-main)] cursor-pointer hover:bg-[var(--primary)] hover:text-white"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <RemoveIcon fontSize="small" />
                        </button>
                        <span className="font-black text-[15px] text-[var(--text-main)] w-[20px] text-center">{quantity}</span>
                        <button 
                          className="bg-[var(--card-bg)] border border-[var(--border)] w-[32px] h-[32px] rounded-[8px] flex justify-center items-center font-bold text-[var(--text-main)] cursor-pointer hover:bg-[var(--primary)] hover:text-white"
                          onClick={() => addToCart(item)}
                        >
                          <AddIcon fontSize="small" />
                        </button>
                      </div>
                    )}

                    <button 
                      onClick={() => handleRemoveItem(item)}
                      className="bg-[var(--danger)]/10 text-[var(--danger)] border border-transparent w-[42px] h-[42px] rounded-[10px] flex items-center justify-center cursor-pointer transition-colors hover:bg-[var(--danger)] hover:text-white shrink-0 ml-2" 
                      title="Remove from Wishlist"
                    >
                      <DeleteOutlineIcon />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="min-h-[60vh] flex justify-center items-center">
          <div className="bg-[var(--card-bg)] p-[60px_30px] lg:p-[40px_40px] rounded-[30px] text-center max-w-[600px] w-full shadow-[var(--shadow-float)] border border-[var(--border)] animate-[fadeIn_0.4s_ease]">
            
            <div className="w-[120px] h-[120px] bg-[var(--bg-soft)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <span className="text-[60px] block">💖</span>
            </div>
            
            <h1 className="text-[32px] font-black mb-4 text-[var(--text-main)]">
              Your Wishlist is Empty
            </h1>
            
            <p className="text-[16px] text-[var(--text-muted)] mb-[30px] font-medium leading-relaxed px-4">
              Looks like you haven't found your favorites yet. Explore our collection and save the items you love!
            </p>
            
            <Link 
              to="/shop" 
              className="inline-block py-3.5 px-10 rounded-full bg-[image:var(--brand-gradient)] text-white font-bold transition-transform duration-300 hover:scale-105 shadow-[var(--shadow-sm)]"
            >
              Discover Products
            </Link>

            <div className="mt-[35px] pt-[25px] border-t border-[var(--border)] flex justify-center gap-6 text-[13px] text-[var(--text-muted)] font-semibold flex-wrap">
              <span className="hover:text-[var(--primary)] transition-colors cursor-pointer">✨ New Arrivals</span>
              <span className="hover:text-[var(--primary)] transition-colors cursor-pointer">🔥 Trending</span>
              <span className="hover:text-[var(--primary)] transition-colors cursor-pointer">🎁 Best Offers</span>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;