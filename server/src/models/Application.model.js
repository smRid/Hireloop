const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true,
      index: true,
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    companyId: {
      type: String,
      index: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    applicantId: {
      type: String,
      required: true,
      index: true,
    },
    applicantName: {
      type: String,
      required: true,
      trim: true,
    },
    applicantEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    resumeLink: String,
    linkedinLink: String,
    portfolioLink: String,
    coverLetter: String,
    status: {
      type: String,
      enum: ["applied", "under_review", "shortlisted", "rejected", "offered"],
      default: "applied",
      index: true,
    },
  },
  { timestamps: true },
);

applicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });

module.exports =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);
