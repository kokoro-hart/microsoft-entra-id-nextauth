/* eslint-disable */

import type { DefaultSession } from "next-auth";

import "@auth/core/jwt";

export interface AppSession {
  error?: string | null;
}

export interface AppJWT {
  idToken?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  emailVerified: Date | null;
  error?: string;
}

declare module "next-auth" {
  interface Session extends DefaultSession, AppSession {}
}

declare module "@auth/core/jwt" {
  interface JWT extends AppJWT {}
}
