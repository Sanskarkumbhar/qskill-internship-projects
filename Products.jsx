import ProductCard from "./ProductCard";
import "./Products.css";

const products = [
  {
    id: 1,
    name: "Classic Oversized T-Shirt",
    category: "Men",
    price: 999,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Minimal Everyday Dress",
    category: "Women",
    price: 1899,
    rating: 4.7,
  },
  {
    id: 3,
    name: "Urban Street Sneakers",
    category: "Footwear",
    price: 2499,
    rating: 4.9,
  },
  {
    id: 4,
    name: "Premium Leather Bag",
    category: "Accessories",
    price: 2999,
    rating: 4.8,
  },
];

function Products() {
  return (
    <section className="products-section">
      <div className="products-container">

        <div className="products-heading">
          <div>
            <p className="section-label">OUR PICKS</p>
            <h2>Featured Products</h2>
          </div>

          <button className="view-all-btn">
            View All Products →
          </button>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

export default Products;