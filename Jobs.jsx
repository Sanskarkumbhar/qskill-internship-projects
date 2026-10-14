import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  BriefcaseBusiness,
  Clock3,
  ArrowRight,
} from "lucide-react";
import { getJobs } from "../services/jobService";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await getJobs();

      setJobs(data.jobs || []);
      setFilteredJobs(data.jobs || []);
    } catch (err) {
      setError("Unable to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const result = jobs.filter((job) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        !searchText ||
        job.title?.toLowerCase().includes(searchText) ||
        job.company?.toLowerCase().includes(searchText) ||
        job.category?.toLowerCase().includes(searchText) ||
        job.skills?.some((skill) =>
          skill.toLowerCase().includes(searchText)
        );

      const matchesLocation =
        !location ||
        job.location?.toLowerCase().includes(location.toLowerCase());

      const matchesType =
        !jobType || job.jobType === jobType;

      return matchesSearch && matchesLocation && matchesType;
    });

    setFilteredJobs(result);
  };

  return (
    <main className="jobs-page">
      <section className="jobs-header">
        <div>
          <p className="page-label">CAREER OPPORTUNITIES</p>
          <h1>Find Your Next Job</h1>
          <p>
            Explore opportunities that match your skills and career goals.
          </p>
        </div>
      </section>

      <section className="job-search-panel">
        <div className="job-search-field">
          <Search size={19} />
          <input
            type="text"
            placeholder="Job title, company, or skill"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="job-search-field">
          <MapPin size={19} />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
        >
          <option value="">All Job Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>

        <button onClick={handleSearch} className="find-jobs-btn">
          Search
        </button>
      </section>

      <section className="jobs-content">
        <div className="jobs-result-header">
          <div>
            <h2>Available Jobs</h2>
            <p>
              {filteredJobs.length} opportunities found
            </p>
          </div>
        </div>

        {loading && (
          <div className="jobs-message">
            Loading jobs...
          </div>
        )}

        {!loading && error && (
          <div className="jobs-message error-message">
            {error}
          </div>
        )}

        {!loading && !error && filteredJobs.length === 0 && (
          <div className="jobs-message">
            No jobs found. Try different search filters.
          </div>
        )}

        <div className="jobs-grid">
          {!loading &&
            filteredJobs.map((job) => (
              <article className="job-card" key={job._id}>
                <div className="job-card-top">
                  <div className="company-icon">
                    <BriefcaseBusiness size={24} />
                  </div>

                  <span className="job-type">
                    {job.jobType}
                  </span>
                </div>

                <h3>{job.title}</h3>

                <p className="company-name">
                  {job.company}
                </p>

                <div className="job-info">
                  <span>
                    <MapPin size={16} />
                    {job.location}
                  </span>

                  <span>
                    <Clock3 size={16} />
                    {job.category}
                  </span>
                </div>

                <div className="skills-list">
                  {(job.skills || []).slice(0, 4).map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>

                <div className="job-card-footer">
                  <strong>{job.salary}</strong>

                  <Link to={`/jobs/${job._id}`}>
                    View Job
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
        </div>
      </section>
    </main>
  );
}

export default Jobs;