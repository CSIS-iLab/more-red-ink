/**
 * Shared hover behavior for the Visualizer and Share charts (approved
 * "chart on hover" design).
 *
 * Responsibilities:
 * - Build the hover data panel shown in chart tooltips.
 * - Stacked bars: on hover, keep the hovered bar's colors and push the
 *   other bars back to their pale (defocus) colors, gray out their totals,
 *   and darken the hovered category label.
 * - Legends: on hover, keep the hovered series' colors and push the other
 *   series back.
 *
 * Implementation notes:
 * - Each series sets custom.defocusColor (its --color-*-defocus token).
 * - Effects change SVG attributes directly and resetFocus() restores the
 *   original colors, so nothing is re-rendered.
 */

import { readToken } from './designTokens.js';

const colors = () => ({
	primary: readToken('--color-text-primary'),
	secondary: readToken('--color-text-secondary'),
	helper: readToken('--color-text-helper')
});

const defocusColor = (series) => series.options.custom?.defocusColor ?? series.color;

/**
 * The chart's live series. Highcharts fires mouse-out events while a chart
 * is being destroyed (e.g. when it re-renders under the cursor); by then
 * its series and axes are partly gone, so focus changes are skipped.
 */
const liveSeries = (chart) => (chart?.series ?? []).filter((series) => series?.points);

const escapeHtml = (text) =>
	String(text).replace(/[&<>"]/g, (character) => `&#${character.charCodeAt(0)};`);

/**
 * HTML for the hover data panel (use with tooltip.useHTML).
 *
 * rows: [{ color, name, value }]; swatch: 'square' for bar charts, 'line'
 * for line charts.
 */
export function hoverPanel(title, rows, swatch = 'square') {
	const { primary, secondary } = colors();

	const swatchStyle =
		swatch === 'line'
			? 'width: 16px; height: 3px; margin: 0 2px;'
			: 'width: 12px; height: 12px; margin: 0 2px;';

	const items = rows
		.map(
			(row) => `
				<div style="display: flex; align-items: center; gap: 4px;">
					<span style="${swatchStyle} flex-shrink: 0; background: ${row.color};"></span>
					<span>${escapeHtml(row.name)}: <span style="font-weight: 500;">${escapeHtml(row.value)}</span></span>
				</div>`
		)
		.join('');

	return `
		<div style="color: ${secondary}; font-size: 14px; line-height: 1.2;">
			<div style="margin-bottom: 6px; color: ${primary}; font-size: 16px; font-weight: 500;">
				${escapeHtml(title)}
			</div>
			<div style="display: flex; flex-direction: column; gap: 2px;">${items}</div>
		</div>`;
}

/**
 * Restore every series, total label, axis label, and legend item.
 */
export function resetFocus(chart) {
	if (!chart?.yAxis) return;

	const { primary, secondary, helper } = colors();

	for (const series of liveSeries(chart)) {
		series.graph?.attr({ stroke: series.color });

		for (const point of series.points) {
			point.graphic?.attr({ fill: point.color });
		}

		series.legendItem?.label?.css({ color: secondary, fontWeight: '400' });
		series.legendItem?.symbol?.attr({ fill: series.color });
		series.legendItem?.line?.attr({ stroke: series.color });
	}

	for (const stack of Object.values(chart.yAxis[0]?.stacking?.stacks ?? {})) {
		for (const item of Object.values(stack)) {
			item.label?.css({ color: primary });
		}
	}

	for (const tick of Object.values(chart.xAxis[0]?.ticks ?? {})) {
		tick.label?.css({ color: helper });
	}
}

/**
 * Stacked bars: focus the bar at category x.
 */
export function focusCategory(chart, x) {
	if (!chart?.yAxis) return;

	const { primary, helper } = colors();

	for (const series of liveSeries(chart)) {
		for (const point of series.points) {
			point.graphic?.attr({ fill: point.x === x ? point.color : defocusColor(series) });
		}
	}

	for (const stack of Object.values(chart.yAxis[0]?.stacking?.stacks ?? {})) {
		for (const item of Object.values(stack)) {
			item.label?.css({ color: item.x === x ? primary : helper });
		}
	}

	for (const [position, tick] of Object.entries(chart.xAxis[0]?.ticks ?? {})) {
		tick.label?.css({ color: Number(position) === x ? primary : helper });
	}
}

/**
 * Legend hover: focus one series.
 */
export function focusSeries(chart, focused) {
	if (!chart?.yAxis) return;

	const { primary, helper } = colors();

	for (const series of liveSeries(chart)) {
		const isFocused = series === focused;
		const color = isFocused ? series.color : defocusColor(series);

		series.graph?.attr({ stroke: color });

		for (const point of series.points) {
			point.graphic?.attr({ fill: isFocused ? point.color : color });
		}

		series.legendItem?.label?.css({
			color: isFocused ? primary : helper,
			fontWeight: isFocused ? '500' : '400'
		});
		series.legendItem?.symbol?.attr({ fill: color });
		series.legendItem?.line?.attr({ stroke: color });
	}
}

/**
 * Attach legend hover listeners (safe to call after every render).
 */
export function bindLegendFocus(chart) {
	for (const series of liveSeries(chart)) {
		const element = series.legendItem?.group?.element;

		if (!element || element.dataset.focusBound) continue;

		element.dataset.focusBound = 'true';
		element.addEventListener('mouseenter', () => focusSeries(chart, series));
		element.addEventListener('mouseleave', () => resetFocus(chart));
	}
}

/**
 * Chart options for stacked bars: focus the hovered bar.
 */
export const stackedBarHover = {
	plotOptions: {
		series: {
			point: {
				events: {
					mouseOver() {
						focusCategory(this.series.chart, this.x);
					},
					mouseOut() {
						resetFocus(this.series.chart);
					}
				}
			}
		}
	}
};
