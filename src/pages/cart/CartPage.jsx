import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../pages/cart/CartContext";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import "./cartPage.css";

const CartPage = () => {
  const {
    cart,
    addToCart,
    removeFromCart,
    clearItemFromCart,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  const subtotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );

  const deliveryFee = subtotal > 999 || subtotal === 0 ? 0 : 60;
  const grandTotal = subtotal + deliveryFee - discount;

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

 if (cart.length === 0) {
  return (
    <div className="empty-cart-wrapper">
      <div className="empty-cart-card">
        <div className="empty-icon-big">🛍️</div>

        <h1>Your Cart is Empty</h1>
        <p>
          Looks like you haven’t added anything yet.
          Start shopping and fill your bag with amazing products.
        </p>

        <Link to="/shop" className="empty-btn">
          Start Shopping
        </Link>

        <div className="empty-suggestions">
          <span>🔥 Trending Products</span>
          <span>🥬 Fresh Groceries</span>
          <span>⚡ Fast Delivery</span>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="cart-container container">
      <div className="cart-grid">

        {/* LEFT SIDE */}
        <div className="cart-items">
          <div className="cart-header">
            <h1 className="cart-title">
              Shopping Cart <span>{cart.length}</span>
            </h1>
            <button className="clear-cart-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>

          {cart.map((item) => (
            <div className="cart-card" key={item.id}>
              <img src={`/product/${item.image}`} alt={item.name} />

              <div className="cart-info">
                <div className="cart-top">
                  <div>
                    <p className="category">{item.category}</p>
                    <h3>{item.name}</h3>
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => clearItemFromCart(item.id)}
                  >
                    <DeleteOutlineIcon />
                  </button>
                </div>

                <div className="cart-bottom">
                  <div className="qty-control">
                    <button onClick={() => removeFromCart(item.id)}>
                      <RemoveIcon fontSize="small" />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => addToCart(item)}>
                      <AddIcon fontSize="small" />
                    </button>
                  </div>

                  <div className="price">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <aside className="cart-summary">
          <h2>Order Summary</h2>

          {/* FREE SHIPPING PROGRESS */}
          <div className="shipping-progress">
            <div
              style={{
                width: `${Math.min((subtotal / 1000) * 100, 100)}%`,
              }}
            />
          </div>
          <p className="shipping-text">
            {subtotal < 1000
              ? `Add ₹${1000 - subtotal} more for FREE delivery 🚚`
              : "You unlocked FREE Delivery 🎉"}
          </p>

          {/* COUPON */}
          <div className="coupon-box">
            <LocalOfferIcon />
            <input
              type="text"
              placeholder="Enter Coupon (SAVE10)"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <button onClick={handleApplyCoupon}>Apply</button>
          </div>

          {couponMessage && (
            <p
              className={`coupon-msg ${
                discount > 0 ? "success" : "error"
              }`}
            >
              {couponMessage}
            </p>
          )}

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
          </div>

          {discount > 0 && (
            <div className="summary-row discount">
              <span>Discount</span>
              <span>- ₹{discount.toFixed(0)}</span>
            </div>
          )}

          <div className="summary-row">
            <span>Estimated Delivery</span>
            <span>3 - 5 Days</span>
          </div>

          <div className="summary-total">
            ₹{grandTotal.toFixed(0)}
          </div>

          <button
            className="checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>

          <div className="trust-badges">
            <span>✔ Secure Payments</span>
            <span>✔ 7-Day Easy Returns</span>
            <span>✔ 100% Fresh Products</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;