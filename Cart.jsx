 import { Link } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import "./Cart.css";

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    cartSubtotal,
  } = useCart();

  // Delivery charges
  const delivery =
    cartSubtotal === 0
      ? 0
      : cartSubtotal >= 999
      ? 0
      : 99;

  const total = cartSubtotal + delivery;

  // Empty Cart
  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <section className="cart-header">
          <p>YOUR SHOPPING BAG</p>
          <h1>Your Cart</h1>
          <span>Your selected products will appear here.</span>
        </section>

        <div className="empty-cart">
          <div className="empty-cart-icon">
            <ShoppingBag size={42} />
          </div>

          <h2>Your cart is empty</h2>

          <p>
            Looks like you haven't added anything to your cart yet.
          </p>

          <Link to="/shop" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">

      {/* Header */}
      <section className="cart-header">
        <p>YOUR SHOPPING BAG</p>

        <h1>Your Cart</h1>

        <span>
          {cartItems.length}{" "}
          {cartItems.length === 1 ? "item" : "items"} in your cart
        </span>
      </section>

      {/* Cart Content */}
      <div className="cart-container">

        {/* Cart Items */}
        <section className="cart-items-section">

          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>

              {/* Product Image */}
              <div className="cart-item-image">
                <span>SHOPORA</span>
              </div>

              {/* Product Information */}
              <div className="cart-item-details">

                <p className="cart-item-category">
                  {item.category}
                </p>

                <h3>{item.name}</h3>

                <strong className="cart-item-price">
                  ₹{item.price.toLocaleString("en-IN")}
                </strong>

                {/* Quantity + Remove */}
                <div className="cart-item-actions">

                  <div className="quantity-control">

                    <button
                      type="button"
                      onClick={() =>
                        decreaseQuantity(item.id)
                      }
                      aria-label="Decrease quantity"
                    >
                      <Minus size={15} />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() =>
                        increaseQuantity(item.id)
                      }
                      aria-label="Increase quantity"
                    >
                      <Plus size={15} />
                    </button>

                  </div>

                  <button
                    type="button"
                    className="remove-button"
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>

                </div>
              </div>

              {/* Item Total */}
              <div className="cart-item-total">
                ₹
                {(
                  item.price * item.quantity
                ).toLocaleString("en-IN")}
              </div>

            </div>
          ))}

        </section>

        {/* Order Summary */}
        <aside className="cart-summary">

          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>

            <strong>
              ₹{cartSubtotal.toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="summary-row">
            <span>Delivery</span>

            <strong>
              {delivery === 0
                ? "FREE"
                : `₹${delivery}`}
            </strong>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-total">
            <span>Total</span>

            <strong>
              ₹{total.toLocaleString("en-IN")}
            </strong>
          </div>

          {/* Checkout */}
          <Link
            to="/checkout"
            className="checkout-button"
          >
            Proceed to Checkout
          </Link>

          {/* Continue Shopping */}
          <Link
            to="/shop"
            className="continue-shopping-link"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>

          <p className="cart-secure-note">
            Secure checkout • Easy returns • Reliable delivery
          </p>

        </aside>

      </div>
    </div>
  );
}

export default Cart;