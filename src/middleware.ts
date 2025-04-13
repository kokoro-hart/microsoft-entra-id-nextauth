import { auth } from "./auth";

const ROUTES = {
  PUBLIC: [],
  AUTH: ["/signin"],
  PROTECTED: ["/"],
};

function isProtectedRoute(path: string) {
  return ROUTES.PROTECTED.includes(path);
}

function isAuthRoute(path: string) {
  return ROUTES.AUTH.includes(path);
}

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const pathname = nextUrl.pathname;

  const isLoggedIn = !!session;

  // 認証が必要なページにアクセスした場合
  // ログインしている場合はアクセスを許可し、未ログインの場合はログインページにリダイレクト
  if (isProtectedRoute(pathname) && (!isLoggedIn || session?.error)) {
    return Response.redirect(new URL("/signin", nextUrl));
  }

  // 認証済みで認証ページにアクセスした場合は、TOP にリダイレクト
  if (isAuthRoute(pathname) && isLoggedIn) {
    return Response.redirect(new URL("/", nextUrl));
  }
});

export const config = {
  // middleware対象を指定（apiや静的ファイル等は除外）
  matcher: ["/((?!api|_next/static|_next/image|.png).*)"],
};
