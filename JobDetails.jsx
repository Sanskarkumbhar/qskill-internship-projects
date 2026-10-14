 import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  BriefcaseBusiness,
  MapPin,
  Building2,
  Clock3,
  DollarSign,
  ArrowLeft,
  Send,
} from "lucide-react";
import { applyForJob } from "../services/applicationService";

function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5001/api/jobs/${id}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load job."
        );
      }

      setJob(data.job);
    } catch (err) {
      setError(err.message || "Failed to load job.");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login before applying for a job.");
      return;
    }

    try {
      setApplying(true);

      const data = await applyForJob({
        jobId: id,
        coverLetter,
        resume,
      });

      setMessage(
        data.message || "Application submitted successfully."
      );

      setCoverLetter("");
      setResume("");
    } catch (err) {
      setError(
        err.message || "Failed to submit application."
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <main className="job-details-page">
        <div className="jobs-message">
          Loading job details...
        </div>
      </main>
    );
  }

  if (error && !job) {
    return (
      <main className="job-details-page">
        <div className="jobs-message error-message">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="job-details-page">
      <div className="job-details-container">
        <Link to="/jobs" className="back-link">
          <ArrowLeft size={17} />
          Back to Jobs
        </Link>

        <section className="job-details-header">
          <div className="job-details-icon">
            <BriefcaseBusiness size={32} />
          </div>

          <div className="job-details-title">
            <span className="job-type">
              {job.jobType}
            </span>

            <h1>{job.title}</h1>

            <p>
              <Building2 size={17} />
              {job.company}
            </p>
          </div>
        </section>

        <div className="job-details-layout">
          <section className="job-details-main">
            <div className="job-meta-grid">
              <div>
                <MapPin size={20} />
                <span>
                  <small>Location</small>
                  {job.location}
                </span>
              </div>

              <div>
                <DollarSign size={20} />
                <span>
                  <small>Salary</small>
                  {job.salary}
                </span>
              </div>

              <div>
                <Clock3 size={20} />
                <span>
                  <small>Job Type</small>
                  {job.jobType}
                </span>
              </div>
            </div>

            <div className="job-description-section">
              <h2>Job Description</h2>
              <p>{job.description}</p>
            </div>

            {job.requirements && (
              <div className="job-description-section">
                <h2>Requirements</h2>
                <p>{job.requirements}</p>
              </div>
            )}

            {job.skills?.length > 0 && (
              <div className="job-description-section">
                <h2>Required Skills</h2>

                <div className="details-skills">
                  {job.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="job-posted-info">
              Posted by{" "}
              <strong>
                {job.postedBy?.name || "Employer"}
              </strong>
            </div>
          </section>

          <aside className="apply-card">
            <h2>Apply for this Job</h2>

            <p>
              Interested in this opportunity? Submit your
              application below.
            </p>

            {message && (
              <div className="form-success">
                {message}
              </div>
            )}

            {error && job && (
              <div className="form-error">
                {error}
              </div>
            )}

            <form onSubmit={handleApply}>
              <label>Cover Letter</label>

              <textarea
                value={coverLetter}
                onChange={(e) =>
                  setCoverLetter(e.target.value)
                }
                placeholder="Tell the employer why you're a good fit..."
                rows="7"
              />

              <label>Resume</label>

              <input
                type="text"
                value={resume}
                onChange={(e) =>
                  setResume(e.target.value)
                }
                placeholder="Resume file name or link"
              />

              <button
                type="submit"
                className="apply-btn"
                disabled={applying}
              >
                <Send size={18} />

                {applying
                  ? "Submitting..."
                  : "Submit Application"}
              </button>
            </form>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default JobDetails;