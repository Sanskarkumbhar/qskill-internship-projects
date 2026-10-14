const protect = require("./authMiddleware");

const jobseekerOnly = (req, res, next) => {
  if (req.user.role !== "jobseeker") {
    return res.status(403).json({
      success: false,
      message: "Jobseeker access required.",
    });
  }

  next();
};

module.exports = [protect, jobseekerOnly];