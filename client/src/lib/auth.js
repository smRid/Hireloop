import { betterAuth } from "better-auth";
import { dash } from "@better-auth/infra";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";

const mongoUri = process.env.MONGO_DB_URI ?? "mongodb://127.0.0.1:27017/hireloop";
const globalForMongo = globalThis;
const client = globalForMongo.__HireloopMongoClient ?? new MongoClient(mongoUri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.__HireloopMongoClient = client;
}

const db = client.db("hireloop");
const authBaseUrl =
  process.env.BETTER_AUTH_URL ??
  process.env.NEXT_PUBLIC_AUTH_BASE_URL ??
  "http://localhost:3000";
const trustedOrigins = [
  process.env.BETTER_AUTH_URL,
  process.env.NEXT_PUBLIC_AUTH_BASE_URL,
  "http://localhost:3000",
].filter(Boolean);

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: authBaseUrl,
  trustedOrigins,
  user: {
    additionalFields: {
      role: {
        enum: ["seeker", "recruiter", "admin"],
        defaultValue: null,
      },
      status: {
        enum: ["active", "suspended"],
        defaultValue: "active",
      },
      plan: {
        enum: ["free", "pro", "premium", "growth", "enterprise"],
        defaultValue: "free",
      },
      applicationsUsedThisMonth: {
        type: "number",
        defaultValue: 0,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  account: {
    updateAccountOnSignIn: true,
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "email-password"],
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      overrideUserInfoOnSignIn: true,
    },
  },
  plugins: [
    admin({
      defaultRole: "seeker",
      adminRoles: ["admin"],
    }),
    dash({
      apiKey: process.env.BETTER_AUTH_API_KEY,
    }),
    nextCookies(),
  ],
});
