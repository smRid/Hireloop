import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

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
