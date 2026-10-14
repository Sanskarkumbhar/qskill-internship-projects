import { Link } from "react-router-dom";
import {
  Search,
  BriefcaseBusiness,
  Users,
  Building2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <BriefcaseBusiness size={16} />
            Find your next opportunity
          </div>

          <h1>
            Build Your Career.
            <span> Find Your Future.</span>
          </h1>

          <p>
            Discover internships, jobs, and career opportunities from
            companies looking for talented people like you.
          </p>

          <div className="hero-buttons">
            <Link to="/jobs" className="primary-btn">
              Explore Jobs
              <ArrowRight size={18} />
            </Link>

            <Link to="/register" className="secondary-btn">
              Create Account
            </Link>
          </div>

          {/* Search Preview */}
          <div className="search-box">
            <div className="search-input">
              <Search size={20} />
              <span>Job title, skills, or keywords</span>
            </div>

            <div className="search-location">
              <Building2 size={19} />
              <span>Location</span>
            </div>

            <Link to="/jobs" className="search-btn">
              Search Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="stat-card">
          <BriefcaseBusiness size={28} />
          <div>
            <h3>100+</h3>
            <p>Job Opportunities</p>
          </div>
        </div>

        <div className="stat-card">
          <Building2 size={28} />
          <div>
            <h3>50+</h3>
            <p>Companies</p>
          </div>
        </div>

        <div className="stat-card">
          <Users size={28} />
          <div>
            <h3>500+</h3>
            <p>Job Seekers</p>
          </div>
        </div>
      </section>

      {/* Why CareerHub */}
      <section className="features-section">
        <div className="section-heading">
          <p>WHY CAREERHUB?</p>
          <h2>Everything you need to find your next job</h2>
          <span>
            A simple platform connecting talented candidates with great
            opportunities.
          </span>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <Search size={30} />
            <h3>Find the Right Job</h3>
            <p>
              Search and explore jobs based on your skills, interests,
              location, and career goals.
            </p>
          </div>

          <div className="feature-card">
            <Building2 size={30} />
            <h3>Connect with Companies</h3>
            <p>
              Discover opportunities from companies looking for motivated
              and talented candidates.
            </p>
          </div>

          <div className="feature-card">
            <CheckCircle2 size={30} />
            <h3>Easy Applications</h3>
            <p>
              Apply for jobs and keep track of your application status
              from one convenient dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div>
          <h2>Ready to take the next step?</h2>
          <p>
            Create your account and start exploring opportunities today.
          </p>
        </div>

        <Link to="/jobs" className="cta-btn">
          Browse Jobs
          <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}

export default Home;