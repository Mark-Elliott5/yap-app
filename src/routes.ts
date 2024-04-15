/**
 * Routes that are accessible to logged out users
 */
const publicRoutes = new Set(['/']);

/**
 * Authentication routes.
 * Should redirect logged in users to /settings
 */
const authRoutes = new Set(['/login', '/register', '/authentication-error']);

/**
 * Prefix for authentication routes
 */
const apiAuthPrefix = '/api/auth';
const apiUploadPrefix = '/api/uploadthing';

/**
 * Default login redirect path
 */
const DEFAULT_LOGIN_REDIRECT = '/settings';

/**
 * Default register redirect path to onboard user (get their desired username and displayName)
 */
const DEFAULT_REGISTER_REDIRECT = '/onboarding';

export {
  apiAuthPrefix,
  apiUploadPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_REGISTER_REDIRECT,
  publicRoutes,
};
