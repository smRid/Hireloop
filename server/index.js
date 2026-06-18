const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  if (req.path !== "/" && !req.path.startsWith("/api")) {
    req.url = `/api${req.url}`;
  }

  next();
});

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
    savedJobs: [
      {
        jobId: {
          type: String,
          required: true,
        },
        savedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true, strict: false },
);

const sessionSchema = new mongoose.Schema({}, { strict: false });

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    industry: {
      type: String,
      required: true,
      trim: true,
    },
    websiteUrl: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    employeeCount: {
      type: Number,
      required: true,
    },
    logoUrl: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    recruiterId: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "verified", "rejected"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true },
);

const jobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    companyId: {
      type: String,
      required: true,
      index: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    recruiterId: {
      type: String,
      required: true,
      index: true,
    },
    jobCategory: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    jobType: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    isRemote: {
      type: Boolean,
      default: false,
    },
    salaryMin: Number,
    salaryMax: Number,
    salaryRange: String,
    currency: {
      type: String,
      default: "USD",
    },
    description: {
      type: String,
      required: true,
    },
    responsibilities: [String],
    requirements: [String],
    benefits: [String],
    applicationDeadline: Date,
    status: {
      type: String,
      enum: ["draft", "active", "closed", "removed"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true, strict: false },
);

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true,
      index: true,
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    companyId: {
      type: String,
      index: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    applicantId: {
      type: String,
      required: true,
      index: true,
    },
    applicantName: {
      type: String,
      required: true,
      trim: true,
    },
    applicantEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    resumeLink: String,
    linkedinLink: String,
    portfolioLink: String,
    coverLetter: String,
    status: {
      type: String,
      enum: ["applied", "under_review", "shortlisted", "rejected", "offered"],
      default: "applied",
      index: true,
    },
  },
  { timestamps: true },
);

applicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });

const planSchema = new mongoose.Schema(
  {
    planId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    audience: {
      type: String,
      enum: ["seeker", "recruiter", "admin"],
      required: true,
      index: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    interval: {
      type: String,
      enum: ["month", "year", "forever", "custom"],
      default: "month",
    },
    features: [String],
    maxApplicationsPerMonth: {
      type: Number,
      default: 0,
    },
    maxSavedJobs: {
      type: Number,
      default: 0,
    },
    maxActiveJobs: {
      type: Number,
      default: 0,
    },
    stripePriceId: String,
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true, strict: false },
);

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    planId: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "trialing", "past_due", "canceled", "incomplete"],
      default: "active",
      index: true,
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    canceledAt: Date,
  },
  { timestamps: true, strict: false },
);

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    planId: {
      type: String,
      required: true,
      index: true,
    },
    subscriptionId: {
      type: String,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    provider: {
      type: String,
      default: "stripe",
    },
    providerPaymentId: String,
    transactionId: String,
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "paid",
      index: true,
    },
  },
  { timestamps: true, strict: false },
);

const User = mongoose.models.User || mongoose.model("User", userSchema, "user");
const Session =
  mongoose.models.Session || mongoose.model("Session", sessionSchema, "session");
const Company =
  mongoose.models.Company || mongoose.model("Company", companySchema);
const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);
const Application =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);
const Plan = mongoose.models.Plan || mongoose.model("Plan", planSchema);
const Subscription =
  mongoose.models.Subscription ||
  mongoose.model("Subscription", subscriptionSchema);
const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

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

const userIdentityQuery = (userId) => {
  const query = [{ id: userId }];

  if (mongoose.Types.ObjectId.isValid(userId)) {
    query.push({ _id: userId });
  }

  return { $or: query };
};

const getUserId = (user) => {
  return user?.id ?? user?._id?.toString();
};

const isSameUser = (currentUser, userId) => {
  return getUserId(currentUser) === userId || currentUser?._id?.toString() === userId;
};

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

const normalizeCompanyStatus = (status) => {
  if (status === "verified") return "approved";
  return status;
};

const parseBoolean = (value) => {
  if (value === undefined) return undefined;
  return value === true || value === "true";
};

