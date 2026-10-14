 const express = require("express");

const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const employerOnly = require("../middleware/employerMiddleware");

const router = express.Router();

// Public routes
router.get("/", getJobs);
router.get("/:id", getJobById);

// Employer-only routes
router.post("/", employerOnly, createJob);
router.put("/:id", employerOnly, updateJob);
router.delete("/:id", employerOnly, deleteJob);

module.exports = router;