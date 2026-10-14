import { useEffect, useState } from "react";
import { Package, RefreshCw } from "lucide-react";

const API_URL = "http://localhost:5000/api/orders";

const statuses = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load orders"
        );
      }

      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/admin/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update order status"
        );
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: data.order.status,
              }
            : order
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main className="admin-orders-page">

      <section className="admin-products-header">
        <div>
          <p className="section-label">
            SHOPORA ADMIN
          </p>

          <h1>Order Management</h1>

          <p>
            View customer orders and manage order
            status.
          </p>
        </div>

        <button
          className="admin-add-btn"
          onClick={loadOrders}
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </section>

      {error && (
        <div className="admin-message error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="admin-loading">
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="admin-empty">
          <Package size={45} />

          <h3>No orders yet</h3>

          <p>
            Customer orders will appear here.
          </p>
        </div>
      ) : (
        <section className="admin-orders-list">
          {orders.map((order) => (
            <article
              className="admin-order-card"
              key={order._id}
            >
              <div className="admin-order-top">

                <div>
                  <span>ORDER ID</span>

                  <strong>
                    #{order._id
                      .slice(-8)
                      .toUpperCase()}
                  </strong>
                </div>

                <div>
                  <span>ORDER DATE</span>

                  <strong>
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString("en-IN")}
                  </strong>
                </div>

              </div>

              <div className="admin-customer-info">
                <div>
                  <span>Customer</span>

                  <strong>
                    {order.user?.name ||
                      "Unknown User"}
                  </strong>
                </div>

                <div>
                  <span>Email</span>

                  <strong>
                    {order.user?.email ||
                      "Not available"}
                  </strong>
                </div>

                <div>
                  <span>Payment</span>

                  <strong>
                    {order.paymentMethod ===
                    "cod"
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </strong>
                </div>

                <div>
                  <span>Total</span>

                  <strong>
                    ₹
                    {order.totalAmount.toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>
              </div>

              <div className="admin-order-items">
                <h3>Ordered Items</h3>

                {order.items.map(
                  (item, index) => (
                    <div
                      className="admin-order-item"
                      key={`${order._id}-${index}`}
                    >
                      <div>
                        <strong>
                          {item.name}
                        </strong>

                        <span>
                          ₹
                          {item.price.toLocaleString(
                            "en-IN"
                          )}{" "}
                          × {item.quantity}
                        </span>
                      </div>

                      <strong>
                        ₹
                        {(
                          item.price *
                          item.quantity
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </div>
                  )
                )}
              </div>

              <div className="admin-order-bottom">

                <span>Update Status</span>

                <select
                  value={order.status}
                  disabled={
                    updatingId === order._id
                  }
                  onChange={(event) =>
                    updateStatus(
                      order._id,
                      event.target.value
                    )
                  }
                >
                  {statuses.map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  ))}
                </select>

              </div>
            </article>
          ))}
        </section>
      )}

    </main>
  );
}

export default AdminOrders;