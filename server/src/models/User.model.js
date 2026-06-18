const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    emailVerified: Boolean,
    image: String,
    role: {
      type: String,
      enum: ["seeker", "recruiter", "admin"],
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    plan: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema, "user");
