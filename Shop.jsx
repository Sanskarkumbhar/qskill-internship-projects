 
import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import "./Shop.css";

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        const data = await getProducts();
        if (!cancelled) {
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
        if (!cancelled) {
          setError("Unable to load products. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(
    () => [
      "All",
      ...new Set(
        products.map((product) => product.category).filter(Boolean)
      ),
    ],
    [products]
  );

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) =>
      String(product.name || "")
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase())
    );

    if (category !== "All") {
      result = result.filter(
        (product) => product.category === category
      );
    }

    result = result.filter(
      (product) => Number(product.price) <= maxPrice
    );

    if (sortBy === "price-low") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "rating") {
      result.sort(
        (a, b) => Number(b.rating || 0) - Number(a.rating || 0)
      );
    }

    return result;
  }, [products, searchTerm, category, maxPrice, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("All");
    setMaxPrice(5000);
    setSortBy("default");
  };

  if (loading) {
    return (
      <div className="shop-status">
        <div className="shop-spinner" />
        <h2>Finding your favourites...</h2>
        <p>Loading the latest SHOPORA collection.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shop-status">
        <h2>We couldn't load the products</h2>
        <p>{error}</p>
        <button
          className="clear-filter-btn"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <main className="shop-page">
      <header className="shop-header">
        <p className="section-label">THE SHOPORA EDIT</p>
        <h1>Find Your Everyday Style.</h1>
        <p>Explore thoughtfully selected essentials for every day.</p>
      </header>

      <section className="shop-controls" aria-label="Product filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search products..."
            aria-label="Search products"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search"
              aria-label="Clear search"
              onClick={() => setSearchTerm("")}
            >
              <X size={17} />
            </button>
          )}
        </div>

        <label className="filter-box">
          <SlidersHorizontal size={17} />
          <select
            aria-label="Filter by category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>

        <div className="price-filter">
          <label htmlFor="max-price">
            Up to ₹{maxPrice.toLocaleString("en-IN")}
          </label>
          <input
            id="max-price"
            type="range"
            min="500"
            max="5000"
            step="100"
            value={maxPrice}
            onChange={(event) => setMaxPrice(Number(event.target.value))}
          />
        </div>

        <label className="sort-box">
          <span className="sr-only">Sort products</span>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="default">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </label>

        <button
          type="button"
          className="clear-filter-btn"
          onClick={clearFilters}
        >
          Clear
        </button>
      </section>

      <section className="products-section">
        <div className="products-header">
          <div>
            <h2>All Products</h2>
            <p>Everyday essentials, picked for you.</p>
          </div>
          <span>{filteredProducts.length} items</span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="shop-empty">
            <Search size={30} />
            <h2>No products found</h2>
            <p>Try a different search or adjust your filters.</p>
            <button
              type="button"
              className="clear-filter-btn"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={{
                  ...product,
                  id: product._id || product.id,
                }}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Shop;
