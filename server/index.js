const express = require("express");
require("dotenv").config();
const cors = require("cors");

const connectDB = require("./src/config/db");
const usersRoutes = require("./src/routes/users.routes");
const companiesRoutes = require("./src/routes/companies.routes");
const jobsRoutes = require("./src/routes/jobs.routes");
const applicationsRoutes = require("./src/routes/applications.routes");
const plansRoutes = require("./src/routes/plans.routes");
const subscriptionsRoutes = require("./src/routes/subscriptions.routes");
const paymentsRoutes = require("./src/routes/payments.routes");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is cooking!");
});

app.use("/api/users", usersRoutes);
app.use("/api/companies", companiesRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/applications", applicationsRoutes);
app.use("/api/plans", plansRoutes);
app.use("/api/subscriptions", subscriptionsRoutes);
app.use("/api/payments", paymentsRoutes);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is cooking on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });

module.exports = app;
