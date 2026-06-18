const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_DB_URI;

app.use(cors());
app.use(express.json());

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    emailVerified: Boolean,
    image: String,
    role: {
      type: String,
      enum: ["seeker", "recruiter", "admin"],
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    plan: {
      type: String,
      enum: ["free", "pro", "premium", "growth", "enterprise"],
      default: "free",
    },
    applicationsUsedThisMonth: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    websiteUrl: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    employeeCount: {
      type: Number,
      required: true,
    },
    logoUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", userSchema, "user");
const Company =
  mongoose.models.Company || mongoose.model("Company", companySchema);
const Session =
  mongoose.models.Session ||
  mongoose.model(
    "Session",
    new mongoose.Schema({}, { strict: false }),
    "session",
  );

const userIdentityQuery = (userId) => {
  const query = [{ id: userId }];

  if (mongoose.Types.ObjectId.isValid(userId)) {
    query.push({ _id: userId });
  }

  return { $or: query };
};

const connectDB = async () => {
  if (!mongoUri) {
    throw new Error("Missing environment variable: MONGO_DB_URI");
  }

  await mongoose.connect(mongoUri, {
    dbName: "hireloop",
  });

  console.log("MongoDB connected");
};

app.get("/", (req, res) => {
  res.send("Server is cooking!");
});

const verifyToken = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const session = await Session.findOne({ token }).lean();

    if (!session?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne(userIdentityQuery(session.userId));

    if (!user || user.status === "suspended") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("[auth:verify-token]", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const verifyRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};

const isSameUser = (currentUser, userId) => {
  return (
    currentUser?._id?.toString() === userId ||
    currentUser?.id === userId
  );
};

app.get("/api/users", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("[users:get]", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.patch("/api/users/set-role", verifyToken, async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User id is required" });
    }

    if (!["seeker", "recruiter"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!isSameUser(req.user, userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updatedUser = await User.findOneAndUpdate(
      userIdentityQuery(userId),
      { role },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Role set successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("[users:set-role]", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/api/companies", async (req, res) => {
  try {
    const companies = await Company.find({}).sort({ createdAt: -1 });
    res.status(200).json(companies);
  } catch (error) {
    console.error("[companies:get]", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post(
  "/api/companies",
  verifyToken,
  verifyRole("recruiter"),
  async (req, res) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json(company);
  } catch (error) {
    console.error("[companies:create]", error);
    res.status(500).json({ message: error.message });
  }
  },
);

app.get("/api/companies/:recruiterId", async (req, res) => {
  try {
    const { recruiterId } = req.params;
    const companies = await Company.find({ recruiterId }).sort({
      createdAt: -1,
    });
    res.status(200).json(companies);
  } catch (error) {
    console.error("[companies:get-by-recruiter]", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

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
