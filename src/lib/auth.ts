import { betterAuth } from "better-auth";
import { bearer } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const baseURL = getRequiredEnv("BETTER_AUTH_URL");
const parsedBaseURL = new URL(baseURL);
if (parsedBaseURL.protocol !== "http:" && parsedBaseURL.protocol !== "https:") {
  throw new Error("BETTER_AUTH_URL must use HTTP or HTTPS.");
}

const client = new MongoClient(getRequiredEnv("MONGODB_URI"));
const db = client.db("studio-space");

export const auth = betterAuth({
  baseURL,
  secret: getRequiredEnv("BETTER_AUTH_SECRET"),
  trustedOrigins: [baseURL],
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 8,
  },
  socialProviders: {
    google: {
      clientId: getRequiredEnv("GOOGLE_CLIENT_ID"),
      clientSecret: getRequiredEnv("GOOGLE_CLIENT_SECRET"),
    },
  },
  database: mongodbAdapter(db, { client }),
  plugins: [bearer()],
});