import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:8789",
});

export const { signIn, signUp, useSession } = authClient;