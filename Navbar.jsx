import { Link, NavLink } from "react-router-dom";
import { BriefcaseBusiness, User, LogOut } from "lucide-react";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          <BriefcaseBusiness size={25} />
          <span>CareerHub</span>
        </Link>

        <div className="nav-links">
          <NavLink to="/" end>
            Home
          </NavLink>

          <NavLink to="/jobs">
            Jobs
          </NavLink>

          <NavLink to="/my-applications">
            My Applications
          </NavLink>

          <NavLink to="/applications">
            Employer
          </NavLink>
        </div>

        <div className="nav-actions">
          <Link to="/login" className="login-btn">
            <User size={18} />
            Login
          </Link>

          <Link to="/register" className="register-btn">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;