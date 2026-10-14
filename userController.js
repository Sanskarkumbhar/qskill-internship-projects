const User = require("../models/User");

const getUsers = async (req, res) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.user.userId } },
      "name email profileImage status lastSeen"
    ).sort({ name: 1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while fetching users.",
    });
  }
};

module.exports = {
  getUsers,
};