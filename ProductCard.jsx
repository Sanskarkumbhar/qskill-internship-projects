 
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

import "./ProductCard.css";

const fallbackImages = {
  footwear:
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85",
  men:
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85",
  women:
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=700&q=85",
  accessories:
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=85",
  default:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=700&q=85",
};

function getProductImage(product) {
  if (product.image && product.image.trim()) {
    return product.image;
  }

  const category = String(product.category || "").toLowerCase();

  if (category.includes("shoe") || category.includes("footwear")) {
    return fallbackImages.footwear;
  }

  if (category.includes("men")) {
    return fallbackImages.men;
  }

  if (category.includes("women") || category.includes("dress")) {
    return fallbackImages.women;
  }

  if (
    category.includes("accessor") ||
    category.includes("bag") ||
    category.includes("watch")
  ) {
    return fallbackImages.accessories;
  }

  return fallbackImages.default;
}

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  const productId = product.id || product._id;
  const wishlistActive = isInWishlist(productId);
  const productImage = getProductImage(product);
  const price = Number(product.price) || 0;
  const stock = Number(product.stock) || 0;

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (stock <= 0) {
      alert("This product is out of stock.");
      return;
    }

    addToCart({
      ...product,
      id: productId,
    });

    alert(`${product.name} added to cart!`);
  };

  const handleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const productData = {
      ...product,
      id: productId,
    };

    if (wishlistActive) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productData);
    }
  };

  return (
    <article className="product-card">
      <div className="product-image-container">
        {product.badge && (
          <span className="product-badge">{product.badge}</span>
        )}

        <button
          type="button"
          className={`wishlist-button ${
            wishlistActive ? "active" : ""
          }`}
          onClick={handleWishlist}
          aria-label={
            wishlistActive
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >
          <Heart
            size={19}
            fill={wishlistActive ? "currentColor" : "none"}
          />
        </button>

        <Link
          to={`/product/${productId}`}
          className="product-image-link"
        >
          <img
            src={productImage}
            alt={product.name || "SHOPORA product"}
            className="product-image"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = fallbackImages.default;
            }}
          />
        </Link>
      </div>

      <div className="product-info">
        <p className="product-category">
          {product.category || "Collection"}
        </p>

        <Link
          to={`/product/${productId}`}
          className="product-name"
        >
          {product.name}
        </Link>

        <div className="product-rating">
          <Star size={15} fill="currentColor" />
          <span>{Number(product.rating) || 0}</span>
        </div>

        <div className="product-bottom">
          <strong className="product-price">
            ₹{price.toLocaleString("en-IN")}
          </strong>

          <button
            type="button"
            className="add-cart-button"
            onClick={handleAddToCart}
            disabled={stock <= 0}
          >
            <ShoppingBag size={16} />
            <span>
              {stock > 0 ? "Add to Cart" : "Out of Stock"}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
