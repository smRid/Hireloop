const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({}, { strict: false });

module.exports =
  mongoose.models.Session || mongoose.model("Session", sessionSchema, "session");
