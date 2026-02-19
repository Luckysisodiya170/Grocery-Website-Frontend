import React from "react";
import "./Footer.css";
import logo from "../../assets/logosvg.svg";

function Footer() {
  return (
    <footer className="footer-section">
      {/* Decorative Top Border */}
      <div className="footer-gradient-border"></div>

      <div className="container">
        
        {/* TOP: Newsletter & Brand */}
        <div className="footer-top">
          <div className="brand-area">
            <div className="logo-flex">
              <img src={logo} alt="OrganicStore" className="footer-brand-img" />
              <h2 className="footer-brand-text">Quick<span>Drop</span></h2>
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

          <div className="newsletter-area glass-panel">
            <h3>Subscribe & Save</h3>
            <p>Join our newsletter and get <strong>10% OFF</strong> your first order.</p>
            <div className="input-group">
              <input type="email" placeholder="Enter your email..." />
              <button className="subscribe-btn">Subscribe</button>
            </div>
          </div>
        </div>

        <div className="divider"></div>

        {/* MIDDLE: Links */}
        <div className="footer-links-grid">
          <div className="link-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Press</a></li>
            </ul>
          </div>

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

          <div className="link-col contact-col">
            <h4>Contact Us</h4>
            <p className="contact-item">📍 123 Innovation Dr, Indore, India</p>
            <p className="contact-item">📞 +91 987 654 3210</p>
            <p className="contact-item">✉️ support@quickdrop.com</p>
            
            <div className="social-row">
              <a href="#" className="social-icon">Instagram</a>
              <a href="#" className="social-icon">Twitter</a>
              <a href="#" className="social-icon">LinkedIn</a>
            </div>
          </div>
        </div>

        <div className="divider"></div>

        {/* BOTTOM: Copyright & Payments */}
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