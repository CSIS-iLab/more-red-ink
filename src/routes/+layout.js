/**
 * Root layout data loader.
 *
 * Responsibilities:
 * - Load application-wide source data needed by child routes.
 * - Make shared data available through the root layout.
 *
 * Implementation notes:
 * - Source data should be loaded through loadData.js.
 * - Keep route-specific behavior out of this file.
 */
export const prerender = true;
export const ssr = false;