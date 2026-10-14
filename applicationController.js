const Application = require("../models/Application");
const Job = require("../models/Job");

// Apply for a job
const applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter, resume } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required.",
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    if (job.status === "Closed") {
      return res.status(400).json({
        success: false,
        message: "This job is closed.",
      });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user.userId,
      coverLetter: coverLetter || "",
      resume: resume || "",
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      application,
    });
  } catch (error) {
    console.error("Apply for job error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit application.",
      error: error.message,
    });
  }
};

// Get applications submitted by the logged-in user
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user.userId,
    })
      .populate(
        "job",
        "title company location salary jobType category"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get my applications error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch applications.",
      error: error.message,
    });
  }
};

// Get applications for jobs posted by the logged-in user
const getReceivedApplications = async (req, res) => {
  try {
    const jobs = await Job.find({
      postedBy: req.user.userId,
    }).select("_id");

    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({
      job: { $in: jobIds },
    })
      .populate("job", "title company")
      .populate(
        "applicant",
        "name email"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(
      "Get received applications error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch received applications.",
      error: error.message,
    });
  }
};

// Update application status
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Applied",
      "Shortlisted",
      "Rejected",
      "Hired",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status.",
      });
    }

    const application = await Application.findById(
      req.params.id
    ).populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (
      application.job.postedBy.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only update applications for your own jobs.",
      });
    }

    application.status = status;
    await application.save();

    const updatedApplication =
      await Application.findById(application._id)
        .populate(
          "job",
          "title company location"
        )
        .populate(
          "applicant",
          "name email"
        );

    res.status(200).json({
      success: true,
      message:
        "Application status updated successfully.",
      application: updatedApplication,
    });
  } catch (error) {
    console.error(
      "Update application status error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update application status.",
      error: error.message,
    });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getReceivedApplications,
  updateApplicationStatus,
};