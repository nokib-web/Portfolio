export const appConfig = {
  // Toggle this to true to use the 2D Galaxy Landing page
  // Set to false for the standard card-based grid (performance/fallback mode)
  useGalaxyLanding: true,
  // API base URL loaded from environment variables
  // Use relative path '' in production if not explicitly set, so it hits the same domain (/api/...)
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL !== undefined 
    ? import.meta.env.VITE_API_BASE_URL 
    : (import.meta.env.PROD ? '' : 'http://localhost:5000'),
};
