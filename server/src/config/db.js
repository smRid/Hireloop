const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_DB_URI;

  if (!mongoUri) {
    throw new Error("Missing environment variable: MONGO_DB_URI");
  }

  await mongoose.connect(mongoUri, {
    dbName: "hireloop",
  });

  console.log("MongoDB connected");
};

module.exports = connectDB;
