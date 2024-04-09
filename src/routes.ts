/**
 * Routes that are accessible to logged out users
 */
const publicRoutes = new Set(['/', '/login', '/register']);

/**
 * Authentication routes.
 * Should redirect logged in users to /settings
 */
const authRoutes = new Set(['/login', '/register']);

/**
 * Prefix for authentication routes
 */
const apiAuthPrefix = '/api/auth';

/**
 * Default login redirect path
 */
const DEFAULT_LOGIN_REDIRECT = '/settings';

export { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes };
