const express = require("express");
const { postCompany } = require("../controllers/companies.controller");

const router = express.Router();

router.post("/", postCompany);

module.exports = router;
