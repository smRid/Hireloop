const Company = require("../models/Company.model");

// Endpoint to post a new company (for recruiters)
const postCompany = async (req, res) => {
  try {
    const payload = req.body;
    const newCompany = {
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const company = new Company(newCompany);
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Endpoint to get all companies (for admin dashboard)
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({});
    res.status(200).json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Endpoint to get companies registered by a recruiter (for recruiter dashboard)
const getCompaniesByRecruiterId = async (req, res) => {
  try {
    const { recruiterId } = req.params;
    const companies = await Company.find({ recruiterId });
    res.status(200).json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { postCompany, getAllCompanies, getCompaniesByRecruiterId };
