
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BriefcaseBusiness, MapPin, Clock3 } from "lucide-react";
import { getMyApplications } from "../services/applicationService";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const data = await getMyApplications();
        setApplications(data.applications || []);
      } catch (err) {
        setError(err.message || "Unable to load applications.");
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  if (loading) return <main className="applications-page"><p>Loading applications...</p></main>;

  return (
    <main className="applications-page">
      <div className="applications-container">
        <h1>My Applications</h1>
        <p className="applications-subtitle">
          Track the status of jobs you've applied for.
        </p>

        {error && <p className="form-error">{error}</p>}

        {!error && applications.length === 0 && (
          <section className="applications-empty">
            <BriefcaseBusiness size={42} />
            <h2>No applications yet</h2>
            <p>Explore available jobs and submit your first application.</p>
            <Link to="/jobs" className="applications-browse-btn">
              Browse Jobs
            </Link>
          </section>
        )}

        <div className="applications-list">
          {applications.map((item) => (
            <article className="application-card" key={item._id}>
              <div className="application-card-top">
                <div className="application-icon">
                  <BriefcaseBusiness size={24} />
                </div>

                <div className="application-info">
                  <h2>{item.job?.title || "Job no longer available"}</h2>
                  <p>{item.job?.company || "Company unavailable"}</p>
                </div>

                <span className={`application-status ${(item.status || "Applied").toLowerCase()}`}>
                  {item.status || "Applied"}
                </span>
              </div>

              <div className="application-meta">
                <span><MapPin size={16} /> {item.job?.location || "Location unavailable"}</span>
                <span><Clock3 size={16} /> {item.job?.jobType || "Job type unavailable"}</span>
              </div>

              <p className="application-date">
                Applied on {new Date(item.createdAt).toLocaleDateString()}
              </p>

              {item.job?._id && (
                <Link
                  className="application-view-link"
                  to={`/jobs/${item.job._id}`}
                >
                  View Job
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

export default MyApplications;