/**
 * Shared Highcharts styling for the Visualizer and Share charts.
 *
 * Responsibilities:
 * - Apply the approved chart typography, colors, gridlines, and legend
 *   styling to every chart.
 * - Keep the plot area at the approved aspect ratio for each viewport.
 * - Resolve design-token colors for Highcharts, which needs actual color
 *   values rather than CSS variables.
 *
 * Implementation notes:
 * - Colors and fonts are read from the CSS custom properties in
 *   src/styles, so colors.css and typography.css stay the single source.
 * - Each chart passes only its own options; they are merged over the
 *   shared theme with Highcharts.merge().
 * - Must run in the browser (charts are created in $effect).
 */

import Highcharts from 'highcharts';

import { COMPONENT_COLOR_TOKENS } from './chartOptions.js';
import { bindLegendFocus } from './chartHover.js';
import { readFontSize, readToken } from './designTokens.js';

/**
 * The resolved color for a spending component, e.g. '#005051'.
 * Pass variant 'defocus' for its pale, pushed-back version.
 */
export function getComponentColor(key, variant) {
	return readToken(COMPONENT_COLOR_TOKENS[key] + (variant ? `-${variant}` : ''));
}

/**
 * The resolved color for an economy in the line chart, from the
 * --color-country-* tokens. Pass variant 'defocus' or 'glow'.
 */
export function getCountryColor(country, variant) {
	const slug = country.toLowerCase().replace(/\s+/g, '-');

	return readToken(`--color-country-${slug}` + (variant ? `-${variant}` : ''));
}

/**
 * The resolved color for bars when spending components are hidden.
 */
export function getTotalColor() {
	return readToken('--color-data-cumulative');
}

/**
 * True for a Share page chart in its wide layout, beside the Receipt
 * (1200px and up; see shareChartOptions).
 */
function isBesideReceipt(chart) {
	return window.innerWidth >= 1200 && Boolean(chart.userOptions.custom?.share);
}

/**
 * Plot-area height as a share of its width, by viewport width
 * (approved chart ratios: 1:1 below 640px, 3:4 up to 1440px, 16:9 above,
 * and 16:9 on the Share page beside the Receipt).
 */
function getPlotRatio(chart) {
	const width = window.innerWidth;

	if (width < 640) return 1;
	if (width <= 1440 && !isBesideReceipt(chart)) return 3 / 4;
	return 9 / 16;
}

/**
 * True when the legend sits under the chart (approved design): below 1670px,
 * and always on the Share page beside the Receipt. Otherwise it sits beside
 * the chart.
 */
function isLegendBelow(chart) {
	return window.innerWidth < 1670 || isBesideReceipt(chart);
}

/**
 * Under the chart, the legend's rows are 4px apart for line charts and 8px
 * apart for bar charts (approved design; the responsive rule below sets the
 * bar spacing). Returns true if the legend changed.
 */
function fitLegendRows(chart) {
	const { legend } = chart;

	if (!legend.display || legend.options.layout !== 'horizontal') return false;
	// Highcharts items are 17px tall to Figma's 18px keys, so add 1px.
	if (chart.options.chart.type !== 'line' || legend.options.itemMarginBottom === 5) return false;

	legend.update({ itemMarginBottom: 5 }, false);

	return true;
}

/**
 * Column charts: line the bottom of a legend beside the chart up with the
 * x-axis (approved design). Returns true if the legend moved.
 */
function alignLegendWithAxis(chart) {
	const { legend } = chart;

	if (!legend.display || chart.options.chart.type !== 'column') return false;

	let y = 0;

	if (legend.options.layout === 'vertical') {
		const top = chart.container.getBoundingClientRect().top;
		const symbolBottoms = legend.allItems
			.map((item) => item.legendItem?.symbol?.element?.getBoundingClientRect().bottom)
			.filter((bottom) => bottom !== undefined)
			.map((bottom) => bottom - top);

		if (!symbolBottoms.length) return false;

		const axisY = chart.plotTop + chart.plotHeight;

		y = Math.round((legend.options.y ?? 0) + axisY - Math.max(...symbolBottoms));
	}

	if ((legend.options.y ?? 0) === y) return false;

	legend.update({ y }, false);

	return true;
}

