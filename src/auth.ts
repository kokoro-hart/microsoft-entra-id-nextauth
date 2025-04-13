import NextAuth from "next-auth";

import { authConfig } from "./auth.config";

const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);

export { GET, POST, auth, signIn, signOut };
