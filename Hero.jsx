import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">

        <div className="hero-content">
          <p className="hero-label">NEW COLLECTION 2026</p>

          <h1>
            Discover Your
            <br />
            <span>Perfect Style.</span>
          </h1>

          <p className="hero-description">
            Explore our latest collection of fashion, accessories,
            and everyday essentials made for your style.
          </p>

          <Link to="/shop" className="hero-btn">
            Shop Now
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="hero-visual">
          <div className="hero-circle">
            <span>SHOPORA</span>
          </div>

          <div className="hero-card hero-card-one">
            NEW
          </div>

          <div className="hero-card hero-card-two">
            STYLE
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;