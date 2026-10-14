const protect = require("./authMiddleware");

const employerOnly = (req, res, next) => {
  if (req.user.role !== "employer") {
    return res.status(403).json({
      success: false,
      message: "Employer access required.",
    });
  }

  next();
};

module.exports = [protect, employerOnly];