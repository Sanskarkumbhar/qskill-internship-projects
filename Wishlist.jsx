 
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Heart,
  ShoppingBag,
  Trash2,
  Star,
  ArrowRight,
} from "lucide-react";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

import "./Wishlist.css";

const fallbackImages = {
  footwear:
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
  men:
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",
  women:
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=700&q=80",
  default:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=700&q=80",
};

function getFallbackImage(category = "") {
  const value = String(category).toLowerCase();

  if (value.includes("shoe") || value.includes("footwear")) {
    return fallbackImages.footwear;
  }

  if (value.includes("men")) return fallbackImages.men;
  if (value.includes("women") || value.includes("dress")) {
    return fallbackImages.women;
  }

  return fallbackImages.default;
}

function Wishlist() {
  const { wishlistItems = [], removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [failedImages, setFailedImages] = useState({});
  const [addingId, setAddingId] = useState(null);

  const getProductId = (product) => product.id || product._id;

  const handleAddToCart = (product) => {
    if (Number(product.stock) <= 0) {
      alert("This product is currently out of stock.");
      return;
    }

    setAddingId(String(getProductId(product)));

    addToCart({
      ...product,
      id: getProductId(product),
    });

    alert(`${product.name} added to cart!`);
    setAddingId(null);
  };

  return (
    <main className="wishlist-page">
      <section className="wishlist-header">
        <div className="wishlist-heading-icon">
          <Heart size={19} />
        </div>

        <p className="wishlist-eyebrow">YOUR FAVORITES</p>
        <h1>My Wishlist</h1>

        <p className="wishlist-subtitle">
          Keep the things you love all in one place.
        </p>

        <span className="wishlist-count">
          {wishlistItems.length}{" "}
          {wishlistItems.length === 1 ? "product" : "products"} saved
        </span>
      </section>

      {wishlistItems.length === 0 ? (
        <section className="empty-wishlist">
          <div className="empty-wishlist-icon">
            <Heart size={34} strokeWidth={1.5} />
          </div>

          <h2>Your wishlist is waiting</h2>
          <p>
            Explore SHOPORA and save your favorite products to find
            them here later.
          </p>

          <Link to="/shop" className="continue-shopping">
            Explore Products <ArrowRight size={17} />
          </Link>
        </section>
      ) : (
        <section className="wishlist-content">
          <div className="wishlist-toolbar">
            <h2>Saved for later</h2>
            <Link to="/shop" className="wishlist-continue-link">
              Continue shopping <ArrowRight size={15} />
            </Link>
          </div>

          <div className="wishlist-products">
            {wishlistItems.map((product) => {
              const productId = getProductId(product);
              const key = String(productId);
              const stock = Number(product.stock ?? 1);
              const outOfStock = stock <= 0;
              const price = Number(product.price) || 0;

              const imageSrc = failedImages[key]
                ? getFallbackImage(product.category)
                : product.image || getFallbackImage(product.category);

              return (
                <article className="wishlist-card" key={key}>
                  <Link
                    to={`/product/${productId}`}
                    className="wishlist-image"
                    aria-label={`View ${product.name}`}
                  >
                    <img
                      src={imageSrc}
                      alt={product.name || "SHOPORA product"}
                      loading="lazy"
                      onError={() =>
                        setFailedImages((previous) => ({
                          ...previous,
                          [key]: true,
                        }))
                      }
                    />

                    {product.badge && (
                      <span className="wishlist-product-badge">
                        {product.badge}
                      </span>
                    )}
                  </Link>

                  <button
                    type="button"
                    className="wishlist-remove"
                    onClick={() => removeFromWishlist(productId)}
                    aria-label={`Remove ${product.name} from wishlist`}
                    title="Remove from wishlist"
                  >
                    <Trash2 size={17} />
                  </button>

                  <div className="wishlist-info">
                    <p className="wishlist-category">
                      {product.category || "SHOPORA COLLECTION"}
                    </p>

                    <Link
                      to={`/product/${productId}`}
                      className="wishlist-product-link"
                    >
                      <h3>{product.name}</h3>
                    </Link>

                    <div className="wishlist-rating">
                      <Star size={15} fill="currentColor" />
                      <span>{Number(product.rating || 0).toFixed(1)}</span>
                    </div>

                    <strong className="wishlist-price">
                      ₹{price.toLocaleString("en-IN")}
                    </strong>

                    <p
                      className={`wishlist-stock ${
                        outOfStock ? "out-of-stock" : ""
                      }`}
                    >
                      {outOfStock ? "Out of stock" : "Available"}
                    </p>

                    <button
                      type="button"
                      className="wishlist-cart-button"
                      onClick={() => handleAddToCart(product)}
                      disabled={outOfStock || addingId === key}
                    >
                      <ShoppingBag size={17} />
                      {outOfStock
                        ? "Out of Stock"
                        : addingId === key
                          ? "Adding..."
                          : "Add to Cart"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}

export default Wishlist;
