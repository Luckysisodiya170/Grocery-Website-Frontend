import React, { useState } from "react";
import { useCart } from "../../pages/cart/CartContext";
import { useNavigate } from "react-router-dom";
import userData from "../../data/mockData.json";
import { toast } from "react-toastify";
import { useOrders } from "./OrdersContext";
import "./checkoutPage.css";

const CheckoutPage = () => {
  const { cart, subtotal, shippingCharge, grandTotal, clearCart } = useCart();
  const { addOrder } = useOrders();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [selectedAddress, setSelectedAddress] =
    useState(userData.locations[0]?.id);

  const [addresses, setAddresses] = useState(userData.locations);
  const [showNewAddress, setShowNewAddress] = useState(false);

  // ==========================
  // Add Address
  // ==========================
  const handleAddAddress = (e) => {
    e.preventDefault();
    const form = e.target;

    const newAddress = {
      id: Date.now(),
      label: form.label.value,
      address: form.address.value,
      zip: form.zip.value,
    };

    setAddresses([...addresses, newAddress]);
    setSelectedAddress(newAddress.id);
    setShowNewAddress(false);
    form.reset();

    toast.success("Address Added Successfully");
  };

// ==========================
  // Place Order (Instant Redirect & Top-Center Toast)
  // ==========================
  const handlePlaceOrder = () => {
    if (!cart.length) {
      // Error toast also in top-center
      toast.error("Cart is empty", { position: "top-center" }); 
      return;
    }

    const newOrder = {
      id: `ORD${Math.floor(Math.random() * 100000)}`, 
      items: cart,
      total: grandTotal,
      paymentMethod,
      status: "Placed",
      createdAt: new Date().toISOString(),
    };

    addOrder(newOrder); // Saves to your OrdersContext
    clearCart();        // Clears the cart

    // ✅ TOP-CENTER TOAST
    toast.success("Order Placed Successfully 🎉", {
      position: "top-center",
      autoClose: 2000, // Automatically close after 2 seconds
      hideProgressBar: false,
      closeOnClick: true,
    });

    // ✅ INSTANT REDIRECT (setTimeout hata diya hai)
    navigate("/order-success", { state: { orderId: newOrder.id } }); 
  };
  return (
    <div className="checkout-page-root">
      <div className="checkout-max-width">

        {/* ================= LEFT SIDE ================= */}
        <main>

          {/* Step Indicator */}
          <header className="checkout-nav-header">
            <div className={`step-pill ${step === 1 ? "active" : "completed"}`}>
              01 Shipping
            </div>
            <div className="step-line"></div>
            <div className={`step-pill ${step === 2 ? "active" : ""}`}>
              02 Payment
            </div>
          </header>

          <section className="form-surface glass-panel">

            {/* ================= STEP 1 ================= */}
            {step === 1 && (
              <>
                <h1 className="step-title">
                  Select <span className="light">Delivery Address</span>
                </h1>

                <div className="address-grid">
                  {addresses.map((loc) => (
                    <div
                      key={loc.id}
                      className={`address-card ${selectedAddress === loc.id ? "selected" : ""
                        }`}
                      onClick={() => setSelectedAddress(loc.id)}
                    >
                      <h4>{loc.label}</h4>
                      <p>{loc.address}</p>
                      <span>{loc.zip}</span>
                    </div>
                  ))}

                  <div
                    className="address-card add-new"
                    onClick={() => setShowNewAddress(true)}
                  >
                    + Add New Address
                  </div>
                </div>

                {showNewAddress && (
                  <form className="new-address-form" onSubmit={handleAddAddress}>
                    <input name="label" placeholder="Label (Home/Office)" required />
                    <input name="address" placeholder="Full Address" required />
                    <input name="zip" placeholder="Zip Code" required />
                    <button type="submit" className="primary-action-btn">
                      Save Address
                    </button>
                  </form>
                )}

                <button
                  className="primary-action-btn"
                  disabled={!selectedAddress}
                  onClick={() => setStep(2)}
                >
                  Continue to Payment
                </button>
              </>
            )}

            {/* ================= STEP 2 ================= */}
            {step === 2 && (
              <>
                <h1 className="step-title dark">
                  Select <span className="light">Payment Method</span>
                </h1>

                {/* Payment Options */}
                <div className="payment-methods">
                  <div
                    className={`payment-option ${paymentMethod === "card" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    💳 Credit / Debit Card
                  </div>

                  <div
                    className={`payment-option ${paymentMethod === "upi" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("upi")}
                  >
                    📱 UPI Payment
                  </div>

                  <div
                    className={`payment-option ${paymentMethod === "cod" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("cod")}
                  >
                    💵 Cash on Delivery
                  </div>
                </div>

                {/* Card Form */}
                {paymentMethod === "card" && (
                  <div className="payment-form">
                    <div className="input-grid">
                      <div className="full-width">
                        <input placeholder="Card Number" />
                      </div>
                      <input placeholder="MM/YY" />
                      <input placeholder="CVC" />
                    </div>
                  </div>
                )}

                {/* UPI */}
                {paymentMethod === "upi" && (
                  <div className="payment-form">
                    <input
                      className="upi-input"
                      placeholder="Enter UPI ID (example@upi)"
                    />
                  </div>
                )}

                {/* COD */}
                {paymentMethod === "cod" && (
                  <div className="cod-box">
                    Pay in cash when your order is delivered.
                  </div>
                )}

                {/* Payment Summary */}
                <div className="payment-summary">
                  <div className="summary-line">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>

                  <div className="summary-line">
                    <span>Shipping</span>
                    <span>
                      {shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}
                    </span>
                  </div>

                  <div className="summary-line total">
                    <span>Grand Total</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>

                <button
                  className="primary-action-btn"
                  disabled={!cart.length}
                  onClick={handlePlaceOrder}
                >
                  Pay ₹{grandTotal}
                </button>

                <button
                  className="back-link-btn dark"
                  onClick={() => setStep(1)}
                >
                  Edit Address
                </button>
              </>
            )}

          </section>
        </main>

        {/* ================= RIGHT SIDE ================= */}
        <aside className="checkout-sidebar">
          <div className="invoice-container">
            <h2 className="invoice-title">Order Summary</h2>

            {cart.map((item) => (
              <div key={item.id} className="invoice-row">
                <span className="qty">{item.quantity}x</span>
                <span className="name">{item.name}</span>
                <span className="price">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}

            <div className="invoice-footer">
              <div className="summary-line">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="summary-line">
                <span>Shipping</span>
                <span>
                  {shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}
                </span>
              </div>

              <div className="summary-line total">
                <span>Grand Total</span>
                <span>₹{grandTotal}</span>
              </div>

              <p className="secure-badge">
                🔒 Fully Encrypted Checkout
              </p>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default CheckoutPage;