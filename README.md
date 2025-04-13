![microsoft-icon](./public/microsoft.svg)

# Microsoft Entra ID + Next.js (Auth.js) Example

This repository demonstrates how to implement authentication using **Microsoft Entra ID** (formerly Azure AD) with **Next.js App Router** and **Auth.js** (formerly NextAuth.js).

## Tech Stack

- [Next.js 15 App Router](https://nextjs.org/docs/app)
- [Auth.js](https://authjs.dev/) (NextAuth v5)
- [Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/)
- [@azure/msal-node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node)
- [Tailwind CSS](https://tailwindcss.com/)
- TypeScript / ESLint / Prettier

---

## Features

- Login with Microsoft account using OAuth2 / OIDC
- Access token refresh via refresh token using MSAL
- Protected pages with authentication guard
- Route control via middleware
- Session display with tokens
