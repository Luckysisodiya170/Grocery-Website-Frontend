import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../pages/cart/CartContext";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { encodeId } from "../../utils/crypto";

const CartPage = () => {
  const { cart, addToCart, removeFromCart, clearItemFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [tipAmount, setTipAmount] = useState(0);

  const subtotal = useMemo(
    () => cart.reduce((total, item) => {
      const price = Number(item.offer_price || item.sale_price || item.price || 0);
      return total + price * item.quantity;
    }, 0),
    [cart]
  );

  const deliveryFee = subtotal > 999 || subtotal === 0 ? 0 : 60;
  const platformFee = subtotal > 0 ? 15 : 0; 
  const gst = subtotal > 0 ? Math.round(subtotal * 0.05) : 0; // 5% GST
  
  const grandTotal = subtotal + deliveryFee + platformFee + gst + tipAmount - discount;

  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === "SAVE10") {
      const discountValue = subtotal * 0.1;
      setDiscount(discountValue);
      setCouponMessage("Coupon Applied 🎉 You saved 10%");
    } else {
      setDiscount(0);
      setCouponMessage("Invalid Coupon Code");
    }
  };

  // ================= EMPTY CART STATE =================
  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-[75vh] flex justify-center items-center p-5 lg:p-10">
        <div className="bg-[var(--card-bg)] p-[60px_30px] lg:p-[60px_50px] rounded-[30px] text-center max-w-[600px] w-full shadow-[var(--shadow-float)] border border-[var(--border)] animate-[fadeIn_0.4s_ease]">
          <span className="text-[70px] block mb-5">🛍️</span>
          <h1 className="text-[32px] font-black mb-4 text-[var(--text-main)]">Your Cart is Empty</h1>
          <p className="text-[16px] text-[var(--text-muted)] mb-[30px]">
            Looks like you haven’t added anything yet. Start shopping and fill your bag with amazing products.
          </p>
          <Link 
            to="/shop" 
            className="inline-block py-3.5 px-8 rounded-full bg-[image:var(--brand-gradient)] text-white font-bold transition-transform duration-300 hover:scale-105 shadow-[var(--shadow-sm)]"
          >
            Start Shopping
          </Link>
          <div className="mt-[30px] flex justify-center gap-5 text-[14px] text-[var(--text-muted)] font-semibold flex-wrap">
            <span>🔥 Trending Products</span>
            <span>🥬 Fresh Groceries</span>
            <span>⚡ Fast Delivery</span>
          </div>
        </div>
      </div>
    );
  }

  // ================= FULL CART STATE =================
  return (
    <div className="pt-[80px] pb-[100px] px-4 md:px-8 min-h-screen max-w-[1400px] mx-auto w-full">
      
      {/*  STICKY GRID LAYOUT  */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">

        {/* LEFT SIDE: CART ITEMS */}
        <div className="flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-[30px] gap-4">
            <h1 className="text-[28px] font-extrabold flex items-center gap-[15px] text-[var(--secondary)]">
              Shopping Cart 
              <span className="bg-[var(--primary)] text-[var(--secondary)] px-3 py-1 rounded-full text-[16px] font-bold">
                {cart.length}
              </span>
            </h1>
            <div className="bg-[var(--card-bg)] p-2.5 rounded-lg">
              <button 
                className="bg-[var(--danger)]/10 text-[var(--danger)] border-none px-4 py-2 rounded-lg font-bold cursor-pointer transition-colors hover:bg-[var(--danger)] hover:text-white" 
                onClick={clearCart}
            >
              Clear Cart
            </button>
            </div>
          </div>

          {cart.map((item) => {
            // Data mapping variables
            const itemPrice = Number(item.offer_price || item.sale_price || item.price || 0).toFixed(0); 
            const itemImage = item.product_image || item.image || "https://via.placeholder.com/80?text=No+Image";
           const handleProductClick = () => {
              window.scrollTo({ top: 0, behavior: "instant" });
              const maskedKey = encodeId(item.id); 
              navigate(`/product/${maskedKey}`); 
            };
            return (
              <div className="flex flex-wrap md:flex-nowrap items-center bg-[var(--card-bg)] p-5 rounded-[16px] mb-5 shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-[var(--border)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]" key={item.id}>
                
                {/* Image */}
                <div                     onClick={handleProductClick}
 className="w-full md:w-[80px] h-[120px] md:h-[80px] bg-[var(--bg-soft)] border border-[var(--border)] rounded-[12px] p-2.5 mr-0 md:mr-5 mb-4 md:mb-0 shrink-0 flex justify-center items-center">
                                    

                  <img 
                    src={itemImage} 
                    alt={item.name} 
                    className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal" 
                  />
                </div>

                {/* Details */}
              <div                     onClick={handleProductClick}
 className="flex-1 min-w-[200px] w-full md:w-auto mb-4 md:mb-0"> 
                  {/* <p className="text-[12px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1">
                    {item.category || "General"}
                  </p> */}
                  <h3 className="text-[16px] text-[var(--text-main)] font-bold m-0 line-clamp-2">
                    {item.name}
                  </h3>
                  
                  {/* Price */}
                  <div className="text-[20px] font-bold text-[var(--success)] mt-1">
                    ₹{itemPrice}
                  </div>
                </div>

                {/* Qty Control */}
                <div className="flex items-center gap-[15px] bg-[var(--bg-soft)] py-1.5 px-2.5 rounded-[12px] mr-0 md:mr-5 w-full md:w-auto justify-between md:justify-center mb-4 md:mb-0">
                  <button 
                    className="bg-[var(--card-bg)] border border-[var(--border)] w-[36px] h-[36px] rounded-[10px] flex justify-center items-center font-bold text-[var(--text-main)] cursor-pointer transition-colors hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)]"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <RemoveIcon fontSize="small" />
                  </button>
                  <span className="font-black text-[16px] text-[var(--text-main)] w-[20px] text-center">{item.quantity}</span>
                  <button 
                    className="bg-[var(--card-bg)] border border-[var(--border)] w-[36px] h-[36px] rounded-[10px] flex justify-center items-center font-bold text-[var(--text-main)] cursor-pointer transition-colors hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)]"
                    onClick={() => addToCart({ ...item, quantity: 1 })}
                  >
                    <AddIcon fontSize="small" />
                  </button>
                </div>

                {/* Total & Delete */}
                <div className="flex items-center justify-between w-full md:w-auto">
                  <div className="md:w-[100px] font-extrabold text-[18px] text-[var(--text-main)] md:text-right mr-5">
                    ₹{(itemPrice * item.quantity).toFixed(0)}
                  </div>
                  <button 
                    className="bg-[var(--danger)]/10 text-[var(--danger)] border border-transparent w-[40px] h-[40px] rounded-[10px] flex items-center justify-center cursor-pointer transition-colors hover:bg-[var(--danger)] hover:text-white shrink-0" 
                    onClick={() => clearItemFromCart(item.id)}
                  >
                    <DeleteOutlineIcon />
                  </button>
                </div>
                
              </div>
            );
          })}
        </div>

        {/* RIGHT SIDE: STICKY SUMMARY */}
        <aside className="bg-[var(--card-bg)] p-[30px] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-[var(--border)] sticky top-[100px]">
          <h2 className="text-[22px] font-extrabold mb-5 text-[var(--text-main)]">Order Summary</h2>

          {/* FREE SHIPPING PROGRESS */}
          <div className="w-full h-[6px] bg-[var(--bg-soft)] rounded-[10px] overflow-hidden mb-2.5">
            <div 
              className="h-full bg-[var(--success)] transition-all duration-300 ease-out"
              style={{ width: `${Math.min((subtotal / 1000) * 100, 100)}%` }} 
            />
          </div>
          <p className="text-[13px] text-[var(--text-muted)] font-semibold mb-6">
            {subtotal < 1000
              ? `Add ₹${1000 - subtotal} more for FREE delivery 🚚`
              : "You unlocked FREE Delivery 🎉"}
          </p>

          {/* COUPON */}
          <div className="flex items-center bg-[var(--bg-soft)] border border-[var(--border)] rounded-[12px] p-1.5 pl-3.5 mb-2.5">
            <LocalOfferIcon className="text-[var(--text-muted)]" fontSize="small" />
            <input
              type="text"
              placeholder="Enter Coupon (SAVE10)"
              className="flex-1 border-none bg-transparent outline-none p-2.5 text-[14px] text-[var(--text-main)] placeholder-[var(--text-muted)]"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <button 
              className="bg-[var(--text-main)] text-[var(--card-bg)] border-none py-2.5 px-5 rounded-[8px] font-bold cursor-pointer hover:opacity-90 transition-opacity" 
              onClick={handleApplyCoupon}
            >
              Apply
            </button>
          </div>

          {couponMessage && (
            <p className={`text-[13px] font-semibold mb-6 ${discount > 0 ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
              {couponMessage}
            </p>
          )}

          {/* TIP SECTION */}
          <div className="mb-6 pb-5 border-b border-dashed border-[var(--border)]">
            <h4 className="text-[14px] text-[var(--text-main)] mb-3 font-bold">Support your delivery partner</h4>
            <div className="flex gap-2.5">
              {[10, 20, 30, 50].map((amt) => (
                <button
                  key={amt}
                  className={`flex-1 py-2 rounded-[10px] border font-bold text-[14px] cursor-pointer transition-colors ${
                    tipAmount === amt 
                      ? "bg-[var(--success)]/10 border-[var(--success)] text-[var(--success)]" 
                      : "bg-[var(--bg-soft)] border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--border)]"
                  }`}
                  onClick={() => setTipAmount(tipAmount === amt ? 0 : amt)}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>

          {/* DETAILED SUMMARY ROWS */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-[15px] text-[var(--text-main)] font-semibold">
              <span>Item Total</span>
              <span>₹{subtotal.toFixed(0)}</span>
            </div>

            <div className="flex justify-between text-[13px] text-[var(--text-muted)] font-semibold">
              <span>Handling & Platform Fee</span>
              <span>₹{platformFee}</span>
            </div>

            <div className="flex justify-between text-[13px] text-[var(--text-muted)] font-semibold">
              <span>Taxes & GST</span>
              <span>₹{gst}</span>
            </div>

            <div className="flex justify-between text-[15px] text-[var(--text-main)] font-semibold">
              <span>Delivery Fee</span>
              <span className={deliveryFee === 0 ? "text-[var(--success)] font-bold" : ""}>
                {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
              </span>
            </div>

            {tipAmount > 0 && (
              <div className="flex justify-between text-[15px] text-[var(--success)] font-bold">
                <span>Delivery Partner Tip</span>
                <span>₹{tipAmount}</span>
              </div>
            )}

            {discount > 0 && (
              <div className="flex justify-between text-[15px] text-[var(--success)] font-bold">
                <span>Discount Applied</span>
                <span>- ₹{discount.toFixed(0)}</span>
              </div>
            )}
          </div>

          {/* GRAND TOTAL */}
          <div className="flex justify-between items-baseline mt-5 pt-5 border-t border-dashed border-[var(--border)] text-[24px] font-black text-[var(--text-main)]">
            <span>Grand Total</span>
            <span className="text-[32px]">₹{grandTotal.toFixed(0)}</span>
          </div>

          <button 
            className="w-full p-[18px] mt-6 bg-[image:var(--brand-gradient)] text-white border-none rounded-[14px] text-[16px] font-black uppercase tracking-wide cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]" 
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>

          {/* TRUST BADGES */}
          <div className="flex justify-between mt-5 text-[11px] text-[var(--text-muted)] font-bold text-center">
            <span>✔ Secure Payments</span>
            <span>✔ 7-Day Returns</span>
            <span>✔ 100% Fresh</span>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default CartPage;