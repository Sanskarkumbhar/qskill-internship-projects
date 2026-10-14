 import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-column footer-brand">
          <h2>SHOPORA</h2>

          <p>
            Discover modern fashion and everyday essentials
            designed for your unique style.
          </p>

          <div className="social-icons">
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="Twitter">X</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </div>

        {/* Customer Service */}
        <div className="footer-column">
          <h3>Customer Service</h3>

          <a href="#">FAQs</a>
          <a href="#">Shipping & Delivery</a>
          <a href="#">Returns & Refunds</a>
          <a href="#">Privacy Policy</a>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <h3>Contact Us</h3>

          <p className="contact-item">
            <span>📍</span>
            India
          </p>

          <p className="contact-item">
            <span>📞</span>
            +91 98765 43210
          </p>

          <p className="contact-item">
            <span>✉</span>
            support@shopora.com
          </p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 SHOPORA. All rights reserved.</p>
        <p>Built with React & modern web technologies.</p>
      </div>
    </footer>
  );
}

export default Footer;