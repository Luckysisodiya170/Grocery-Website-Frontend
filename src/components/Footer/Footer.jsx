import React from "react";
import "./Footer.css";
import logo from "../../assets/logosvg.svg";

function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-gradient-border"></div>

      <div className="container">
        <div className="footer-top">
          <div className="brand-area">
            <div className="logo-flex">
              <img src={logo} alt="OrganicStore" className="footer-brand-img" />
              <h2 className="footer-brand-text">Ship<span>zyy</span></h2>
            </div>
            <p className="brand-desc">
              Experience the future of delivery. Fresh groceries, latest tech, and 
              premium essentials delivered in minutes, not hours.
            </p>
            
            <div className="app-buttons">
              <button className="app-btn">
                <span className="icon"></span>
                <div className="text">
                  <small>Download on the</small>
                  <strong>App Store</strong>
                </div>
              </button>
              <button className="app-btn">
                <span className="icon">▶</span>
                <div className="text">
                  <small>Get it on</small>
                  <strong>Google Play</strong>
                </div>
              </button>
            </div>
          </div>

          {/* Links Area (Cleaned up) */}
          <div className="footer-links-grid">
            <div className="link-col">
              <h4>Support</h4>
              <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Return Policy</a></li>
              </ul>
            </div>

            <div className="link-col">
              <h4>Categories</h4>
              <ul>
                <li><a href="#">Fresh Food</a></li>
                <li><a href="#">Electronics</a></li>
                <li><a href="#">Fashion</a></li>
                <li><a href="#">Beauty</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="divider"></div>

        <div className="footer-bottom">
          <p>© 2026 QuickDrop Inc. All rights reserved.</p>
          <div className="payment-icons">
            <span className="pay-card">Visa</span>
            <span className="pay-card">Mastercard</span>
            <span className="pay-card">UPI</span>
            <span className="pay-card">PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;