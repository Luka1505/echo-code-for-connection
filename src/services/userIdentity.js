/**
 * Anonymous user identity management
 * Generates and stores a unique user ID in localStorage on first app load
 */

const USER_ID_KEY = 'echoUserId';

/**
 * Initialize user identity - generates UUID if not already stored
 * Call this once on app startup before any API calls
 */
export function initializeUserId() {
  const existingId = localStorage.getItem(USER_ID_KEY);
  
  if (!existingId) {
    // Generate new UUID using Web Crypto API
    const newId = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, newId);
  }
}

/**
 * Get the current user's ID
 * @returns {string} The user's unique ID
 */
export function getUserId() {
  let userId = localStorage.getItem(USER_ID_KEY);
  
  // Fallback: if somehow not found, generate and store one
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  
  return userId;
}
