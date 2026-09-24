/**
 * Reconstructs calculator configuration from a shared URL.
 *
 * Responsibilities:
 * - Read supported URL parameters.
 * - Validate and normalize shared values.
 * - Return the calculator configuration needed to recreate the shared view.
 *
 * Implementation notes:
 * - Treat URL input as untrusted and validate values before using them.
 * - Reconstruct user choices and display settings, not calculated data.
 * - Do not calculate the estimate here.
 */
