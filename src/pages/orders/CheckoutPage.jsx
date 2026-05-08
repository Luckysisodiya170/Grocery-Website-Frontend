import React, { useState, useEffect } from "react";
import { useCart } from "../../pages/cart/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCheckoutDetails, placeOrder } from "../../utils/checkoutApi";
import { getProfileDetails } from "../../utils/profileApi";
import { addAddress } from "../../utils/addressApi";

const CheckoutPage = () => {
  const { cart, subtotal, shippingCharge, grandTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("COD"); 

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showCouponField, setShowCouponField] = useState(false);
  const [billDetails, setBillDetails] = useState(null);
  const [isLoadingBill, setIsLoadingBill] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const fetchAddresses = async () => {
    try {
      setIsLoadingAddresses(true);
      const res = await getProfileDetails();
      if (res && res.success && res.data.addresses) {
        const fetchedAddresses = res.data.addresses;
        setAddresses(fetchedAddresses);
        
        const defaultAddr = fetchedAddresses.find(a => a.is_default) || fetchedAddresses[0];
        if (defaultAddr) setSelectedAddress(defaultAddr.id);
      }
    } catch (error) {
      toast.error("Failed to load addresses");
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (!cart.length || !selectedAddress) return;

    const fetchBill = async () => {
      setIsLoadingBill(true);
      try {
        const res = await getCheckoutDetails(selectedAddress, appliedCoupon);
        if (res && res.success) {
          setBillDetails(res.data);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to calculate bill.");
        setAppliedCoupon(null); 
      } finally {
        setIsLoadingBill(false);
      }
    };

    fetchBill();
  }, [selectedAddress, appliedCoupon, cart.length]);

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return toast.warning("Enter a valid coupon!");
    setAppliedCoupon(couponInput.trim());
    setShowCouponField(false);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const form = e.target;
    
    const newAddressData = {
      address_name: form.address_name.value,
      contact_person_name: form.contact_person_name.value,
      contact_phone: form.contact_phone.value,
      address_line_1: form.address_line_1.value,
      address_line_2: form.address_line_2.value || "",
      landmark: form.landmark.value || "",
      city: form.city.value,
      state: form.state.value,
      pincode: form.pincode.value,
      is_default: false,
      country: "India"
    };

    try {
      setIsAddingAddress(true);
      const res = await addAddress(newAddressData);
      if (res.success) {
        toast.success("Address Added Successfully");
        setShowNewAddress(false);
        form.reset();
        await fetchAddresses();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add address");
    } finally {
      setIsAddingAddress(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!cart.length) return toast.error("Cart is empty");
    if (!selectedAddress) return toast.error("Select a delivery address");
    if (!paymentMethod) return toast.error("Select a payment method");

    try {
      setIsPlacingOrder(true);
      const orderData = {
        address_id: selectedAddress,
        payment_method: paymentMethod.toUpperCase(), 
        coupon_code: appliedCoupon 
      };

      const res = await placeOrder(orderData);
      
      if (res && res.success) {
        clearCart();        
        toast.success("Order Placed Successfully 🎉");
        navigate("/orders"); 
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to place order.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 md:px-6">
      <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row gap-8">
        
        <main className="flex-[1.5] space-y-6">
          <header className="mb-6">
            <h1 className="text-3xl font-black text-slate-100 tracking-tight">Secure Checkout</h1>
            <p className="text-slate-100 font-bold mt-1 uppercase tracking-widest text-xs">Complete your order in 2 simple steps</p>
          </header>

          <div className="space-y-6">
            <div className={`bg-white rounded-[30px] border transition-all duration-300 shadow-sm overflow-hidden ${step === 1 ? "border-cyan-500 ring-4 ring-cyan-500/10" : "border-slate-200"}`}>
              <div 
                className="p-6 md:p-8 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => step > 1 && setStep(1)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shadow-sm ${step > 1 ? "bg-emerald-500 text-white" : "bg-cyan-900 text-white"}`}>
                    {step > 1 ? "✓" : "1"}
                  </div>
                  <h2 className="text-xl font-black text-slate-800">Delivery Address</h2>
                </div>
                {step > 1 && <span className="text-cyan-600 font-bold text-sm uppercase tracking-widest hover:underline">Edit</span>}
              </div>

              {step === 1 && (
                <div className="p-6 md:p-8 pt-0 animate-in fade-in slide-in-from-top-4 duration-500">
                  {isLoadingAddresses ? (
                    <div className="py-10 text-center text-slate-400 font-bold animate-pulse">Loading addresses...</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((loc) => (
                        <div
                          key={loc.id}
                          onClick={() => setSelectedAddress(loc.id)}
                          className={`p-5 border-2 rounded-2xl cursor-pointer transition-all relative ${selectedAddress === loc.id ? "border-cyan-600 bg-cyan-50 shadow-md" : "border-slate-100 hover:border-cyan-300 hover:bg-slate-50"}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-black text-slate-800 flex items-center gap-2">
                              {loc.address_name} {loc.is_default && <span className="text-[9px] bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full">Default</span>}
                              {selectedAddress === loc.id && <span className="w-2.5 h-2.5 bg-cyan-600 rounded-full inline-block"></span>}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-400 font-bold mb-1">{loc.contact_person_name} • {loc.contact_phone}</p>
                          <p className="text-sm text-slate-600 font-medium leading-relaxed line-clamp-2">
                            {loc.address_line_1}, {loc.address_line_2 && loc.address_line_2 + ","} {loc.city}, {loc.state}
                          </p>
                          <span className="inline-block mt-3 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600">{loc.pincode}</span>
                        </div>
                      ))}

                      <div
                        className="p-5 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-cyan-500 hover:bg-cyan-50 transition-all flex flex-col items-center justify-center text-slate-500 hover:text-cyan-700 min-h-[140px]"
                        onClick={() => setShowNewAddress(!showNewAddress)}
                      >
                        <span className="text-2xl font-light mb-1">{showNewAddress ? "-" : "+"}</span>
                        <span className="font-bold text-sm uppercase tracking-widest">{showNewAddress ? "Cancel" : "Add New Address"}</span>
                      </div>
                    </div>
                  )}

                  {showNewAddress && (
                    <form className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 animate-in fade-in slide-in-from-top-2" onSubmit={handleAddAddress}>
                      <h3 className="font-black mb-4 text-slate-800">Add New Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Label (Home/Office)</label>
                          <input name="address_name" placeholder="e.g. Home" required className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500 font-medium" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Full Name</label>
                          <input name="contact_person_name" placeholder="Receiver's Name" required className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500 font-medium" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Phone Number</label>
                          <input name="contact_phone" placeholder="10-digit mobile" required maxLength="10" className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500 font-medium" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Pincode</label>
                          <input name="pincode" placeholder="ZIP Code" required maxLength="6" className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500 font-medium" />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Address Line 1</label>
                        <input name="address_line_1" placeholder="House No, Building Name" required className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500 font-medium" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <input name="address_line_2" placeholder="Area / Street (Opt)" className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500 font-medium" />
                        <input name="landmark" placeholder="Landmark (Opt)" className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500 font-medium" />
                        <div className="flex gap-2">
                          <input name="city" placeholder="City" required className="w-1/2 p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500 font-medium" />
                          <input name="state" placeholder="State" required className="w-1/2 p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500 font-medium" />
                        </div>
                      </div>

                      <button type="submit" disabled={isAddingAddress} className="w-full mt-6 py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-md disabled:opacity-50">
                        {isAddingAddress ? "Saving..." : "Save Address"}
                      </button>
                    </form>
                  )}

                  <button
                    disabled={!selectedAddress || isLoadingAddresses}
                    onClick={() => setStep(2)}
                    className="w-full mt-8 py-5 bg-cyan-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-cyan-950 transition-all shadow-xl shadow-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Payment →
                  </button>
                </div>
              )}
            </div>

            <div className={`bg-white rounded-[30px] border transition-all duration-300 shadow-sm overflow-hidden ${step === 2 ? "border-cyan-500 ring-4 ring-cyan-500/10" : "border-slate-200 opacity-60"}`}>
              <div className="p-6 md:p-8 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shadow-sm ${step === 2 ? "bg-cyan-900 text-white" : "bg-slate-200 text-slate-400"}`}>
                  2
                </div>
                <h2 className={`text-xl font-black ${step === 2 ? "text-slate-800" : "text-slate-400"}`}>Payment Method</h2>
              </div>

              {step === 2 && (
                <div className="p-6 md:p-8 pt-0 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div
                      className={`p-4 border-2 rounded-2xl flex flex-col items-center gap-2 cursor-pointer transition-all ${paymentMethod === "CARD" ? "border-cyan-600 bg-cyan-50 text-cyan-800" : "border-slate-100 hover:border-cyan-300 text-slate-500"}`}
                      onClick={() => setPaymentMethod("CARD")}
                    >
                      <span className="text-2xl">💳</span>
                      <span className="font-bold text-xs uppercase tracking-widest">Card</span>
                    </div>
                    <div
                      className={`p-4 border-2 rounded-2xl flex flex-col items-center gap-2 cursor-pointer transition-all ${paymentMethod === "UPI" ? "border-cyan-600 bg-cyan-50 text-cyan-800" : "border-slate-100 hover:border-cyan-300 text-slate-500"}`}
                      onClick={() => setPaymentMethod("UPI")}
                    >
                      <span className="text-2xl">📱</span>
                      <span className="font-bold text-xs uppercase tracking-widest">UPI</span>
                    </div>
                    <div
                      className={`p-4 border-2 rounded-2xl flex flex-col items-center gap-2 cursor-pointer transition-all ${paymentMethod === "COD" ? "border-cyan-600 bg-cyan-50 text-cyan-800" : "border-slate-100 hover:border-cyan-300 text-slate-500"}`}
                      onClick={() => setPaymentMethod("COD")}
                    >
                      <span className="text-2xl">💵</span>
                      <span className="font-bold text-xs uppercase tracking-widest text-center">Cash On Delivery</span>
                    </div>
                  </div>

                  {paymentMethod === "CARD" && (
                    <div className="space-y-4 animate-in fade-in">
                      <input placeholder="Card Number" className="w-full p-4 rounded-xl border border-slate-200 focus:border-cyan-500 outline-none font-bold" />
                      <div className="flex gap-4">
                        <input placeholder="MM/YY" className="w-1/2 p-4 rounded-xl border border-slate-200 focus:border-cyan-500 outline-none font-bold" />
                        <input type="password" placeholder="CVV" className="w-1/2 p-4 rounded-xl border border-slate-200 focus:border-cyan-500 outline-none font-bold" />
                      </div>
                    </div>
                  )}

                  {paymentMethod === "UPI" && (
                    <div className="animate-in fade-in">
                      <input placeholder="Enter UPI ID (eg. name@bank)" className="w-full p-4 rounded-xl border border-slate-200 focus:border-cyan-500 outline-none font-bold" />
                    </div>
                  )}

                  {paymentMethod === "COD" && (
                    <div className="p-5 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 font-medium animate-in fade-in">
                      <strong className="font-black">Pay on Delivery!</strong> You can pay via Cash or UPI when the package arrives at your doorstep.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>

        <aside className="flex-1">
          <div className="bg-white rounded-[24px] overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/40 sticky top-24">
            
            <div className="bg-slate-900 p-6 md:p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
              <h2 className="text-2xl font-black relative z-10">Final Invoice</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1 relative z-10">Review your order details</p>
            </div>

            <div className="p-6 md:p-8">
              <div className="space-y-4 mb-6 max-h-[250px] overflow-y-auto pr-2 scrollbar-thin">
               {cart.map((item) => {
  const itemPrice = Number(item.offer_price || item.sale_price || item.price || item.mrp || 0);
  const itemQty = Number(item.quantity || 1);
  const itemTotal = (itemPrice * itemQty).toFixed(0);

  return (
    <div key={item.id} className="flex justify-between items-start pb-4 border-b border-dashed border-slate-200 last:border-0 last:pb-0">
      <div className="flex gap-3">
        <span className="text-slate-400 text-sm font-black">{itemQty}x</span>
        <span className="text-sm font-bold text-slate-700 leading-tight">{item.name}</span>
      </div>
      <span className="font-black text-slate-900 ml-4">₹{itemTotal}</span>
    </div>
  );
})}
              </div>

              <div className="mb-6 pt-4 border-t border-slate-100">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500">🎉</span>
                      <span className="text-emerald-700 font-black text-sm uppercase">{appliedCoupon} Applied</span>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-rose-500 font-bold text-xs uppercase hover:underline">Remove</button>
                  </div>
                ) : (
                  <>
                    {!showCouponField ? (
                      <button 
                        onClick={() => setShowCouponField(true)}
                        className="text-cyan-600 font-bold text-sm hover:underline flex items-center gap-1"
                      >
                        + Have a promo code?
                      </button>
                    ) : (
                      <div className="flex gap-2 animate-in fade-in">
                        <input 
                          type="text" 
                          placeholder="Enter Code" 
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none font-bold uppercase text-sm"
                        />
                        <button onClick={handleApplyCoupon} className="bg-slate-900 text-white font-bold px-5 rounded-xl text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors">
                          Apply
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="space-y-3 mb-6">
                {isLoadingBill ? (
                  <div className="py-6 text-center text-slate-400 font-bold animate-pulse text-sm">Calculating final amounts...</div>
                ) : (
                  <>
                    <div className="flex justify-between text-sm font-bold text-slate-500">
                      <span>Subtotal</span>
                      <span className="text-slate-800">₹{billDetails?.subtotal || subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-slate-500">
                      <span>Delivery Charge</span>
                      <span className={billDetails?.delivery_charge === 0 || shippingCharge === 0 ? "text-emerald-500" : "text-slate-800"}>
                        {billDetails?.delivery_charge === 0 || shippingCharge === 0 ? "FREE" : `₹${billDetails?.delivery_charge || shippingCharge}`}
                      </span>
                    </div>
                    
                    {billDetails?.discount > 0 && (
                      <div className="flex justify-between text-sm font-bold text-emerald-500">
                        <span>Discount</span>
                        <span>- ₹{billDetails.discount}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-black text-slate-800 uppercase tracking-widest text-sm">Amount to Pay</span>
                  <span className="text-3xl font-black text-cyan-700">₹{billDetails?.total || grandTotal}</span>
                </div>
              </div>

              <button
                disabled={!cart.length || isPlacingOrder || isLoadingBill}
                onClick={handlePlaceOrder}
                className="w-full py-5 bg-cyan-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isPlacingOrder ? "Processing..." : "Place Order Securely"} <span className="text-lg">🔒</span>
              </button>

            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default CheckoutPage;