export const appConfig = {
  // Toggle this to true to use the 2D Galaxy Landing page
  // Set to false for the standard card-based grid (performance/fallback mode)
  useGalaxyLanding: true,
  // API base URL loaded from environment variables
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
};
