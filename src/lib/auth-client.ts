import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Leave empty if BetterAuth runs inside the same Next.js app.
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});