const buildJobQuery = (queryParams) => {
  const query = {};

  if (queryParams.search) {
    query.$or = [
      { jobTitle: { $regex: queryParams.search, $options: "i" } },
      { companyName: { $regex: queryParams.search, $options: "i" } },
      { location: { $regex: queryParams.search, $options: "i" } },
    ];
  }

  if (queryParams.jobType) query.jobType = queryParams.jobType;
  if (queryParams.type) query.jobType = queryParams.type;
  if (queryParams.jobCategory) query.jobCategory = queryParams.jobCategory;
  if (queryParams.category) query.jobCategory = queryParams.category;
  if (queryParams.companyId) query.companyId = queryParams.companyId;
  if (queryParams.recruiterId) query.recruiterId = queryParams.recruiterId;
  if (queryParams.status) query.status = queryParams.status;
  if (queryParams.location) {
    query.location = { $regex: queryParams.location, $options: "i" };
  }

  const isRemote = parseBoolean(queryParams.isRemote);
  if (isRemote !== undefined) query.isRemote = isRemote;

  return query;
};

const pickFields = (source, fields) => {
  return fields.reduce((picked, field) => {
    if (source[field] !== undefined) picked[field] = source[field];
    return picked;
  }, {});
};

const editableCompanyFields = [
  "name",
  "industry",
  "websiteUrl",
  "location",
  "employeeCount",
  "logoUrl",
  "description",
];

const isApprovedCompany = (company) => {
  return ["approved", "verified"].includes(company?.status);
};

const withApplicantCounts = async (jobs) => {
  const plainJobs = jobs.map((job) =>
    typeof job.toObject === "function" ? job.toObject() : job,
  );
  const jobIds = plainJobs.map((job) => job._id.toString());

  if (jobIds.length === 0) {
    return plainJobs;
  }

  const counts = await Application.aggregate([
    { $match: { jobId: { $in: jobIds } } },
    { $group: { _id: "$jobId", count: { $sum: 1 } } },
  ]);
  const countMap = new Map(
    counts.map((item) => [item._id, item.count]),
  );

  return plainJobs.map((job) => ({
    ...job,
    applicantsCount: countMap.get(job._id.toString()) ?? 0,
  }));
};

const getSavedJobsForUser = async (user) => {
  const savedJobs = Array.isArray(user?.savedJobs) ? user.savedJobs : [];
  const jobIds = savedJobs
    .map((item) => item.jobId)
    .filter((jobId) => mongoose.Types.ObjectId.isValid(jobId));

  if (jobIds.length === 0) {
    return [];
  }

  const jobs = await Job.find({
    _id: { $in: jobIds },
    status: { $ne: "removed" },
  }).lean();
  const jobMap = new Map(jobs.map((job) => [job._id.toString(), job]));

  return savedJobs
    .map((item) => {
      const job = jobMap.get(item.jobId);
      if (!job) return null;

      return {
        ...job,
        savedAt: item.savedAt,
      };
    })
    .filter(Boolean);
};

app.get("/", (req, res) => {
  res.send("Server is cooking!");
});

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

