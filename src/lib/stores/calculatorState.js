/**
 * Central state for the user's calculator choices and chart settings.
 *
 * Responsibilities:
 * - Store the active calculator mode.
 * - Store Fast Track and User Driven assumption choices.
 * - Store each chart's independent display settings.
 * - Persist calculator state to sessionStorage.
 * - Restore calculator state when the application initializes.
 *
 * Implementation notes:
 * - Store user/session choices here, not calculated results.
 * - Do not store the source dataset, resolved estimates, chart series,
 *   receipt strings, formatted labels, or spreadsheet column names.
 * - Use an initialization flag so routes can distinguish between
 *   "state has not been restored yet" and "there is no active estimate."
 * - Keep chart display settings independent from one another.
 */
