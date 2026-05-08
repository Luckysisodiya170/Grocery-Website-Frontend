import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../pages/cart/CartContext";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { encodeId } from "../../utils/crypto";
import { getCheckoutDetails } from "../../utils/checkoutApi";
import { getProfileDetails } from "../../utils/profileApi";
import { toast } from "react-toastify";

const CartPage = () => {
  const { cart, addToCart, removeFromCart, clearItemFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [tipAmount, setTipAmount] = useState(0);

  // API States
  const [defaultAddressId, setDefaultAddressId] = useState(null);
  const [billDetails, setBillDetails] = useState(null);
  const [isLoadingBill, setIsLoadingBill] = useState(false);

  // Fallback Subtotal 
  const fallbackSubtotal = useMemo(
    () => cart.reduce((total, item) => {
      const price = Number(item.offer_price || item.sale_price || item.price || 0);
      return total + price * item.quantity;
    }, 0),
    [cart]
  );

  // FETCH DEFAULT ADDRESS
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await getProfileDetails();
        if (res?.success && res.data?.addresses?.length > 0) {
          const defaultAddr = res.data.addresses.find(a => a.is_default) || res.data.addresses[0];
          setDefaultAddressId(defaultAddr.id);
        }
      } catch (err) {
        console.error("Failed to fetch address", err);
      }
    };
    fetchAddress();
  }, []);

  // FETCH REAL BILL DYNAMICALLY
  useEffect(() => {
    if (cart.length === 0) return;

    const fetchBill = async () => {
      setIsLoadingBill(true);
      try {
        const res = await getCheckoutDetails(defaultAddressId, appliedCoupon);
        if (res?.success) {
          setBillDetails(res.data);
          
          if (res.data.coupon_applied) {
            setCouponMessage(`🎉 ${res.data.coupon_applied.title} Applied!`);
          } else {
            setCouponMessage("");
          }
        }
      } catch (err) {
        if (appliedCoupon) {
          setCouponMessage("❌ Invalid or Expired Coupon Code");
          setAppliedCoupon(null);
          setCouponInput("");
        }
      } finally {
        setIsLoadingBill(false);
      }
    };

    const timer = setTimeout(() => {
      fetchBill();
    }, 500);

    return () => clearTimeout(timer);
  }, [cart, defaultAddressId, appliedCoupon]);

  // COUPON HANDLERS
  const handleApplyCoupon = () => {
    if (!couponInput.trim()) {
      setCouponMessage("Please enter a valid code");
      return;
    }
    setAppliedCoupon(couponInput.trim().toUpperCase()); 
  };

  const handleApplyFromList = (code) => {
    setCouponInput(code);
    setAppliedCoupon(code);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponMessage("");
  };

  // EMPTY CART STATE
  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-[75vh] flex justify-center items-center p-5 lg:p-10">
        <div className="p-12 md:p-16 rounded-[30px] text-center max-w-[600px] w-full shadow-lg bg-white border border-slate-100">
          <span className="text-[70px] block mb-5">🛍️</span>
          <h1 className="text-3xl font-black mb-4 text-slate-800">Your Cart is Empty</h1>
          <p className="text-base text-slate-500 mb-8">
            Looks like you haven’t added anything yet. Start shopping and fill your bag with amazing products.
          </p>
          <Link 
            to="/" 
            className="inline-block py-4 px-10 rounded-full bg-slate-900 text-white font-bold transition-transform hover:scale-105 shadow-md uppercase tracking-widest text-sm"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const orderSummary = billDetails?.order_summary || {};
  const displaySubtotal = orderSummary.subtotal || fallbackSubtotal;
  const displayDiscount = orderSummary.discount || 0;
  const displayDelivery = orderSummary.delivery_charges || 0;
  const grandTotal = (orderSummary.total || fallbackSubtotal) + tipAmount;
  const eligibleCoupons = billDetails?.eligible_coupons || [];
  const appliedCouponData = billDetails?.coupon_applied || null;

  return (
    <div className="py-10 md:py-16 px-4 md:px-6 min-h-screen">
      <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-8">

        {/* TOP ROW: PRODUCTS (LEFT) & COUPONS (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 items-start">
          
          {/* ================= 1. CART ITEMS SECTION (LEFT) ================= */}
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-3xl font-black text-slate-100 flex items-center gap-3">
                Shopping Cart 
                <span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-lg font-black">
                  {cart.length}
                </span>
              </h1>
              <div className="flex justify-end">
                <button 
                  className="group flex items-center gap-2 text-rose-500 font-black bg-red-200 hover:bg-rose-500 hover:text-white px-5 py-2.5 rounded-xl border border-rose-100 transition-all duration-300 text-xs uppercase tracking-widest shadow-sm hover:shadow-rose-500/30 active:scale-95" 
                  onClick={clearCart}
                >
                  <DeleteOutlineIcon fontSize="small" className="group-hover:scale-110 transition-transform" />
                  Clear Cart
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {cart.map((item) => {
                const itemPrice = Number(item.offer_price || item.sale_price || item.price || 0).toFixed(0); 
                const itemImage = item.product_image || item.image || "https://via.placeholder.com/80?text=No+Image";
                
                const handleProductClick = () => {
                  window.scrollTo({ top: 0, behavior: "instant" });
                  const maskedKey = encodeId(item.id); 
                  navigate(`/product/${maskedKey}`); 
                };

                return (
                  <div className="flex flex-wrap md:flex-nowrap items-center bg-white p-4 md:p-5 rounded-[24px] shadow-sm border border-slate-100 transition-all hover:shadow-md" key={item.id}>
                    
                    {/* Image */}
                    <div onClick={handleProductClick} className="w-[80px] h-[80px] bg-slate-50 border border-slate-100 rounded-2xl p-2 mr-4 shrink-0 cursor-pointer">
                      <img src={itemImage} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>

                    {/* Title & Price */}
                    <div onClick={handleProductClick} className="flex-1 min-w-[150px] mr-4 cursor-pointer"> 
                      <h3 className="text-base text-slate-800 font-black line-clamp-2 hover:text-cyan-700 transition-colors">
                        {item.name}
                      </h3>
                      <div className="text-lg font-black text-cyan-700 mt-1">
                        ₹{itemPrice}
                      </div>
                    </div>

                    {/* Qty Controls */}
                    <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl mr-6 mt-4 md:mt-0 w-full md:w-auto justify-center">
                      <button 
                        className="bg-white shadow-sm w-8 h-8 rounded-xl flex justify-center items-center text-slate-600 hover:bg-slate-900 hover:text-white transition-colors"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <RemoveIcon fontSize="small" />
                      </button>
                      <span className="font-black text-slate-800 w-4 text-center">{item.quantity}</span>
                      <button 
                        className="bg-white shadow-sm w-8 h-8 rounded-xl flex justify-center items-center text-slate-600 hover:bg-slate-900 hover:text-white transition-colors"
                        onClick={() => addToCart({ ...item, quantity: 1 })}
                      >
                        <AddIcon fontSize="small" />
                      </button>
                    </div>

                    {/* Total & Delete */}
                    <div className="flex items-center justify-between w-full md:w-auto mt-4 md:mt-0 gap-6">
                      <div className="font-black text-xl text-slate-800 md:text-right min-w-[80px]">
                        ₹{(itemPrice * item.quantity).toFixed(0)}
                      </div>
                      <button 
                        className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-3 rounded-xl transition-all" 
                        onClick={() => clearItemFromCart(item.id)}
                      >
                        <DeleteOutlineIcon />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* COUPON & OFFERS SECTION (RIGHT)  */}
          <section className="bg-white p-6 rounded-[30px] border border-slate-100 shadow-sm sticky top-24">
            <h2 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
              <LocalOfferIcon className="text-cyan-600" /> Apply Offers & Coupons
            </h2>

            {/* Manual Input Box */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-2 mb-6 focus-within:border-cyan-500 transition-colors">
              <input
                type="text"
                placeholder="Enter Coupon Code"
                className="flex-1 bg-transparent border-none outline-none px-4 py-2 font-black text-slate-800 uppercase placeholder-slate-400"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                disabled={appliedCoupon || isLoadingBill}
              />
              {appliedCoupon ? (
                <button 
                  className="bg-rose-500 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 transition-colors" 
                  onClick={handleRemoveCoupon}
                  disabled={isLoadingBill}
                >
                  Remove
                </button>
              ) : (
                <button 
                  className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors disabled:opacity-50" 
                  onClick={handleApplyCoupon}
                  disabled={isLoadingBill || !couponInput.trim()}
                >
                  Apply
                </button>
              )}
            </div>

            {/* Messages */}
            {couponMessage && (
              <div className={`mb-6 p-4 rounded-xl font-bold text-sm ${appliedCouponData ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                {couponMessage}
              </div>
            )}

            {/* Eligible Coupons List */}
            {!appliedCouponData && eligibleCoupons.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Available Coupons for you</p>
                <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin">
                  {eligibleCoupons.map((coupon, idx) => (
                    <div key={idx} className="border border-dashed border-cyan-300 bg-cyan-50/50 p-4 rounded-2xl flex flex-col justify-between">
                      <div className="mb-4">
                        <span className="inline-block bg-white border border-cyan-100 text-cyan-800 font-black uppercase tracking-wider px-3 py-1 rounded-lg text-xs mb-2 shadow-sm">
                          {coupon.code}
                        </span>
                        <h4 className="font-black text-slate-800 text-sm mb-1">{coupon.title}</h4>
                        <p className="text-xs font-bold text-slate-500 line-clamp-2">{coupon.description}</p>
                      </div>
                      <button 
                        onClick={() => handleApplyFromList(coupon.code)}
                        className="w-full bg-cyan-600 text-white font-black text-xs uppercase py-3 rounded-xl hover:bg-cyan-700 transition-colors shadow-md shadow-cyan-600/20"
                      >
                        Tap to Apply
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

        </div>

        {/* ORDER SUMMARY  */}
        <section className="bg-white p-6 md:p-8 rounded-[30px] shadow-lg shadow-slate-200/50 border border-slate-100 w-full mt-4">
          <h2 className="text-2xl font-black text-slate-800 mb-6">Order Summary</h2>

          {/* Tip Section */}
          <div className="mb-8">
            <h4 className="text-sm font-bold text-slate-600 mb-3">Add a tip to support your delivery partner</h4>
            <div className="flex flex-wrap gap-3">
              {[10, 20, 30, 50].map((amt) => (
                <button
                  key={amt}
                  className={`px-6 py-2.5 rounded-xl font-black text-sm border-2 transition-all ${
                    tipAmount === amt 
                      ? "bg-emerald-50 border-emerald-500 text-emerald-600" 
                      : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                  }`}
                  onClick={() => setTipAmount(tipAmount === amt ? 0 : amt)}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Bill Calculation */}
          <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
            {isLoadingBill ? (
              <div className="py-4 text-center text-slate-400 font-bold animate-pulse text-sm">
                Updating exact amount...
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center text-slate-600 font-bold text-base">
                  <span>Item Total</span>
                  <span>₹{displaySubtotal}</span>
                </div>

                <div className="flex justify-between items-center text-slate-600 font-bold text-base">
                  <span>Delivery Charges</span>
                  <span className={displayDelivery === 0 ? "text-emerald-500" : ""}>
                    {displayDelivery === 0 ? "FREE" : `₹${displayDelivery}`}
                  </span>
                </div>

                {tipAmount > 0 && (
                  <div className="flex justify-between items-center text-emerald-600 font-bold text-base">
                    <span>Delivery Partner Tip</span>
                    <span>₹{tipAmount}</span>
                  </div>
                )}

                {/* SHOWING MINUS DISCOUNT DYNAMICALLY */}
                {displayDiscount > 0 && (
                  <div className="flex justify-between items-center text-emerald-600 font-black text-base animate-in fade-in bg-emerald-100/50 p-2 -mx-2 rounded-lg">
                    <span>Discount ({appliedCouponData?.code || appliedCoupon})</span>
                    <span>- ₹{displayDiscount}</span>
                  </div>
                )}
              </>
            )}
            
            <div className="border-t-2 border-dashed border-slate-200 pt-4 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-lg font-black text-slate-800 uppercase tracking-widest">Grand Total</span>
                <span className="text-4xl font-black text-slate-900">₹{grandTotal}</span>
              </div>
            </div>
          </div>

          {/* CHECKOUT BUTTON */}
          <button 
            disabled={isLoadingBill}
            className="w-full mt-8 py-5 px-6 bg-yellow-400 text-white rounded-2xl flex items-center justify-between transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl shadow-yellow-400/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            onClick={() => navigate("/checkout")}
          >
            <span className="font-black text-lg uppercase tracking-widest text-yellow-900">
              {isLoadingBill ? "Wait..." : "Proceed to Checkout"}
            </span>
            <span className="bg-white/20 px-4 py-2 rounded-xl font-black text-xl text-yellow-950 shadow-inner">
              ₹{grandTotal}
            </span>
          </button>
          
          <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest mt-4">
            🔒 256-bit Encrypted Secure Checkout
          </p>
        </section>

      </div>
    </div>
  );
};

export default CartPage;