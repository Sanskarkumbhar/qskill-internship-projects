 import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  Building2,
  MapPin,
  FileText,
  DollarSign,
  Tags,
  Send,
} from "lucide-react";

const API_URL = "http://localhost:5001/api/jobs";

function PostJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    requirements: "",
    salary: "",
    jobType: "Full-time",
    category: "",
    skills: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
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
    setMessage("");

    if (
      !formData.title ||
      !formData.company ||
      !formData.location ||
      !formData.description
    ) {
      setError(
        "Please fill in title, company, location and description."
      );
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login as an employer first.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          skills: formData.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to post job.");
      }

      setMessage("Job posted successfully!");

      setFormData({
        title: "",
        company: "",
        location: "",
        description: "",
        requirements: "",
        salary: "",
        jobType: "Full-time",
        category: "",
        skills: "",
      });

      setTimeout(() => {
        navigate("/jobs");
      }, 1200);
    } catch (err) {
      setError(err.message || "Failed to post job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="post-job-page">
      <div className="post-job-container">
        <div className="post-job-heading">
          <div className="post-job-icon">
            <BriefcaseBusiness size={28} />
          </div>

          <div>
            <p className="page-label">EMPLOYER PORTAL</p>
            <h1>Post a New Job</h1>
            <p>
              Find the right candidate for your company.
            </p>
          </div>
        </div>

        <form
          className="post-job-form"
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {message && (
            <div className="form-success">
              {message}
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label>Job Title *</label>

              <div className="form-input">
                <BriefcaseBusiness size={18} />

                <input
                  type="text"
                  name="title"
                  placeholder="e.g. React Developer"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Company Name *</label>

              <div className="form-input">
                <Building2 size={18} />

                <input
                  type="text"
                  name="company"
                  placeholder="e.g. Tech Solutions"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Location *</label>

              <div className="form-input">
                <MapPin size={18} />

                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Pune"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Salary</label>

              <div className="form-input">
                <DollarSign size={18} />

                <input
                  type="text"
                  name="salary"
                  placeholder="e.g. ₹25,000/month"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Job Type</label>

              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>

              <div className="form-input">
                <Tags size={18} />

                <input
                  type="text"
                  name="category"
                  placeholder="e.g. Web Development"
                  value={formData.category}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Required Skills</label>

            <div className="form-input">
              <Tags size={18} />

              <input
                type="text"
                name="skills"
                placeholder="React, JavaScript, HTML, CSS"
                value={formData.skills}
                onChange={handleChange}
              />
            </div>

            <small>
              Separate skills with commas.
            </small>
          </div>

          <div className="form-group">
            <label>Job Description *</label>

            <div className="form-textarea">
              <FileText size={18} />

              <textarea
                name="description"
                placeholder="Describe the role and responsibilities..."
                value={formData.description}
                onChange={handleChange}
                rows="6"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Requirements</label>

            <textarea
              className="standalone-textarea"
              name="requirements"
              placeholder="Mention education, experience and other requirements..."
              value={formData.requirements}
              onChange={handleChange}
              rows="5"
            />
          </div>

          <div className="post-job-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/jobs")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="post-job-btn"
              disabled={loading}
            >
              <Send size={18} />

              {loading ? "Posting..." : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default PostJob;