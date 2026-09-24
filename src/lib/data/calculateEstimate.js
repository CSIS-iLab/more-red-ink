/**
 * Resolves source data into an estimate using the user's assumptions.
 *
 * Responsibilities:
 * - Apply MRI methodology and business rules.
 * - Map user assumptions to the appropriate source-data columns.
 * - Resolve methodology-specific source fields into the canonical
 *   spending components.
 * - Calculate totals where appropriate.
 * - Return the resolved long-form estimate used by the visualizer.
 *
 * Implementation notes:
 * - This is the primary boundary between raw spreadsheet structure
 *   and the rest of the application.
 * - Charts should not need to know methodology-specific spreadsheet
 *   column names.
 * - Do not mutate calculator state or source data here.
 */
