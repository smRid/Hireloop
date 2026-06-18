const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    planId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    audience: {
      type: String,
      enum: ["seeker", "recruiter", "admin"],
      required: true,
      index: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    interval: {
      type: String,
      enum: ["month", "year", "forever", "custom"],
      default: "month",
    },
    features: [String],
    maxApplicationsPerMonth: {
      type: Number,
      default: 0,
    },
    maxSavedJobs: {
      type: Number,
      default: 0,
    },
    maxActiveJobs: {
      type: Number,
      default: 0,
    },
    stripePriceId: String,
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true, strict: false },
);

module.exports = mongoose.models.Plan || mongoose.model("Plan", planSchema);
