import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Package,
  ShoppingCart,
  Users,
  IndianRupee,
} from "lucide-react";

function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  });

  useEffect(() => {
    // Temporary dashboard values.
    // We will connect these to admin REST APIs later.
    setStats({
      products: 8,
      orders: 0,
      users: 1,
      revenue: 0,
    });
  }, []);

  return (
    <main className="admin-page">

      <section className="admin-header">
        <div>
          <p className="section-label">SHOPORA ADMIN</p>
          <h1>Admin Dashboard</h1>
          <p>
            Manage your products, orders and store activity.
          </p>
        </div>
      </section>

      <section className="admin-stats">

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <Package size={24} />
          </div>

          <div>
            <span>Total Products</span>
            <strong>{stats.products}</strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <ShoppingCart size={24} />
          </div>

          <div>
            <span>Total Orders</span>
            <strong>{stats.orders}</strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <Users size={24} />
          </div>

          <div>
            <span>Total Users</span>
            <strong>{stats.users}</strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <IndianRupee size={24} />
          </div>

          <div>
            <span>Total Revenue</span>
            <strong>
              ₹{stats.revenue.toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

      </section>

      <section className="admin-actions">

        <div className="admin-action-card">
          <Package size={30} />

          <h2>Product Management</h2>

          <p>
            Add, edit and delete products from your
            SHOPORA store.
          </p>

           <Link to="/admin/products" className="admin-dashboard-link">
           Manage Products
           </Link>
        </div>

        <div className="admin-action-card">
          <ShoppingCart size={30} />

          <h2>Order Management</h2>

          <p>
            View customer orders and update their
            order status.
          </p>

          <Link to="/admin/orders" className="admin-dashboard-link">
          Manage Orders
         </Link>
        </div>

      </section>

    </main>
  );
}

export default AdminDashboard;