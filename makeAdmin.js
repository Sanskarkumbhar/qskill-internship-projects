 const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = process.argv[2];

    if (!email) {
      console.log("Please provide the registered email.");
      console.log("Example:");
      console.log("node makeAdmin.js your-email@example.com");

      await mongoose.connection.close();
      return;
    }

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { role: "admin" },
      { new: true }
    );

    if (!user) {
      console.log("User not found.");
      console.log("Please check that the email matches your registered account.");
    } else {
      console.log("Admin role assigned successfully!");
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error.message);
  }
};

makeAdmin();