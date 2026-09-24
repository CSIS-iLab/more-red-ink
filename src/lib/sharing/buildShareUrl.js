/**
 * Serializes a calculator configuration into a shareable URL.
 *
 * Responsibilities:
 * - Convert the shareable parts of calculator state into URL parameters.
 * - Produce a URL that can reconstruct the same estimate and chart settings.
 *
 * Implementation notes:
 * - Serialize user choices and display settings, not calculated data.
 * - Keep URL parameter naming and encoding logic centralized here.
 * - Do not calculate estimates or format receipt content here.
 */