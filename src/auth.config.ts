import jwt, { JwtPayload } from "jsonwebtoken";

import type { NextAuthConfig } from "next-auth";
import { ConfidentialClientApplication } from "@azure/msal-node";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

const LoggerMessages = {
  emptyAccessToken: "アクセストークンが取得できませんでした",
  emptySub: "ユーザー識別子 (sub) が取得できませんでした",
  expiredAccessToken: "アクセストークンの有効期限が切れています",
  startedToRefreshAccessToken: "アクセストークンの更新を開始します",
  failedToRefreshAccessToken: "アクセストークンの更新に失敗しました",
  successToRefreshAccessToken: "アクセストークンの更新に成功しました",
} as const;

export const ErrorCodes = {
  emptyAccessToken: "EMPTY_ACCESS_TOKEN",
  emptySub: "EMPTY_SUB",
  failedToRefreshAccessToken: "FAILED_TO_REFRESH_ACCESS_TOKEN",
} as const;

const msalInstance = new ConfidentialClientApplication({
  auth: {
    clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}/v2.0`,
    clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
  },
});

/**
 * refreshAccessToken
 * リフレッシュトークンを使用してアクセストークンを更新
 *
 * @param refreshToken - リフレッシュトークン
 */
async function refreshAccessToken(refreshToken: string) {
  console.log("refreshAccessToken", LoggerMessages.startedToRefreshAccessToken);
  try {
    const response = await msalInstance.acquireTokenByRefreshToken({
      refreshToken,
      scopes: ["openid", "profile", "email"],
    });

    if (!response?.accessToken) {
      throw new Error(LoggerMessages.failedToRefreshAccessToken);
    }
    console.log("refreshAccessToken", LoggerMessages.successToRefreshAccessToken);

    return {
      idToken: response.idToken,
      accessToken: response.accessToken,
      expiresAt: response.expiresOn?.getTime() ?? Date.now() + 3600 * 1000,
    };
  } catch (error) {
    console.error("refreshAccessToken", LoggerMessages.failedToRefreshAccessToken, error);
    return null;
  }
}

/**
 * NextAuth（Auth.js）の設定
 */
export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}/v2.0`,
      authorization: {
        params: {
          scope: "openid profile email offline_access",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        const { id_token, access_token, refresh_token, expires_in } = account;
        if (id_token) {
          const decoded = jwt.decode(id_token) as JwtPayload;
          token.emailVerified = decoded?.email_verified ?? null;
        }
        token.accessToken = access_token ?? token.accessToken;
        token.refreshToken = refresh_token ?? token.refreshToken;
        token.expiresAt = expires_in ? Date.now() + expires_in * 1000 : token.expiresAt;
        token.error = undefined;
      }

      if (profile) {
        token.sub = profile.sub ?? token.sub;
        token.email = profile.email ?? token.email;
        token.name = profile.name ?? token.name;
      }

      if (!token.accessToken) {
        console.error("authConfig.callback.jwt", LoggerMessages.emptyAccessToken);
        token.error = ErrorCodes.emptyAccessToken;
      }

      if (!token.sub) {
        console.error("authConfig.callback.jwt", LoggerMessages.emptySub);
        token.error = ErrorCodes.emptySub;
      }

      // アクセストークンの有効期限が切れている場合
      // リフレッシュトークンを使用してトークンを更新
      const isExpiredToken = token.expiresAt && Date.now() >= token.expiresAt;
      if (isExpiredToken && token.refreshToken) {
        const refreshedTokens = await refreshAccessToken(token.refreshToken);
        if (refreshedTokens && refreshedTokens.accessToken) {
          token.idToken = refreshedTokens.idToken;
          token.accessToken = refreshedTokens.accessToken;
          token.expiresAt = refreshedTokens.expiresAt;
          token.error = undefined;
        } else {
          token.error = ErrorCodes.failedToRefreshAccessToken;
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.sub!,
        name: token.name!,
        email: token.email!,
        emailVerified: token.emailVerified ?? null,
      };
      session.error = token.error ?? null;
      return session;
    },
  },
};
