const express = require("express");

const {
  applyForJob,
  getMyApplications,
  getReceivedApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Apply for a job
router.post("/", protect, applyForJob);

// Applications submitted by current user
router.get(
  "/my-applications",
  protect,
  getMyApplications
);

// Applications received for current user's jobs
router.get(
  "/received",
  protect,
  getReceivedApplications
);

// Employer updates application status
router.patch(
  "/:id/status",
  protect,
  updateApplicationStatus
);

module.exports = router;