import { useEffect, useState } from "react";
import { Edit, Plus, Trash2, X } from "lucide-react";

const API_URL = "http://localhost:5000/api/products";

const emptyForm = {
  name: "",
  category: "",
  price: "",
  rating: "",
  badge: "",
  description: "",
  image: "",
  stock: "",
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =============================
  // Get Products
  // =============================

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load products"
        );
      }

      setProducts(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // =============================
  // Form Change
  // =============================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =============================
  // Open Add Form
  // =============================

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  // =============================
  // Open Edit Form
  // =============================

  const openEditForm = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      category: product.category || "",
      price: product.price || "",
      rating: product.rating || "",
      badge: product.badge || "",
      description: product.description || "",
      image: product.image || "",
      stock: product.stock || "",
    });

    setShowForm(true);
    setError("");
    setSuccess("");
  };

  // =============================
  // Close Form
  // =============================

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  // =============================
  // Save Product
  // =============================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Please login as an admin."
        );
      }

      const productData = {
        name: form.name.trim(),
        category: form.category.trim(),
        price: Number(form.price),
        rating: Number(form.rating) || 0,
        badge: form.badge.trim(),
        description: form.description.trim(),
        image: form.image.trim(),
        stock: Number(form.stock),
      };

      if (
        !productData.name ||
        !productData.category ||
        !productData.price ||
        productData.stock < 0
      ) {
        throw new Error(
          "Please fill all required product fields correctly."
        );
      }

      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save product"
        );
      }

      setSuccess(
        editingId
          ? "Product updated successfully!"
          : "Product added successfully!"
      );

      closeForm();

      await loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // =============================
  // Delete Product
  // =============================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Please login as an admin."
        );
      }

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete product"
        );
      }

      setSuccess(
        "Product deleted successfully!"
      );

      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="admin-products-page">

      {/* Header */}

      <section className="admin-products-header">

        <div>
          <p className="section-label">
            SHOPORA ADMIN
          </p>

          <h1>Product Management</h1>

          <p>
            Add, edit and manage your store products.
          </p>
        </div>

        <button
          className="admin-add-btn"
          onClick={openAddForm}
        >
          <Plus size={18} />
          Add Product
        </button>

      </section>

      {/* Messages */}

      {error && (
        <div className="admin-message error">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-message success">
          {success}
        </div>
      )}

      {/* Product Form */}

      {showForm && (
        <section className="admin-product-form">

          <div className="admin-form-header">

            <h2>
              {editingId
                ? "Edit Product"
                : "Add New Product"}
            </h2>

            <button
              type="button"
              className="close-form-btn"
              onClick={closeForm}
            >
              <X size={20} />
            </button>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="admin-form-grid">

              <div className="admin-form-group">
                <label>Product Name *</label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Classic Cotton T-Shirt"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Category *</label>

                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Men"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Price *</label>

                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="999"
                  min="1"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Stock *</label>

                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="20"
                  min="0"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Rating</label>

                <input
                  type="number"
                  name="rating"
                  value={form.rating}
                  onChange={handleChange}
                  placeholder="4.5"
                  min="0"
                  max="5"
                  step="0.1"
                />
              </div>

              <div className="admin-form-group">
                <label>Badge</label>

                <input
                  name="badge"
                  value={form.badge}
                  onChange={handleChange}
                  placeholder="NEW"
                />
              </div>

              <div className="admin-form-group full-width">
                <label>Image URL</label>

                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/product.jpg"
                />
              </div>

              <div className="admin-form-group full-width">
                <label>Description</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Product description..."
                  rows="4"
                />
              </div>

            </div>

            <div className="admin-form-actions">

              <button
                type="button"
                className="admin-cancel-btn"
                onClick={closeForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="admin-save-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Product"
                  : "Add Product"}
              </button>

            </div>

          </form>

        </section>
      )}

      {/* Products */}

      <section className="admin-products-section">

        <div className="admin-products-title">
          <h2>All Products</h2>

          <span>
            {products.length} Products
          </span>
        </div>

        {loading ? (
          <div className="admin-loading">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="admin-empty">
            <h3>No products found</h3>

            <p>
              Add your first product to SHOPORA.
            </p>
          </div>
        ) : (
          <div className="admin-product-table-wrapper">

            <table className="admin-product-table">

              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {products.map((product) => (
                  <tr key={product._id}>

                    <td>
                      <div className="admin-product-name">

                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                          />
                        ) : (
                          <div className="admin-product-placeholder">
                            SHOPORA
                          </div>
                        )}

                        <strong>
                          {product.name}
                        </strong>

                      </div>
                    </td>

                    <td>
                      {product.category}
                    </td>

                    <td>
                      ₹
                      {product.price.toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td>
                      {product.stock}
                    </td>

                    <td>
                      ⭐ {product.rating || 0}
                    </td>

                    <td>
                      <div className="admin-table-actions">

                        <button
                          type="button"
                          className="edit-product-btn"
                          onClick={() =>
                            openEditForm(product)
                          }
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          type="button"
                          className="delete-product-btn"
                          onClick={() =>
                            handleDelete(
                              product._id
                            )
                          }
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </section>

    </main>
  );
}

export default AdminProducts;