/**
 * Shared presentation-formatting utilities.
 *
 * Responsibilities:
 * - Format values consistently for display across the application.
 * - Provide reusable formatting for chart labels, tooltips, receipts,
 *   and other UI where appropriate.
 *
 * Implementation notes:
 * - Keep these functions presentation-focused.
 * - Do not perform methodology calculations or mutate application state.
 */

function formatNumber(value, decimals, minimumDecimals = decimals) {
	return new Intl.NumberFormat('en-US', {
		minimumFractionDigits: minimumDecimals,
		maximumFractionDigits: decimals
	}).format(value);
}

/**
 * A chart value (tooltips, bar totals): percentages of GDP to two decimals,
 * dollar values (stored in millions) in billions. Dollar values that round
 * to nothing show as "<$0.01B", and zero as "$0".
 */
export function formatChartValue(value, unit) {
	if (unit === 'pct_gdp') {
		const percentage = value * 100;
		return `${formatNumber(percentage, 2)}%`;
	}

	if (value === 0) return '$0';

	const billions = value / 1000;

	if (Math.abs(billions) < 0.01) return '<$0.01B';

	return `$${formatNumber(billions, 2)}B`;
}

/**
 * An axis label: whole numbers where the ticks allow it (approved chart
 * design), otherwise only the decimals the tick needs (e.g. "0.2%").
 */
export function formatChartAxisValue(value, unit) {
	if (unit === 'pct_gdp') {
		// Round away floating-point noise (0.1 + 0.2) before formatting.
		const percentage = Math.round(value * 100 * 1000) / 1000;

		return `${formatNumber(percentage, 2, 0)}%`;
	}

	return `$${formatNumber(value / 1000, 2, 0)}B`;
}

// Possessive form of a name for chart titles: "China’s", "United States’".
export function possessive(name) {
	return name.endsWith('s') ? `${name}’` : `${name}’s`;
}
