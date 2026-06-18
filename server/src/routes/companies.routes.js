const express = require("express");
const {
  postCompany,
  getAllCompanies,
  getCompaniesByRecruiterId,
} = require("../controllers/companies.controller");

const router = express.Router();

router.get("/", getAllCompanies);
router.post("/", postCompany);

router.get("/:recruiterId", getCompaniesByRecruiterId);

module.exports = router;