/**
 * How far labels may overhang the chart on each side: into the padding of
 * the nearest wrapper with padding or a border on that side (the chart's
 * box on the Visualizer, its column or card on the Share page), stopping
 * inside that border. Charts' overflow is visible (see ChartContainer).
 */
function overflowRoom(chart) {
	const box = chart.container.getBoundingClientRect();
	const room = { left: 0, right: 0 };

	for (const side of ['left', 'right']) {
		const Side = side === 'left' ? 'Left' : 'Right';

		for (let element = chart.renderTo.parentElement; element; element = element.parentElement) {
			const style = getComputedStyle(element);
			const border = parseFloat(style[`border${Side}Width`]) || 0;

			if (!border && !(parseFloat(style[`padding${Side}`]) || 0)) continue;

			const rect = element.getBoundingClientRect();

			room[side] = Math.max(
				0,
				side === 'right' ? rect.right - border - box.right : box.left - rect.left - border
			);
			break;
		}
	}

	return room;
}

/**
 * Bar total labels (stack totals, or data labels when components are
 * hidden) can be wider than their column, like "$1,506.74B" on the last bar.
 * They may overhang the chart into the padding around it; one that would
 * run past that padding (on phones) moves in just far enough to fit.
 *
 * Uses each label's final position (alignAttr, relative to the plot area)
 * rather than its on-screen position, which can still be animating.
 */
function keepTotalLabelsInside(chart) {
	const labels = [];

	for (const stacks of Object.values(chart.yAxis[0]?.stacking?.stacks ?? {})) {
		for (const stack of Object.values(stacks)) {
			if (stack.label) labels.push(stack.label);
		}
	}

	for (const series of chart.series) {
		for (const point of series.points ?? []) {
			if (point.dataLabel) labels.push(point.dataLabel);
		}
	}

	if (!labels.length) return;

	const room = overflowRoom(chart);
	const minLeft = -room.left;
	const maxRight = chart.chartWidth + room.right;

	for (const label of labels) {
		const x = label.alignAttr?.x;

		if (x === undefined || !label.width) continue;

		// The text's edges in chart coordinates (the label box adds padding).
		const padding = label.padding ?? 0;
		const textLeft = chart.plotLeft + x + padding;
		const textRight = chart.plotLeft + x + label.width - padding;

		const shift =
			textRight > maxRight ? maxRight - textRight : textLeft < minLeft ? minLeft - textLeft : 0;

		if (shift) {
			label.alignAttr.x = x + shift;
			label.attr({ x: x + shift });
		}
	}
}

/**
 * After each render, finish the responsive layout:
 * - space the rows of an under-chart legend,
 * - line a legend beside a column chart up with the x-axis, then
 * - resize the chart's height so the plot area keeps the approved ratio,
 *   whatever space the title and legend take, growing it further if a
 *   legend beside the chart would otherwise overlap the title.
 * Each change triggers one more render, which then finds nothing to change.
 * Finally, keep bar total labels within the padding around the chart.
 */
export function finishLayout() {
	bindLegendFocus(this);

	if (fitLegendRows(this) || alignLegendWithAxis(this)) {
		this.redraw(false);
		return;
	}

	// Height that gives the plot area the approved ratio.
	const ratioHeight =
		this.chartHeight + Math.round(this.plotWidth * getPlotRatio(this)) - this.plotHeight;

	// A legend beside the chart must fit below the title and subtitle; if it
	// doesn't, make the chart taller rather than overlap them.
	const { legend } = this;
	const besideChart = legend.display && legend.options.layout === 'vertical';
	const legendHeight = besideChart
		? this.plotTop + (legend.legendHeight ?? 0) - (legend.options.y ?? 0)
		: 0;

	const height = Math.max(ratioHeight, legendHeight);

	if (Math.abs(height - this.chartHeight) > 1) {
		this.setSize(undefined, height, false);
		return;
	}

	keepTotalLabelsInside(this);
}

