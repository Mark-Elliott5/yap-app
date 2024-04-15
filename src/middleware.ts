import {
  apiAuthPrefix,
  apiUploadPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_REGISTER_REDIRECT,
  publicRoutes,
} from '@/src/routes';

import { auth } from './app/api/auth/[...nextauth]/auth';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.has(nextUrl.pathname);
  const isUploadRoute = nextUrl.pathname.startsWith(apiUploadPrefix);

  if (isApiAuthRoute || isPublicRoute) return;
  if (isUploadRoute) return;

  if (isLoggedIn) {
    console.log(req.auth);
    if (
      !req.auth?.user.username &&
      nextUrl.pathname !== DEFAULT_REGISTER_REDIRECT
    ) {
      return Response.redirect(new URL(DEFAULT_REGISTER_REDIRECT, nextUrl));
    }
    if (
      nextUrl.pathname === DEFAULT_REGISTER_REDIRECT &&
      req.auth?.user.username
    ) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
  }

  const isAuthRoute = authRoutes.has(nextUrl.pathname);

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL('/login', nextUrl));
  }
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
