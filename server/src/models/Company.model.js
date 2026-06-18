const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    industry: {
      type: String,
      required: true,
      trim: true,
    },
    websiteUrl: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    employeeCount: {
      type: Number,
      required: true,
    },
    logoUrl: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    recruiterId: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "verified", "rejected"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.Company || mongoose.model("Company", companySchema);
