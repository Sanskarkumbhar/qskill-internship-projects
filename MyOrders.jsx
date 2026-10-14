 
import { useEffect, useState } from "react";
import {
  Package,
  ShoppingBag,
  CalendarDays,
  CreditCard,
  ArrowRight,
  RefreshCw,
  ImageOff,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getMyOrders } from "../services/orderService";

import "./MyOrders.css";

const fallbackImage =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=500&q=80";

function formatPrice(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function normalizeStatus(status) {
  return String(status || "Processing")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-");
}

function getPaymentLabel(method) {
  if (!method) return "Not specified";

  const normalized = String(method).toLowerCase();

  if (normalized === "cod") return "Cash on Delivery";
  if (normalized === "online") return "Online Payment";

  return String(method)
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [failedImages, setFailedImages] = useState({});

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyOrders();

        if (active) {
          setOrders(Array.isArray(data.orders) ? data.orders : []);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Please try again in a moment.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadOrders();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <main className="orders-page orders-state">
        <div className="orders-state-icon">
          <RefreshCw size={28} />
        </div>
        <h2>Loading your orders</h2>
        <p>We're getting your SHOPORA order history ready.</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="orders-page orders-state">
        <div className="orders-state-icon">
          <Package size={30} />
        </div>
        <h2>Unable to load orders</h2>
        <p>{error}</p>
        <Link to="/shop" className="orders-primary-button">
          Continue Shopping <ArrowRight size={17} />
        </Link>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <section className="orders-header">
        <p className="orders-eyebrow">SHOPORA ACCOUNT</p>
        <h1>My Orders</h1>
        <p>Track your purchases and revisit the items you love.</p>

        <div className="orders-count">
          <Package size={16} />
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </div>
      </section>

      {orders.length === 0 ? (
        <section className="empty-orders">
          <div className="orders-state-icon">
            <ShoppingBag size={34} />
          </div>

          <h2>Your shopping journey starts here</h2>
          <p>
            You haven't placed an order yet. Explore our collection
            and your purchases will appear here.
          </p>

          <Link to="/shop" className="orders-primary-button">
            Start Shopping <ArrowRight size={17} />
          </Link>
        </section>
      ) : (
        <section className="orders-list">
          {orders.map((order) => {
            const orderId = order._id || order.id;
            const items = Array.isArray(order.items) ? order.items : [];
            const status = normalizeStatus(order.status);
            const total = order.totalAmount ?? order.total ?? 0;

            return (
              <article className="order-card" key={orderId}>
                <div className="order-card-header">
                  <div className="order-number">
                    <span className="order-label">ORDER NUMBER</span>
                    <strong>
                      #{String(orderId || "N/A").slice(-8).toUpperCase()}
                    </strong>
                  </div>

                  <span className={`order-status status-${status}`}>
                    {String(order.status || "Processing")
                      .replace(/[_-]/g, " ")
                      .replace(/\b\w/g, (letter) => letter.toUpperCase())}
                  </span>
                </div>

                <div className="order-meta">
                  <div className="order-meta-item">
                    <CalendarDays size={17} />
                    <div>
                      <span>Order date</span>
                      <strong>{formatDate(order.createdAt)}</strong>
                    </div>
                  </div>

                  <div className="order-meta-item">
                    <CreditCard size={17} />
                    <div>
                      <span>Payment method</span>
                      <strong>{getPaymentLabel(order.paymentMethod)}</strong>
                    </div>
                  </div>

                  <div className="order-meta-item order-total-meta">
                    <div>
                      <span>Order total</span>
                      <strong>{formatPrice(total)}</strong>
                    </div>
                  </div>
                </div>

                <div className="order-items">
                  <h3>
                    Items in this order <span>({items.length})</span>
                  </h3>

                  {items.length === 0 ? (
                    <p className="order-no-items">
                      Item details are unavailable for this order.
                    </p>
                  ) : (
                    items.map((item, index) => {
                      const product = item.product || item;
                      const itemName =
                        item.name || product.name || "Product";
                      const quantity = Number(item.quantity || 1);
                      const price = Number(
                        item.price ?? product.price ?? 0
                      );
                      const imageKey = `${orderId}-${index}`;
                      const image = failedImages[imageKey]
                        ? fallbackImage
                        : item.image ||
                          product.image ||
                          item.productImage ||
                          fallbackImage;

                      return (
                        <div
                          className="order-product"
                          key={`${orderId}-${item._id || index}`}
                        >
                          <div className="order-product-image">
                            {image ? (
                              <img
                                src={image}
                                alt={itemName}
                                loading="lazy"
                                onError={() =>
                                  setFailedImages((previous) => ({
                                    ...previous,
                                    [imageKey]: true,
                                  }))
                                }
                              />
                            ) : (
                              <ImageOff size={24} />
                            )}
                          </div>

                          <div className="order-product-details">
                            <strong>{itemName}</strong>
                            <span>
                              {formatPrice(price)} × {quantity}
                            </span>
                            {item.category && (
                              <small>{item.category}</small>
                            )}
                          </div>

                          <strong className="order-item-total">
                            {formatPrice(price * quantity)}
                          </strong>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="order-card-footer">
                  <span>
                    {items.reduce(
                      (sum, item) => sum + Number(item.quantity || 1),
                      0
                    )}{" "}
                    total{" "}
                    {items.reduce(
                      (sum, item) => sum + Number(item.quantity || 1),
                      0
                    ) === 1
                      ? "item"
                      : "items"}
                  </span>

                  <strong>Total paid / due: {formatPrice(total)}</strong>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default MyOrders;
