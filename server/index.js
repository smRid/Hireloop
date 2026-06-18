const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const cors = require("cors");
const connectDB = require("./src/config/db");

connectDB();
app.use(cors());
app.use(express.json());

const usersRoutes = require("./src/routes/users.routes");

app.use("/api/users", usersRoutes);

app.get("/", (req, res) => {
  res.send("Server is cooking!");
});

app.listen(port, () => {
  console.log(`Server is cooking on http://localhost:${port}`);
});