/**
 * Align Y-axis labels and gridlines with the approved chart design.
 *
 * Left-align the labels at the chart's left edge, position each one 2px
 * above its gridline, and extend the gridline leftward beneath it. Called
 * after Highcharts renders so the final tick positions and label sizes
 * are available.
 */
export function alignYAxisLabels(chart) {
	const axis = chart.yAxis[0];
	if (!axis) return;

	const left = chart.spacingBox.x;

	for (const tick of Object.values(axis.ticks)) {
		const label = tick.label;
		if (!label?.element) continue;

		const box = label.element.getBBox();
		const tickY = axis.toPixels(tick.pos);

		label.attr({
			// Labels are right-anchored: move each so its left edge is at `left`.
			x: Number(label.attr('x')) + left - box.x,
			// Position the bottom of the label 2px above the gridline.
			y: tickY - 2 - box.y - box.height + Number(label.attr('y'))
		});

		// Extend the gridline leftward beneath the label.
		if (tick.gridLine) {
			tick.gridLine.attr({
				d: ['M', left, tickY, 'L', chart.plotLeft + chart.plotWidth, tickY]
			});
		}
	}
}

/**
 * Column spacing (approved design): 24px from the y-axis labels to the
 * first column and 16px between columns, or 14px and 10px below 640px.
 */
export function setColumnSpacing(chart) {
	const xAxis = chart.xAxis[0];
	const yAxis = chart.yAxis[0];
	const columns = chart.series.filter((s) => s.type === 'column');

	if (!xAxis || !yAxis || !columns.length || !xAxis.transA) return;

	const mobile = window.innerWidth < 640;
	const gap = mobile ? 10 : 16;
	const labelGap = mobile ? 14 : 24;

	// Each column is centered in its category, so the first one starts half
	// a gap in from the plot's left edge.
	const distance = labelGap - gap / 2;
	const pointWidth = Math.max(1, Math.floor(Math.abs(xAxis.transA) - gap));

	const changes = [];

	if (yAxis.options.labels.distance !== distance) {
		changes.push(() => yAxis.update({ labels: { distance } }, false));
	}

	if (columns[0].options.pointWidth !== pointWidth) {
		changes.push(() => columns.forEach((s) => s.update({ pointWidth }, false)));
	}

	if (!changes.length) return;

	changes.forEach((change) => change());
	chart.redraw(false);
}

// Short economy names for x-axis labels that would otherwise tilt.
const ECONOMY_ABBREVIATIONS = {
	'United States': 'U.S.',
	'South Korea': 'S. Korea'
};

// Full-name label widths, measured once per axis and set of categories.
const fullLabelWidths = new WeakMap();

function widestFullLabel(axis) {
	const key = axis.categories.join('|');
	const cached = fullLabelWidths.get(axis);

	if (cached?.key === key) return cached.width;

	const { renderer } = axis.chart;
	const style = axis.options.labels.style;
	const width = Math.max(
		...axis.categories.map((name) => {
			const text = renderer.text(String(name), -9999, -9999).css(style).add();
			const textWidth = text.getBBox().width;

			text.destroy();

			return textWidth;
		})
	);

	fullLabelWidths.set(axis, { key, width });

	return width;
}

/**
 * x-axis labels for charts with an economy per column: abbreviated
 * ("U.S.", "S. Korea") whenever the full names wouldn't fit flat, so they
 * stay flat longer and read better when tilted (see fitEconomyLabels).
 */
export const economyAxisLabels = {
	formatter() {
		const name = String(this.value);

		return this.axis.options.custom?.abbreviateLabels
			? (ECONOMY_ABBREVIATIONS[name] ?? name)
			: name;
	}
};

