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

module.exports = { postCompany };
