 import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  User,
  Mail,
  Lock,
  Building2,
  UserPlus,
} from "lucide-react";
import { registerUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobseeker",
    companyName: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (
      formData.role === "employer" &&
      !formData.companyName
    ) {
      setError("Please enter your company name.");
      return;
    }

    try {
      setLoading(true);

      const data = await registerUser(formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "employer") {
        navigate("/post-job");
      } else {
        navigate("/jobs");
      }
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-icon">
          <BriefcaseBusiness size={28} />
        </div>

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Join CareerHub and find your next opportunity
        </p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label>Full Name *</label>

          <div className="auth-input">
            <User size={18} />

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <label>Email Address *</label>

          <div className="auth-input">
            <Mail size={18} />

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <label>Password *</label>

          <div className="auth-input">
            <Lock size={18} />

            <input
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <label>Account Type *</label>

          <div className="role-selection">
            <label
              className={
                formData.role === "jobseeker"
                  ? "role-option selected"
                  : "role-option"
              }
            >
              <input
                type="radio"
                name="role"
                value="jobseeker"
                checked={formData.role === "jobseeker"}
                onChange={handleChange}
              />

              <User size={18} />

              <span>Jobseeker</span>
            </label>

            <label
              className={
                formData.role === "employer"
                  ? "role-option selected"
                  : "role-option"
              }
            >
              <input
                type="radio"
                name="role"
                value="employer"
                checked={formData.role === "employer"}
                onChange={handleChange}
              />

              <Building2 size={18} />

              <span>Employer</span>
            </label>
          </div>

          {formData.role === "employer" && (
            <>
              <label>Company Name *</label>

              <div className="auth-input">
                <Building2 size={18} />

                <input
                  type="text"
                  name="companyName"
                  placeholder="Enter your company name"
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            <UserPlus size={18} />

            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  );
}

export default Register;