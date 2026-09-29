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

import Highcharts from 'highcharts';

export function formatChartValue(value, unit) {
	if (unit === 'pct_gdp') {
		const percentage = value * 100;

		return `${Highcharts.numberFormat(percentage, percentage % 1 === 0 ? 0 : 1)}%`;
	}

	return `$${Highcharts.numberFormat(value, 1)}M`;
}

export function formatChartAxisValue(value, unit) {
	if (unit === 'pct_gdp') {
		const percentage = value * 100;

		return `${Highcharts.numberFormat(percentage, percentage % 1 === 0 ? 0 : 1)}%`;
	}

	return `$${Highcharts.numberFormat(value, 0)}M`;
}
