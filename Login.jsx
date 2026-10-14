 import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";

import { loginUser } from "../services/authService";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const { email, password } = formData;

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser({
        email,
        password,
      });

      // Store JWT token
      localStorage.setItem("token", data.token);

      // Store user information
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess("Login successful!");

      setTimeout(() => {
        navigate("/");
      }, 700);
    } catch (error) {
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* LEFT SIDE */}
        <div className="auth-info">
          <div className="auth-logo">
            SHOP<span>ORA</span>
          </div>

          <h1>
            Welcome back
            <br />
            to SHOPORA.
          </h1>

          <p>
            Login to continue your personalized
            shopping experience.
          </p>

          <div className="auth-benefits">
            <div className="auth-benefit">
              <LogIn size={20} />
              <span>Quick and secure login</span>
            </div>

            <div className="auth-benefit">
              <Lock size={20} />
              <span>JWT secured authentication</span>
            </div>

            <div className="auth-benefit">
              <Mail size={20} />
              <span>Access your SHOPORA account</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-form-container">

          <div className="auth-form-header">
            <h2>Welcome Back</h2>
            <p>
              Enter your account details to continue.
            </p>
          </div>

          {error && (
            <div className="auth-message error">
              {error}
            </div>
          )}

          {success && (
            <div className="auth-message success">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div className="form-group">
              <label htmlFor="email">
                Email Address
              </label>

              <div className="input-wrapper">
                <Mail size={18} />

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrapper">
                <Lock size={18} />

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  disabled={loading}
                />
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                "Logging in..."
              ) : (
                <>
                  <LogIn size={18} />
                  Login
                </>
              )}
            </button>

          </form>

          <div className="auth-switch">
            <span>Don't have an account?</span>

            <Link to="/register">
              Create Account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;