/**
 * Call after each render with economyAxisLabels: switch between full and
 * abbreviated names as the space per column changes. Highcharts tilts
 * labels that are wider than their slot.
 */
export function fitEconomyLabels(chart) {
	const axis = chart.xAxis[0];

	if (!axis?.categories?.length || !axis.transA) return;

	const fullNamesTilt = widestFullLabel(axis) > axis.getSlotWidth();

	if (Boolean(axis.options.custom?.abbreviateLabels) === fullNamesTilt) return;

	axis.update({ custom: { abbreviateLabels: fullNamesTilt } }, false);
	chart.redraw(false);
}

/**
 * Options for charts on the Share page. Beside the Receipt (1200px and up)
 * the chart is 16:9 with its legend underneath in three columns
 * (approved design).
 */
export const shareChartOptions = {
	custom: { share: true }
};

/**
 * Y-axis tick positions (approved design), for use as yAxis.tickPositioner:
 * from 0 up to the first tick at or above the tallest value, on the smallest
 * 1/2/5 step that gives at most six intervals (so at least three, never
 * just a top and bottom tick). % of GDP axes (fractions: 0.01 = 1%) keep
 * whole-percent steps whenever those still give two or more intervals.
 */
export function axisTicks(unit) {
	return function () {
		const max = Math.max(this.dataMax ?? 0, 0);
		const wholePercent = unit === 'pct_gdp' && max > 0.01;
		const step = niceStep(max, wholePercent ? 0.01 : 0) || (unit === 'pct_gdp' ? 0.01 : 1000);
		const count = Math.max(1, Math.ceil(max / step - 1e-9));
		// Round away floating-point noise (e.g. 3 * 0.002).
		const precision = 10 ** Math.max(0, -Math.floor(Math.log10(step)) + 2);

		return Array.from(
			{ length: count + 1 },
			(_, index) => Math.round(index * step * precision) / precision
		);
	};
}

/**
 * The smallest 1/2/5-style step of at least `minimum` that covers `max` in
 * at most six intervals (0 if `max` is 0).
 */
function niceStep(max, minimum) {
	if (max <= 0) return 0;

	let magnitude = 10 ** Math.floor(Math.log10(max / 6));

	for (;;) {
		for (const multiple of [1, 2, 5]) {
			const step = multiple * magnitude;

			if (step >= minimum && max / step <= 6 + 1e-9) return step;
		}

		magnitude *= 10;
	}
}

/**
 * Return spending components included in the selected estimate.
 *
 * Excluded tools are omitted from chart series, legends, and tooltips.
 * The resolved estimate and Receipt remain unchanged.
 */
export function getVisibleSpendingComponents(components, mode, assumptions) {
	const excluded = new Set();

	if (mode === 'fastTrack' && assumptions === 'minimum') {
		excluded.add('governmentProcurement');
		excluded.add('land');
		excluded.add('debtEquitySwaps');
		excluded.add('soeNetPayables');
	}

	if (mode === 'userDriven') {
		if (assumptions?.procurementCoverage === 'excludeAll') {
			excluded.add('governmentProcurement');
		}

		for (const key of ['land', 'debtEquitySwaps', 'soeNetPayables']) {
			if (assumptions?.[key] === 'exclude') {
				excluded.add(key);
			}
		}
	}

	return Object.entries(components).filter(([key]) => !excluded.has(key));
}

/**
 * Build chart options: the shared theme merged with one or more sets of
 * chart-specific options (later sets win).
 */
