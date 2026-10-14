 import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  User,
  Mail,
  MapPin,
  CheckCircle,
} from "lucide-react";
import {
  getReceivedApplications,
  updateApplicationStatus,
} from "../services/applicationService";

function EmployerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState("");

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getReceivedApplications();

      setApplications(data.applications || []);
    } catch (err) {
      setError(
        err.message || "Failed to load applications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleStatusChange = async (
    applicationId,
    status
  ) => {
    try {
      setUpdating(applicationId);
      setError("");

      const data = await updateApplicationStatus(
        applicationId,
        status
      );

      setApplications((current) =>
        current.map((application) =>
          application._id === applicationId
            ? data.application
            : application
        )
      );
    } catch (err) {
      setError(
        err.message || "Failed to update application."
      );
    } finally {
      setUpdating("");
    }
  };

  if (loading) {
    return (
      <main className="employer-applications-page">
        <div className="applications-loading">
          Loading applications...
        </div>
      </main>
    );
  }

  return (
    <main className="employer-applications-page">
      <div className="employer-applications-container">
        <div className="employer-applications-header">
          <div>
            <p className="page-label">EMPLOYER PORTAL</p>
            <h1>Received Applications</h1>
            <p>
              Review candidates who applied for your jobs.
            </p>
          </div>

          <div className="application-count">
            {applications.length}
            <span>Applications</span>
          </div>
        </div>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        {applications.length === 0 ? (
          <section className="received-empty">
            <BriefcaseBusiness size={45} />

            <h2>No applications yet</h2>

            <p>
              Applications submitted for your jobs will
              appear here.
            </p>
          </section>
        ) : (
          <div className="received-applications-list">
            {applications.map((application) => (
              <article
                className="received-application-card"
                key={application._id}
              >
                <div className="received-card-header">
                  <div className="candidate-avatar">
                    <User size={25} />
                  </div>

                  <div className="candidate-info">
                    <h2>
                      {application.applicant?.name ||
                        "Applicant"}
                    </h2>

                    <p>
                      <Mail size={15} />
                      {application.applicant?.email ||
                        "Email unavailable"}
                    </p>
                  </div>

                  <span
                    className={`application-status ${
                      application.status?.toLowerCase() ||
                      "applied"
                    }`}
                  >
                    {application.status || "Applied"}
                  </span>
                </div>

                <div className="received-job-info">
                  <div>
                    <BriefcaseBusiness size={17} />

                    <span>
                      <small>Applied For</small>
                      {application.job?.title ||
                        "Job unavailable"}
                    </span>
                  </div>

                  <div>
                    <MapPin size={17} />

                    <span>
                      <small>Location</small>
                      {application.job?.location ||
                        "Not specified"}
                    </span>
                  </div>
                </div>

                {application.coverLetter && (
                  <div className="candidate-cover-letter">
                    <h3>Cover Letter</h3>

                    <p>
                      {application.coverLetter}
                    </p>
                  </div>
                )}

                {application.resume && (
                  <div className="candidate-resume">
                    <strong>Resume:</strong>{" "}
                    {application.resume}
                  </div>
                )}

                <div className="received-card-footer">
                  <span className="applied-date">
                    Applied on{" "}
                    {new Date(
                      application.createdAt
                    ).toLocaleDateString()}
                  </span>

                  <div className="status-actions">
                    <select
                      value={
                        application.status || "Applied"
                      }
                      disabled={
                        updating === application._id
                      }
                      onChange={(e) =>
                        handleStatusChange(
                          application._id,
                          e.target.value
                        )
                      }
                    >
                      <option value="Applied">
                        Applied
                      </option>

                      <option value="Shortlisted">
                        Shortlisted
                      </option>

                      <option value="Rejected">
                        Rejected
                      </option>

                      <option value="Hired">
                        Hired
                      </option>
                    </select>

                    {updating === application._id && (
                      <span className="updating-text">
                        Updating...
                      </span>
                    )}

                    {updating !== application._id && (
                      <CheckCircle
                        size={18}
                        className="status-check"
                      />
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default EmployerApplications;