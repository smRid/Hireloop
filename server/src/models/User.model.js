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
      enum: ["free", "pro", "premium", "growth", "enterprise"],
      default: "free",
    },
    applicationsUsedThisMonth: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, strict: false },
);

module.exports =
  mongoose.models.User || mongoose.model("User", userSchema, "user");