app.patch(
  "/api/users/:id/role",
  verifyToken,
  verifyRole("admin"),
  async (req, res) => {
    try {
      const { role } = req.body;

      if (!["seeker", "recruiter", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const updatedUser = await User.findOneAndUpdate(
        userIdentityQuery(req.params.id),
        { role },
        { new: true },
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("[users:update-role]", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

app.patch(
  "/api/users/:id/status",
  verifyToken,
  verifyRole("admin"),
  async (req, res) => {
    try {
      const { status } = req.body;

      if (!["active", "suspended"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const updatedUser = await User.findOneAndUpdate(
        userIdentityQuery(req.params.id),
        { status },
        { new: true },
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("[users:update-status]", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

app.get("/api/companies", async (req, res) => {
  try {
    const query = {};

    if (req.query.status) {
      query.status = normalizeCompanyStatus(req.query.status);
    }

    const companies = await Company.find(query).sort({ createdAt: -1 });
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
      const recruiterId = req.body.recruiterId;

      if (!recruiterId || !isSameUser(req.user, recruiterId)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const company = await Company.create({
        ...req.body,
        recruiterId,
        status: "pending",
      });

      res.status(201).json(company);
    } catch (error) {
      console.error("[companies:create]", error);
      res.status(500).json({ message: error.message });
    }
  },
);

app.patch(
  "/api/companies/:id",
  verifyToken,
  verifyRole("recruiter", "admin"),
  async (req, res) => {
    try {
      const company = await Company.findById(req.params.id);

      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      if (req.user.role !== "admin" && !isSameUser(req.user, company.recruiterId)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const updates = pickFields(req.body, editableCompanyFields);

      if (req.user.role === "admin" && req.body.status !== undefined) {
        const status = normalizeCompanyStatus(req.body.status);

        if (!["pending", "approved", "rejected"].includes(status)) {
          return res.status(400).json({ message: "Invalid company status" });
        }

        updates.status = status;
      }

      Object.assign(company, updates);
      await company.save();

      res.status(200).json(company);
    } catch (error) {
      console.error("[companies:update]", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

app.patch(
  "/api/companies/:id/status",
  verifyToken,
  verifyRole("admin"),
  async (req, res) => {
    try {
      const status = normalizeCompanyStatus(req.body.status);

      if (!["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid company status" });
      }

      const company = await Company.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true },
      );

      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      res.status(200).json(company);
    } catch (error) {
      console.error("[companies:update-status]", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

app.get("/api/companies/recruiter/:recruiterId", async (req, res) => {
  try {
    const companies = await Company.find({
      recruiterId: req.params.recruiterId,
    }).sort({ createdAt: -1 });

    res.status(200).json(companies);
  } catch (error) {
    console.error("[companies:get-by-recruiter]", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/api/companies/:recruiterId", async (req, res) => {
  try {
    const companies = await Company.find({
      recruiterId: req.params.recruiterId,
    }).sort({ createdAt: -1 });

    res.status(200).json(companies);
  } catch (error) {
    console.error("[companies:get-by-recruiter]", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/api/jobs", async (req, res) => {
  try {
    const query = buildJobQuery(req.query);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const perPage = Math.min(
      Math.max(parseInt(req.query.perPage, 10) || 12, 1),
      100,
    );
    const skip = (page - 1) * perPage;

    const [total, jobDocs] = await Promise.all([
      Job.countDocuments(query),
      Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(perPage),
    ]);
    const jobs = await withApplicantCounts(jobDocs);

    res.status(200).json({ total, page, perPage, jobs });
  } catch (error) {
    console.error("[jobs:get]", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/api/jobs", verifyToken, verifyRole("recruiter"), async (req, res) => {
  try {
    const recruiterId = req.body.recruiterId;

    if (!recruiterId || !isSameUser(req.user, recruiterId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const company = await Company.findById(req.body.companyId);

    if (!company || !isSameUser(req.user, company.recruiterId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!isApprovedCompany(company)) {
      return res.status(400).json({
        message: "Company must be approved before posting jobs",
      });
    }

    const job = await Job.create({
      ...req.body,
      companyName: company.name,
      recruiterId,
      status: req.body.status ?? "active",
    });

    res.status(201).json(job);
  } catch (error) {
    console.error("[jobs:create]", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/api/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const [jobWithCount] = await withApplicantCounts([job]);

    res.status(200).json(jobWithCount);
  } catch (error) {
    console.error("[jobs:get-by-id]", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.patch(
  "/api/jobs/:id",
  verifyToken,
  verifyRole("recruiter", "admin"),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      if (req.user.role !== "admin" && !isSameUser(req.user, job.recruiterId)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const updates = { ...req.body };
      delete updates.companyName;

      if (updates.companyId && updates.companyId !== job.companyId) {
        const company = await Company.findById(updates.companyId);

        if (!company || !isSameUser(req.user, company.recruiterId)) {
          return res.status(403).json({ message: "Forbidden" });
        }

        if (!isApprovedCompany(company)) {
          return res.status(400).json({
            message: "Company must be approved before posting jobs",
          });
        }

        updates.companyName = company.name;
      }

      delete updates.recruiterId;
      Object.assign(job, updates);
      await job.save();

      const [jobWithCount] = await withApplicantCounts([job]);

      res.status(200).json(jobWithCount);
    } catch (error) {
      console.error("[jobs:update]", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

app.delete(
  "/api/jobs/:id",
  verifyToken,
  verifyRole("recruiter", "admin"),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      if (req.user.role !== "admin" && !isSameUser(req.user, job.recruiterId)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      await job.deleteOne();
      res.status(200).json({ message: "Job removed" });
    } catch (error) {
      console.error("[jobs:delete]", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

app.get(
  "/api/applications",
  verifyToken,
  verifyRole("seeker", "recruiter", "admin"),
  async (req, res) => {
    try {
      const query = {};

      if (req.query.applicantId) {
        if (
          req.user.role === "seeker" &&
          !isSameUser(req.user, req.query.applicantId)
        ) {
          return res.status(403).json({ message: "Forbidden" });
        }

        query.applicantId = req.query.applicantId;
      }

      if (req.user.role === "seeker" && !query.applicantId) {
        query.applicantId = getUserId(req.user);
      }

      if (req.user.role === "recruiter") {
        if (req.query.jobId) {
          const job = await Job.findById(req.query.jobId).lean();

          if (!job || !isSameUser(req.user, job.recruiterId)) {
            return res.status(403).json({ message: "Forbidden" });
          }

          query.jobId = req.query.jobId;
        } else {
          const jobs = await Job.find({
            recruiterId: getUserId(req.user),
          }).select("_id");

          query.jobId = {
            $in: jobs.map((job) => job._id.toString()),
          };
        }
      } else if (req.query.jobId) {
        query.jobId = req.query.jobId;
      }

      if (req.query.status) query.status = req.query.status;

      const applications = await Application.find(query).sort({
        createdAt: -1,
      });

      res.status(200).json(applications);
    } catch (error) {
      console.error("[applications:get]", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

app.post(
  "/api/applications",
  verifyToken,
  verifyRole("seeker"),
  async (req, res) => {
    try {
      const applicantId = req.body.applicantId;

      if (!applicantId || !isSameUser(req.user, applicantId)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const application = await Application.create({
        ...req.body,
        applicantId,
        status: "applied",
      });

      await User.findByIdAndUpdate(req.user._id, {
        $inc: { applicationsUsedThisMonth: 1 },
      });

      res.status(201).json(application);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ message: "Application already exists" });
      }

      console.error("[applications:create]", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

app.patch(
  "/api/applications/:id/status",
  verifyToken,
  verifyRole("recruiter", "admin"),
  async (req, res) => {
    try {
      const { status } = req.body;

      if (
        ![
          "applied",
          "under_review",
          "shortlisted",
          "rejected",
          "offered",
        ].includes(status)
      ) {
        return res.status(400).json({ message: "Invalid application status" });
      }

      const application = await Application.findById(req.params.id);

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      if (req.user.role === "recruiter") {
        const job = await Job.findById(application.jobId);

        if (!job || !isSameUser(req.user, job.recruiterId)) {
          return res.status(403).json({ message: "Forbidden" });
        }
      }

      application.status = status;
      await application.save();

      res.status(200).json(application);
    } catch (error) {
      console.error("[applications:update-status]", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

app.get(
  "/api/saved-jobs",
  verifyToken,
  verifyRole("seeker"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id).lean();
      const savedJobs = await getSavedJobsForUser(user);

      res.status(200).json(savedJobs);
    } catch (error) {
      console.error("[saved-jobs:get]", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

app.post(
  "/api/saved-jobs/:jobId",
  verifyToken,
  verifyRole("seeker"),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.jobId).lean();

      if (!job || job.status !== "active") {
        return res.status(404).json({ message: "Job not found" });
      }

      const user = await User.findById(req.user._id);
      const savedJobs = Array.isArray(user.savedJobs) ? user.savedJobs : [];
      const existing = savedJobs.find((item) => item.jobId === req.params.jobId);

      if (!existing) {
        savedJobs.push({ jobId: req.params.jobId, savedAt: new Date() });
        user.savedJobs = savedJobs;
        await user.save();
      }

      const savedJob = await getSavedJobsForUser(user.toObject());
      const saved = savedJob.find((item) => item._id.toString() === req.params.jobId);

      res.status(200).json(saved ?? { ...job, savedAt: new Date() });
    } catch (error) {
      console.error("[saved-jobs:add]", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

app.delete(
  "/api/saved-jobs/:jobId",
  verifyToken,
  verifyRole("seeker"),
  async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { savedJobs: { jobId: req.params.jobId } },
      });

      res.status(200).json({ message: "Saved job removed" });
    } catch (error) {
      console.error("[saved-jobs:delete]", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

app.get("/api/plans", async (req, res) => {
  try {
    if (req.query.planId) {
      const plan = await Plan.findOne({ planId: req.query.planId });

      if (!plan) {
        return res.status(404).json({ message: "Plan not found" });
      }

      return res.status(200).json(plan);
    }

    const query = {};
    if (req.query.audience) query.audience = req.query.audience;
    if (req.query.active !== undefined) {
      query.active = req.query.active === "true";
    }

    const plans = await Plan.find(query).sort({ price: 1, createdAt: 1 });
    return res.status(200).json(plans);
  } catch (error) {
    console.error("[plans:get]", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/api/plans/:planId", async (req, res) => {
  try {
    const plan = await Plan.findOne({ planId: req.params.planId });

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json(plan);
  } catch (error) {
    console.error("[plans:get-by-id]", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/api/plans", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({ message: "Plan id is required" });
    }

    const plan = await Plan.findOneAndUpdate({ planId }, req.body, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });

    res.status(200).json(plan);
  } catch (error) {
    console.error("[plans:upsert]", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get(
  "/api/subscriptions",
  verifyToken,
  verifyRole("seeker", "recruiter", "admin"),
  async (req, res) => {
    try {
      const query = {};

      if (req.user.role !== "admin") {
        query.userId = getUserId(req.user);
      }

      if (req.query.userId) {
        if (req.user.role !== "admin" && !isSameUser(req.user, req.query.userId)) {
          return res.status(403).json({ message: "Forbidden" });
        }

        query.userId = req.query.userId;
      }

      if (req.query.status) query.status = req.query.status;

      const subscriptions = await Subscription.find(query).sort({
        createdAt: -1,
      });

      res.status(200).json(subscriptions);
    } catch (error) {
      console.error("[subscriptions:get]", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

app.post(
  "/api/subscriptions",
  verifyToken,
  verifyRole("seeker", "recruiter"),
  async (req, res) => {
    try {
      const userId = req.body.userId ?? getUserId(req.user);

      if (!isSameUser(req.user, userId)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const subscription = await Subscription.create({
        ...req.body,
        userId,
        email: req.body.email ?? req.user.email,
        status: req.body.status ?? "active",
      });

      await User.findOneAndUpdate(userIdentityQuery(userId), {
        plan: req.body.planId,
      });

      let payment = null;

      if (req.body.amount !== undefined) {
        payment = await Payment.create({
          userId,
          email: req.body.email ?? req.user.email,
          planId: req.body.planId,
          subscriptionId: subscription._id.toString(),
          amount: req.body.amount,
          currency: req.body.currency ?? "USD",
          providerPaymentId: req.body.providerPaymentId,
          transactionId: req.body.transactionId,
          status: req.body.paymentStatus ?? "paid",
        });
      }

      res.status(201).json({ subscription, payment });
    } catch (error) {
      console.error("[subscriptions:create]", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

app.patch(
  "/api/subscriptions/:id/cancel",
  verifyToken,
  verifyRole("seeker", "recruiter", "admin"),
  async (req, res) => {
    try {
      const subscription = await Subscription.findById(req.params.id);

      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }

      if (
        req.user.role !== "admin" &&
        !isSameUser(req.user, subscription.userId)
      ) {
        return res.status(403).json({ message: "Forbidden" });
      }

      subscription.status = "canceled";
      subscription.canceledAt = new Date();
      await subscription.save();

      res.status(200).json(subscription);
    } catch (error) {
      console.error("[subscriptions:cancel]", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

app.get(
  "/api/payments",
  verifyToken,
  verifyRole("seeker", "recruiter", "admin"),
  async (req, res) => {
    try {
      const query = {};

      if (req.user.role !== "admin") {
        query.userId = getUserId(req.user);
      }

      if (req.query.userId) {
        if (req.user.role !== "admin" && !isSameUser(req.user, req.query.userId)) {
          return res.status(403).json({ message: "Forbidden" });
        }

        query.userId = req.query.userId;
      }

      if (req.query.status) query.status = req.query.status;
      if (req.query.planId) query.planId = req.query.planId;

      const payments = await Payment.find(query).sort({ createdAt: -1 });
      res.status(200).json(payments);
    } catch (error) {
      console.error("[payments:get]", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

app.post(
  "/api/payments",
  verifyToken,
  verifyRole("seeker", "recruiter", "admin"),
  async (req, res) => {
    try {
      const userId = req.body.userId ?? getUserId(req.user);

      if (req.user.role !== "admin" && !isSameUser(req.user, userId)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const payment = await Payment.create({
        ...req.body,
        userId,
        email: req.body.email ?? req.user.email,
      });

      res.status(201).json(payment);
    } catch (error) {
      console.error("[payments:create]", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

app.patch(
  "/api/payments/:id/status",
  verifyToken,
  verifyRole("admin"),
  async (req, res) => {
    try {
      const { status } = req.body;

      if (!["pending", "paid", "failed", "refunded"].includes(status)) {
        return res.status(400).json({ message: "Invalid payment status" });
      }

      const payment = await Payment.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true },
      );

      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      res.status(200).json(payment);
    } catch (error) {
      console.error("[payments:update-status]", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

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
