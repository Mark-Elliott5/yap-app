import { auth } from '@/src/app/api/auth/[...nextauth]/auth';
import {
  apiAuthPrefix,
  apiUploadPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_REGISTER_REDIRECT,
  publicRoutes,
} from '@/src/routes';

export default auth((req) => {
  const { nextUrl } = req;
  console.log('MIDDLEWARE RUNNING', nextUrl.pathname);
  // console.log('PATHNAME:', nextUrl.pathname);
  const isLoggedIn = !!req.auth;
  // console.log('REQ.AUTH:', req.auth);

  const isRoot = nextUrl.pathname === '/';
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.has(nextUrl.pathname);
  const isUploadRoute = nextUrl.pathname.startsWith(apiUploadPrefix);

  if (isRoot) {
    if (isLoggedIn) {
      return Response.redirect(new URL('/home', nextUrl));
    }
    return Response.redirect(new URL('/login', nextUrl));
  }

  if (isApiAuthRoute || isPublicRoute) {
    // console.log('ISAPIAUTHROUTE/PUBLICROUTE RETURN');
    return;
  }
  if (isUploadRoute) {
    // console.log('ISUPLOADROUTE RETURN');
    return;
  }

  const isAuthRoute = authRoutes.has(nextUrl.pathname);

  if (isAuthRoute) {
    if (isLoggedIn) {
      // console.log('redirected to /settings');
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    // console.log('ISAUTHROUTE RETURN');
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    // console.log('redirected to /login');
    return Response.redirect(new URL('/login', nextUrl));
  }

  if (
    req.auth &&
    !req.auth.user.username &&
    nextUrl.pathname !== DEFAULT_REGISTER_REDIRECT
  ) {
    // console.log('redirected to /onboarding');
    return Response.redirect(new URL(DEFAULT_REGISTER_REDIRECT, nextUrl));
  }
  if (
    req.auth &&
    req.auth.user.username &&
    nextUrl.pathname === DEFAULT_REGISTER_REDIRECT
  ) {
    // console.log('redirected to /settings');
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  // console.log('not redirected');
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|images|favicon.ico|icon.svg).*)',
  ],
};
