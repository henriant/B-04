import { useEffect, useState } from "react";
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  fetchOptions: {
    credentials: "include",
  },
});
export const { signIn, signUp, signOut, deleteUser } = authClient;

export function useAuthSession() {
  const sessionAtom = authClient.$store.atoms.session;
  const [sessionState, setSessionState] = useState<ReturnType<typeof sessionAtom.get>>({
    ...sessionAtom.get(),
    data: null,
    isPending: true,
  });

  useEffect(() => {
    return sessionAtom.subscribe(setSessionState);
  }, [sessionAtom]);

  return sessionState;
}
