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

function formatNumber(value, decimals) {
	return new Intl.NumberFormat('en-US', {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	}).format(value);
}

function getPercentage(value) {
	return Math.round(value * 100);
}

export function formatChartValue(value, unit) {
	if (unit === 'pct_gdp') {
		const percentage = value * 100;
		return `${formatNumber(percentage, 2)}%`;
	}

	if (Math.abs(value) >= 1_000_000) {
		return `$${formatNumber(value / 1_000_000, 2)}T`;
	}

	if (Math.abs(value) >= 1000) {
		return `$${formatNumber(value / 1000, 2)}B`;
	}

	return `$${formatNumber(value, 2)}M`;
}

// Axis labels use whole numbers only (approved chart design).
export function formatChartAxisValue(value, unit) {
	if (unit === 'pct_gdp') {
		const percentage = getPercentage(value);

		return `${formatNumber(percentage, 0)}%`;
	}

	return `$${formatNumber(value / 1000, 0)}B`;
}

// Possessive form of a name for chart titles: "China’s", "United States’".
export function possessive(name) {
	return name.endsWith('s') ? `${name}’` : `${name}’s`;
}
