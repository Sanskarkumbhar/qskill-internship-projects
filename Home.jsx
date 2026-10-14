 import { useEffect, useState } from "react";
import { ArrowRight, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";

import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const featuredProducts = products.slice(0, 4);

  return (
    <main className="home-page">

      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-content">
          <p className="hero-label">WELCOME TO SHOPORA</p>

          <h1>
            Style that
            <br />
            speaks <span>for you.</span>
          </h1>

          <p className="hero-description">
            Discover modern fashion, footwear and accessories
            designed for your everyday lifestyle.
          </p>

          <Link to="/shop" className="hero-button">
            Shop Now
            <ArrowRight size={19} />
          </Link>
        </div>

        <div className="hero-visual">
          <div className="hero-circle">
            SHOPORA
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="home-categories">
        <div className="section-heading">
          <div>
            <p className="section-label">EXPLORE</p>
            <h2>Shop by Category</h2>
          </div>

          <Link to="/shop" className="view-link">
            View All <ArrowRight size={17} />
          </Link>
        </div>

        <div className="category-grid">

          <Link to="/shop" className="category-card">
            <span>01</span>
            <h3>Men</h3>
            <p>Modern everyday styles</p>
          </Link>

          <Link to="/shop" className="category-card">
            <span>02</span>
            <h3>Women</h3>
            <p>Elegant everyday fashion</p>
          </Link>

          <Link to="/shop" className="category-card">
            <span>03</span>
            <h3>Footwear</h3>
            <p>Comfort meets style</p>
          </Link>

          <Link to="/shop" className="category-card">
            <span>04</span>
            <h3>Accessories</h3>
            <p>Complete your look</p>
          </Link>

        </div>
      </section>

      {/* Featured Products */}
      <section className="home-products">

        <div className="section-heading">
          <div>
            <p className="section-label">SHOPORA PICKS</p>
            <h2>Featured Products</h2>
          </div>

          <Link to="/shop" className="view-link">
            View All <ArrowRight size={17} />
          </Link>
        </div>

        {loading ? (
          <div className="home-loading">
            <p>Loading products...</p>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="home-loading">
            <p>No products available.</p>
          </div>
        ) : (
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={{
                  ...product,
                  id: product._id,
                }}
              />
            ))}
          </div>
        )}

      </section>

      {/* Why Choose Us */}
      <section className="home-benefits">

        <div className="benefit-card">
          <Truck size={28} />

          <div>
            <h3>Fast Delivery</h3>
            <p>Quick and reliable delivery to your doorstep.</p>
          </div>
        </div>

        <div className="benefit-card">
          <RotateCcw size={28} />

          <div>
            <h3>Easy Returns</h3>
            <p>Simple and convenient return experience.</p>
          </div>
        </div>

        <div className="benefit-card">
          <ShieldCheck size={28} />

          <div>
            <h3>Secure Shopping</h3>
            <p>Your shopping experience is safe and secure.</p>
          </div>
        </div>

      </section>

      {/* Promo Banner */}
      <section className="home-promo">

        <div>
          <p>SHOPORA COLLECTION</p>

          <h2>
            Find something
            <br />
            you'll love.
          </h2>
        </div>

        <Link to="/shop" className="promo-button">
          Explore Collection
          <ArrowRight size={19} />
        </Link>

      </section>

    </main>
  );
}

export default Home;