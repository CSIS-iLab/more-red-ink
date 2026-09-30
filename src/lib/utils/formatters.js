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
	return Math.round(value * 1000) / 10;
}

export function formatChartValue(value, unit) {
	if (unit === 'pct_gdp') {
		const percentage = value * 100;

		return `${formatNumber(percentage, 2)}%`;
	}

	return `$${formatNumber(value, 1)}M`;
}

export function formatChartAxisValue(value, unit) {
	if (unit === 'pct_gdp') {
		const percentage = getPercentage(value);

		return `${formatNumber(percentage, 1)}%`;
	}

	return `$${formatNumber(value, 0)}M`;
}
