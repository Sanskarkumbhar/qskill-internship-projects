 import { ShoppingBag, Heart, User } from "lucide-react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { cartCount } = useCart();

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="logo">
          SHOP<span>ORA</span>
        </Link>

        {/* Navigation Links */}
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/my-orders">My Orders</Link>
        </div>

        {/* Right Side */}
        <div className="nav-actions">

          {/* Wishlist */}
          <Link to="/wishlist" className="nav-icon">
            <Heart size={21} />
          </Link>

          {/* Cart */}
          <Link to="/cart" className="nav-icon cart-icon">
            <ShoppingBag size={21} />

            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Login */}
          <Link to="/login" className="login-btn">
            <User size={18} />
            Login
          </Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;