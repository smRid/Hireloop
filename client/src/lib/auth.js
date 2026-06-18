import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";

const mongoUri = process.env.MONGO_DB_URI ?? "mongodb://127.0.0.1:27017/hireloop";
const googleCredentials =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
    : undefined;

const client = new MongoClient(mongoUri);
const db = client.db("hireloop");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.NEXT_PUBLIC_AUTH_BASE_URL,
  trustedOrigins: [process.env.NEXT_PUBLIC_AUTH_BASE_URL].filter(Boolean),
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
  },
  socialProviders: googleCredentials,
  plugins: [admin()],
});
