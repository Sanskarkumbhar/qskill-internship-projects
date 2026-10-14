 import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, CreditCard, ShoppingBag } from "lucide-react";

import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orderService";

import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartSubtotal,
    clearCart,
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const delivery = cartSubtotal >= 999 ? 0 : 99;

  const totalAmount = cartSubtotal + delivery;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setShippingAddress((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // Check cart
    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    // Check login
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login before placing an order.");
      return;
    }

    // Validate shipping address
    const {
      name,
      address,
      city,
      state,
      pincode,
      phone,
    } = shippingAddress;

    if (
      !name ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !phone
    ) {
      setError("Please fill in all shipping details.");
      return;
    }

    try {
      setLoading(true);

      // Prepare cart items for backend
      const orderItems = cartItems.map((item) => ({
        product: item.id || item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      // Send order to REST API
      const data = await createOrder({
        items: orderItems,
        totalAmount,
        paymentMethod,
        shippingAddress,
      });

      console.log("Order created:", data);

      // Clear cart after successful order
      clearCart();

      alert("Order placed successfully!");

      navigate("/");
    } catch (error) {
      console.error("Order error:", error);

      setError(
        error.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">
        <div className="empty-page">
          <ShoppingBag size={42} />

          <h2>Your cart is empty</h2>

          <p>
            Add some products before proceeding to checkout.
          </p>

          <Link to="/shop" className="checkout-back-button">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">

      {/* HEADER */}

      <div className="checkout-header">

        <Link to="/cart" className="checkout-back">
          <ArrowLeft size={18} />
          Back to Cart
        </Link>

        <div>
          <p className="section-label">
            SHOPORA CHECKOUT
          </p>

          <h1>Complete Your Order</h1>

          <p>
            Enter your delivery details and select your
            payment method.
          </p>
        </div>

      </div>

      <div className="checkout-container">

        {/* LEFT SIDE */}

        <div className="checkout-form">

          <section className="checkout-section">

            <div className="checkout-section-title">
              <h2>Shipping Information</h2>
            </div>

            {error && (
              <div className="checkout-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="checkout-grid">

                <div className="checkout-field full">
                  <label htmlFor="name">
                    Full Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={shippingAddress.name}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="checkout-field full">
                  <label htmlFor="address">
                    Address
                  </label>

                  <input
                    id="address"
                    type="text"
                    name="address"
                    placeholder="House / Street / Area"
                    value={shippingAddress.address}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="city">
                    City
                  </label>

                  <input
                    id="city"
                    type="text"
                    name="city"
                    placeholder="City"
                    value={shippingAddress.city}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="state">
                    State
                  </label>

                  <input
                    id="state"
                    type="text"
                    name="state"
                    placeholder="State"
                    value={shippingAddress.state}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="pincode">
                    Pincode
                  </label>

                  <input
                    id="pincode"
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={shippingAddress.pincode}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="phone">
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="Phone number"
                    value={shippingAddress.phone}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

              </div>

              {/* PAYMENT */}

              <div className="payment-section">

                <h2>Payment Method</h2>

                <label className="payment-option">

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(event) =>
                      setPaymentMethod(event.target.value)
                    }
                    disabled={loading}
                  />

                  <div>
                    <strong>
                      Cash on Delivery
                    </strong>

                    <span>
                      Pay when your order arrives.
                    </span>
                  </div>

                </label>

                <label className="payment-option">

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(event) =>
                      setPaymentMethod(event.target.value)
                    }
                    disabled={loading}
                  />

                  <div>
                    <strong>
                      Online Payment
                    </strong>

                    <span>
                      Payment gateway integration can be
                      added later.
                    </span>
                  </div>

                </label>

              </div>

              <button
                type="submit"
                className="place-order-button"
                disabled={loading}
              >
                <Lock size={18} />

                {loading
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

            </form>

          </section>

        </div>

        {/* RIGHT SIDE */}

        <aside className="checkout-summary">

          <h2>Order Summary</h2>

          <div className="checkout-items">

            {cartItems.map((item) => (
              <div
                className="checkout-item"
                key={item.id || item._id}
              >

                <div>
                  <h3>{item.name}</h3>

                  <p>
                    ₹{item.price.toLocaleString("en-IN")}
                    {" × "}
                    {item.quantity}
                  </p>
                </div>

                <strong>
                  ₹
                  {(
                    item.price * item.quantity
                  ).toLocaleString("en-IN")}
                </strong>

              </div>
            ))}

          </div>

          <div className="summary-divider"></div>

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
              ₹{totalAmount.toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="secure-checkout">
            <Lock size={17} />

            <span>
              Secure checkout powered by SHOPORA
            </span>
          </div>

        </aside>

      </div>
    </main>
  );
}

export default Checkout;