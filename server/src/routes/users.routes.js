const express = require("express");
const { setUserRole, getAllUsers } = require("../controllers/users.controller");

const router = express.Router();

router.get("/", getAllUsers);
router.patch("/set-role", setUserRole);

module.exports = router;
