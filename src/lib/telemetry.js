/**
 * Lightweight telemetry and logging for OneClickFix.
 * Centralizes error reporting and performance tracking for production.
 */

const IS_PROD = import.meta.env.PROD;

export const telemetry = {
  /**
   * Log an error to the console and potentially to an external service (Sentry, etc.)
   */
  error: (context, message, data = {}) => {
    console.error(`[Telemetry][${context}] ${message}`, data);
    
    if (IS_PROD) {
      // TODO: Integrate with Sentry or custom logging API
      // Example: Sentry.captureException(new Error(message), { extra: data });
    }
  },

  /**
   * Track performance metrics (like API response times)
   */
  trackTiming: (name, durationMs, data = {}) => {
    if (!IS_PROD) {
      console.log(`[Telemetry][Timing] ${name}: ${durationMs.toFixed(1)}ms`, data);
    }
    
    // TODO: Send to analytics (Google Analytics, Mixpanel, etc.)
  },

  /**
   * Log user-facing events or business logic checkpoints
   */
  log: (context, message, data = {}) => {
    if (!IS_PROD) {
      console.log(`[Telemetry][${context}] ${message}`, data);
    }
  }
};
