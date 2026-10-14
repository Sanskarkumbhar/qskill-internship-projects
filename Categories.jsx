import { ArrowUpRight } from "lucide-react";
import "./Categories.css";

const categories = [
  {
    id: 1,
    name: "Men's Fashion",
    description: "Modern styles for every occasion",
  },
  {
    id: 2,
    name: "Women's Fashion",
    description: "Discover your everyday style",
  },
  {
    id: 3,
    name: "Footwear",
    description: "Step into something comfortable",
  },
  {
    id: 4,
    name: "Accessories",
    description: "Complete your perfect look",
  },
];

function Categories() {
  return (
    <section className="categories-section">
      <div className="categories-container">

        <div className="section-heading">
          <div>
            <p className="section-label">EXPLORE</p>
            <h2>Shop by Category</h2>
          </div>

          <p className="section-description">
            Find everything you need in one place.
          </p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <div className="category-card" key={category.id}>
              <div className="category-number">
                0{category.id}
              </div>

              <div className="category-content">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>

              <button className="category-arrow">
                <ArrowUpRight size={20} />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Categories;