const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    companyId: {
      type: String,
      required: true,
      index: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    recruiterId: {
      type: String,
      required: true,
      index: true,
    },
    jobCategory: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    jobType: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    isRemote: {
      type: Boolean,
      default: false,
    },
    salaryMin: Number,
    salaryMax: Number,
    salaryRange: String,
    currency: {
      type: String,
      default: "USD",
    },
    description: {
      type: String,
      required: true,
    },
    responsibilities: [String],
    requirements: [String],
    benefits: [String],
    applicationDeadline: Date,
    status: {
      type: String,
      enum: ["draft", "active", "closed", "removed"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true, strict: false },
);

module.exports = mongoose.models.Job || mongoose.model("Job", jobSchema);