export function createChartOptions(...optionSets) {
	const textPrimary = readToken('--color-text-primary');
	const textSecondary = readToken('--color-text-secondary');
	const textHelper = readToken('--color-text-helper');
	const gridline = readToken('--color-border-gridline');
	const fontLabel = readToken('--font-label');

	const theme = {
		chart: {
			backgroundColor: 'transparent',
			// The same gap below the chart title for every chart type, with room
			// for the highest axis label and bar totals.
			spacing: [28, 0, 0, 0],
			style: { fontFamily: fontLabel },
			events: { render: finishLayout }
		},

		credits: { enabled: false },

		// Titles are HTML above the chart (ChartContainer), not Highcharts text.
		title: { text: null },
		subtitle: { text: null },

		xAxis: {
			// No axis line: the zero gridline, extended under the y-axis labels,
			// is the x-axis (see alignYAxisLabels).
			lineWidth: 0,
			tickLength: 0,
			title: { text: null },
			labels: {
				// 8px between the x-axis and its labels.
				distance: 8,
				style: {
					fontSize: readFontSize('--font-size-xxx-small'),
					fontWeight: '500',
					color: textHelper
				}
			}
		},

		yAxis: {
			min: 0,
			gridLineColor: gridline,
			title: { text: null },
			labels: {
				style: {
					fontSize: readFontSize('--font-size-xxx-small'),
					color: textHelper
				}
			},
			stackLabels: {
				style: {
					fontSize: readFontSize('--font-size-xx-small'),
					fontWeight: '500',
					color: textPrimary,
					textOutline: 'none'
				}
			}
		},

		legend: {
			layout: 'vertical',
			align: 'right',
			// Anchored to the bottom, beside the bars (approved design).
			verticalAlign: 'bottom',
			width: 180,
			padding: 12,
			itemMarginBottom: 8,
			symbolHeight: 16,
			symbolWidth: 16,
			symbolRadius: 0,
			squareSymbol: true,
			itemStyle: {
				fontSize: readFontSize('--font-size-xxx-small'),
				fontWeight: '400',
				color: textSecondary,
				// Wrap long labels instead of cutting them off.
				textOverflow: 'none'
			},
			// Hovering a legend item focuses its series (see chartHover.js).
			itemHoverStyle: { color: textPrimary },
			// Series can't be hidden from the legend.
			events: { itemClick: () => false }
		},

		// Hover data panel (content built with hoverPanel() in chartHover.js).
		tooltip: {
			useHTML: true,
			backgroundColor: readToken('--color-surface-primary'),
			borderColor: readToken('--color-border-strong'),
			borderWidth: 1,
			borderRadius: 4,
			padding: 10,
			shadow: false,
			style: {
				fontFamily: fontLabel,
				fontSize: readFontSize('--font-size-xxx-small'),
				color: textSecondary
			}
		},

		plotOptions: {
			column: {
				// Stacked segments sit flush, with no outline between them.
				borderWidth: 0,
				states: { hover: { brightness: 0 } }
			},
			series: {
				// chartHover.js handles focus; turn off Highcharts' own fading.
				states: { inactive: { enabled: false } },
				dataLabels: {
					style: {
						fontSize: readFontSize('--font-size-xx-small'),
						fontWeight: '500',
						color: textPrimary,
						textOutline: 'none'
					}
				}
			}
		},

		responsive: {
			rules: [
				{
					// The legend moves under the chart (see isLegendBelow): keys flow
					// in rows across the chart's width and wrap as needed.
					condition: {
						callback() {
							return isLegendBelow(this);
						}
					},
					chartOptions: {
						legend: {
							layout: 'horizontal',
							align: 'left',
							verticalAlign: 'bottom',
							width: '100%',
							alignColumns: false,
							padding: 0,
							// 28px below the axis labels, 16px between keys, 8px from each
							// swatch to its label, and rows 8px apart. (Highcharts measures
							// from its label area and its items are 1px shorter than Figma's
							// keys, so margin and row spacing are 3px and 1px larger.)
							margin: 31,
							itemDistance: 16,
							symbolPadding: 8,
							itemMarginTop: 0,
							itemMarginBottom: 9,
							// Bar charts list components from the bottom of the stack up,
							// starting with Direct Subsidies.
							reversed: false,
							// Undo alignLegendWithAxis()'s offset from beside the chart.
							y: 0
						}
					}
				}
			]
		}
	};

	return Highcharts.merge(theme, ...optionSets);
}
