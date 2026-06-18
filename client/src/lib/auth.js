import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

if (!process.env.MONGO_DB_URI) {
  throw new Error("Missing environment variable: MONGO_DB_URI");
}

const client = new MongoClient(process.env.MONGO_DB_URI);
const db = client.db("seekcruitr");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
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
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
});
