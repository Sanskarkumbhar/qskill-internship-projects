 
import { Link, useParams } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  RotateCcw,
  Minus,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { getProductById } from "../services/productService";

import "./ProductDetails.css";

const fallbackImages = {
  footwear:
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85",
  men:
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=85",
  women:
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85",
  accessories:
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85",
  default:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=85",
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
  if (
    value.includes("accessor") ||
    value.includes("bag") ||
    value.includes("watch")
  ) {
    return fallbackImages.accessories;
  }

  return fallbackImages.default;
}

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlist();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setImageFailed(false);
        setQuantity(1);

        const data = await getProductById(id);

        if (!cancelled) {
          setProduct({
            ...data,
            id: data._id || data.id,
            name: data.name || "SHOPORA Product",
            price: Number(data.price) || 0,
            rating: Number(data.rating) || 0,
            stock: Math.max(0, Number(data.stock) || 0),
          });
        }
      } catch (err) {
        console.error("Unable to load product:", err);
        if (!cancelled) setError("Unable to load this product.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="product-not-found">
        <div className="product-loading-spinner" />
        <h2>Loading product...</h2>
        <p>Getting your SHOPORA selection ready.</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="product-not-found">
        <h2>Product unavailable</h2>
        <p>{error || "This product could not be found."}</p>
        <Link to="/shop" className="back-shop-button">
          Back to Shop
        </Link>
      </main>
    );
  }

  const wishlistActive = isInWishlist(product.id);
  const imageSrc =
    !imageFailed && product.image
      ? product.image
      : getFallbackImage(product.category);

  const increaseQuantity = () => {
    setQuantity((current) => Math.min(current + 1, product.stock));
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const handleAddToCart = () => {
    if (product.stock <= 0) return;

    // Preserve the cart context's existing add-to-cart API.
    for (let i = 0; i < quantity; i += 1) {
      addToCart(product);
    }
    alert(`${product.name} (${quantity}) added to cart!`);
  };

  const handleWishlist = () => {
    if (wishlistActive) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <main className="product-details-page">
      <nav className="product-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/shop">Shop</Link>
        <span>/</span>
        <span className="breadcrumb-current">{product.name}</span>
      </nav>

      <section className="product-details-container">
        <div className="product-gallery">
          {product.badge && (
            <span className="details-badge">{product.badge}</span>
          )}

          <button
            type="button"
            className={`details-wishlist ${
              wishlistActive ? "active" : ""
            }`}
            onClick={handleWishlist}
            aria-label={
              wishlistActive ? "Remove from wishlist" : "Add to wishlist"
            }
          >
            <Heart
              size={21}
              fill={wishlistActive ? "currentColor" : "none"}
            />
          </button>

          <img
            src={imageSrc}
            alt={product.name}
            className="details-product-image"
            onError={() => setImageFailed(true)}
          />
        </div>

        <div className="product-details-info">
          <p className="details-category">
            {product.category || "SHOPORA COLLECTION"}
          </p>

          <h1>{product.name}</h1>

          <div className="details-rating">
            <div className="stars" aria-label={`Rating ${product.rating} out of 5`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={17}
                  fill={star <= Math.round(product.rating) ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span>{product.rating.toFixed(1)}</span>
            <span className="rating-divider">·</span>
            <span className="review-label">Customer rating</span>
          </div>

          <div className="details-price">
            ₹{product.price.toLocaleString("en-IN")}
          </div>

          <p className="details-description">
            {product.description ||
              `Discover the ${product.name} from SHOPORA. A versatile choice for your everyday collection.`}
          </p>

          <div className="details-divider" />

          <div className="details-stock-line">
            <span className={product.stock > 0 ? "stock-available" : "stock-unavailable"}>
              <span className="stock-dot" />
              {product.stock > 0
                ? `${product.stock} available`
                : "Currently out of stock"}
            </span>
          </div>

          <div className="quantity-section">
            <span>Quantity</span>
            <div className="details-quantity">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus size={15} />
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={increaseQuantity}
                disabled={product.stock <= 0 || quantity >= product.stock}
                aria-label="Increase quantity"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>

          <button
            type="button"
            className="details-add-cart"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            <ShoppingBag size={19} />
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>

          <button
            type="button"
            className={`details-wishlist-secondary ${
              wishlistActive ? "active" : ""
            }`}
            onClick={handleWishlist}
          >
            <Heart
              size={18}
              fill={wishlistActive ? "currentColor" : "none"}
            />
            {wishlistActive ? "Saved to Wishlist" : "Add to Wishlist"}
          </button>

          <div className="product-benefits">
            <div className="benefit-item">
              <Truck size={22} />
              <div>
                <strong>Delivery information</strong>
                <span>Free delivery on orders above ₹999</span>
              </div>
            </div>

            <div className="benefit-item">
              <RotateCcw size={22} />
              <div>
                <strong>Easy returns</strong>
                <span>Check the store's return policy</span>
              </div>
            </div>

            <div className="benefit-item">
              <ShieldCheck size={22} />
              <div>
                <strong>SHOPORA checkout</strong>
                <span>Review your order before payment</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;
