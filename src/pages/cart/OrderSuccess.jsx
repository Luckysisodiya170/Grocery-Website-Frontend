import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./OrderSuccess.css";

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId || "Unknown";

  return (
    <div className="order-success-page">
      <div className="success-card glass-panel">
        
        {/* CUSTOM ANIMATED SVG TICK */}
        <svg className="animated-check" viewBox="0 0 24 24">
          {/* Background circle */}
          <circle className="check-circle" cx="12" cy="12" r="10" />
          {/* The Tick Mark */}
          <path className="check-path" d="M8 12.5l3 3 5-6" />
        </svg>
        
        <h1 className="success-title">Order Placed Successfully!</h1>
        <p className="success-subtitle">Thank you for shopping with Shipzyy.</p>
        
        <div className="order-details-box">
          <p style={{ margin: "5px 0" }}>Order ID: <strong>#{orderId}</strong></p>
          <p style={{ margin: "5px 0" }}>
            Status: <span className="status-badge">Confirmed</span>
          </p>
        </div>

        <div className="success-actions">
          <Link to="/orders" className="primary-btn">View My Orders</Link>
          <Link to="/shop" className="secondary-btn">Continue Shopping</Link>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;