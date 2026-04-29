import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from './WishlistContext';
import { useCart } from '../cart/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getWishlistItems, toggleWishlistApi, clearAllWishlistApi } from '../../utils/wishlistApi';
import { toast } from 'react-toastify';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlist, setWishlist, toggleWishlist, loading } = useWishlist();
  const { cart, addToCart, removeFromCart } = useCart();
  const { user } = useAuth();

  const [apiWishlist, setApiWishlist] = useState([]);
  const [isApiLoading, setIsApiLoading] = useState(true);

  // 🔄 Fetch Data on Load
  const fetchItems = async () => {
    if (user) {
      try {
        const res = await getWishlistItems();
        if (res && res.success) {
          setApiWishlist(res.data?.items || []);
        }
      } catch (err) { console.error(err); }
    }
    setIsApiLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

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
        toast.error("Could not remove item");
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
          toast.error("Failed to clear wishlist");
        }
      } else {
        setWishlist([]); 
      }
    }
  };

  const handleProductClick = (id) => {
    window.scrollTo({ top: 0, behavior: "instant" });
    navigate(`/product/${id}`);
  };

  if (loading || isApiLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen py-24">
      <div className="w-full px-6 md:px-12 lg:px-20 mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between gap-6 mb-16 border-b border-white/10 pb-10">
          <div>
            <h1 className="text-[40px] md:text-[52px] font-black text-[var(--secondary)] tracking-tight">
              My Wishlist
            </h1>
            <p className="text-[var(--secondary)] font-bold uppercase text-[13px] tracking-[4px] mt-2 opacity-80">
              {displayItems.length} Products Found
            </p>
          </div>

          {displayItems.length > 0 && (
            <button 
              onClick={handleClearAll}
              className="px-8 py-3.5 rounded-xl bg-transparent border-2 border-[var(--danger)] text-[var(--danger)] font-black text-[12px] uppercase tracking-widest hover:bg-[var(--danger)] hover:text-white transition-all duration-300 shadow-xl"
            >
              Clear All
            </button>
          )}
        </div>

        {/* --- LIST VIEW --- */}
        {displayItems.length > 0 ? (
          <div className="flex flex-col gap-5">
            {displayItems.map((item, index) => {
              const cartItem = cart.find((c) => c.id === item.id);
              const quantity = cartItem ? cartItem.quantity : 0;
              const isAvailable = parseInt(item.stock_available || 1) > 0;

              return (
                <div 
                  key={item.id}
                  className="glass-panel group flex flex-col md:flex-row items-center gap-8 p-6 md:px-10 rounded-[30px] border border-white/5 hover:border-white/20 transition-all duration-500 animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Left: Product Image Box (Clickable) */}
                  <div 
                    className="w-32 h-32 bg-white rounded-2xl p-4 shadow-xl flex-shrink-0 flex items-center justify-center border border-white/10 cursor-pointer"
                    onClick={() => handleProductClick(item.id)}
                  >
                    <img 
                      src={item.product_image || item.image} 
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                      alt={item.name}
                    />
                  </div>

                  {/* Middle: Content Section (Clickable) */}
                  <div className="flex-1 text-center md:text-left cursor-pointer" onClick={() => handleProductClick(item.id)}>
                    <h3 className="text-[var(--text-main)] font-black text-[22px] md:text-[26px] mb-2 tracking-tight">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-center md:justify-start gap-4">
                      <span className="text-[var(--text-main)] font-black text-2xl font-sans">
                        ₹{(item.offer_price || item.price).toLocaleString('en-IN')}
                      </span>
                      {item.mrp && (
                        <span className="text-[var(--text-light)] line-through text-sm font-bold opacity-50">
                          ₹{item.mrp}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-5 w-full md:w-auto justify-center">
                    {quantity === 0 ? (
                      <button 
                        onClick={() => addToCart(item)}
                        disabled={!isAvailable}
                        className="flex-1 md:flex-none px-10 py-4 rounded-xl bg-[var(--primary)] text-white font-black text-[12px] uppercase tracking-widest hover:bg-[var(--primary-hover)] hover:-translate-y-1 transition-all shadow-[var(--shadow-sm)] disabled:opacity-30 disabled:transform-none"
                      >
                        {isAvailable ? "Add to Cart" : "Out of Stock"}
                      </button>
                    ) : (
                      <div className="flex items-center gap-6 bg-white/5 border border-[var(--primary)] rounded-xl px-5 py-3">
                        <button onClick={() => removeFromCart(item.id)} className="text-[var(--text-main)] font-black text-2xl hover:scale-125 transition-transform">−</button>
                        <span className="text-[var(--text-main)] font-black text-lg w-6 text-center">{quantity}</span>
                        <button onClick={() => addToCart(item)} className="text-[var(--text-main)] font-black text-2xl hover:scale-125 transition-transform">+</button>
                      </div>
                    )}

                    <button 
                      onClick={() => handleRemoveItem(item)}
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[var(--text-light)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)] hover:border-[var(--danger)]/30 transition-all duration-300 group/btn"
                    >
                      <span className="text-xl group-hover/btn:rotate-90 transition-transform">✕</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-20">
            <div className="glass-panel py-20 px-10 text-center rounded-[40px] border border-white/10 max-w-[500px] w-full shadow-2xl">
              <div className="text-7xl mb-8 opacity-40">🛍️</div>
              <h2 className="text-[var(--secondary)] text-[32px] font-black mb-4">Wishlist Empty</h2>
              <p className="text-[var(--text-main)] text-lg font-medium mb-10 opacity-70">
                You haven't saved any products.
              </p>
              <Link to="/shop" className="px-12 py-4 bg-[var(--brand-gradient)] text-white rounded-full font-black uppercase tracking-widest hover:scale-105 transition-all inline-block">
                Start Exploring
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;