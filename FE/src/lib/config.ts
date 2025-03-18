
/**
 * Application configuration with environment variables
 * 
 * We're using import.meta.env for Vite environment variables
 * In production, these values will be replaced at build time
 */

// API configuration
export const API_CONFIG = {
  // Base URL for API requests - falls back to a default if not set
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  
  // Timeout in milliseconds for API requests
  TIMEOUT: 30000,
  
  // Whether to include credentials in API requests
  WITH_CREDENTIALS: true,
};

// Application-wide configuration
export const APP_CONFIG = {
  // Application name
  APP_NAME: 'GeniusDev',
  
  // Environment type
  ENV: import.meta.env.MODE || 'development',
  
  // Whether the app is running in production
  IS_PROD: import.meta.env.PROD,
  
  // Whether the app is running in development
  IS_DEV: import.meta.env.DEV,
  
  // Whether to enable debug logging
  DEBUG: import.meta.env.DEV || import.meta.env.VITE_DEBUG === 'true',
};

// Auth configuration
export const AUTH_CONFIG = {
  // Storage key for authentication token
  TOKEN_KEY: 'adminToken',
  
  // Expiry time for authentication token in hours
  TOKEN_EXPIRY: 24,
};
