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
 * How many columns the legend forms under the chart, or 0 when it sits
 * beside the chart: two below 960px, and three on the Share page beside
 * the Receipt.
 */
function getLegendColumns(chart) {
	if (window.innerWidth < 960) return 2;
	if (isBesideReceipt(chart)) return 3;
	return 0;
}

/**
 * When the legend sits under the chart, size its items so they form
 * columns (approved designs). Returns true if the legend changed.
 */
function fitLegendColumns(chart) {
	const { legend } = chart;

	if (!legend.display) return false;

	const columns = getLegendColumns(chart);
	const padding = legend.options.padding ?? 0;
	const itemWidth = columns ? Math.floor((chart.chartWidth - padding * 2) / columns) : undefined;

	if (legend.options.itemWidth === itemWidth) return false;

	legend.update({ itemWidth }, false);

	return true;
}

/**
 * After each render, finish the responsive layout:
 * - put an under-chart legend into columns, then
 * - resize the chart's height so the plot area keeps the approved ratio,
 *   whatever space the title and legend take, growing it further if a
 *   legend beside the chart would otherwise overlap the title.
 * Each change triggers one more render, which then finds nothing to change.
 */
export function finishLayout() {
	bindLegendFocus(this);

	if (fitLegendColumns(this)) {
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
	const legendHeight = besideChart ? this.plotTop + (legend.legendHeight ?? 0) : 0;

	const height = Math.max(ratioHeight, legendHeight);

	if (Math.abs(height - this.chartHeight) > 1) {
		this.setSize(undefined, height, false);
	}
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
 * Y-axis ticks at whole percentages for values stored as fractions of GDP
 * (0.01 = 1%), using 1/2/5-style steps so there are at most six intervals.
 */
export function wholePercentTicks() {
	const max = Math.max(this.dataMax ?? 0, 0);
	const steps = [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1];
	const step = steps.find((candidate) => max / candidate <= 6) ?? 1;
	const count = Math.max(1, Math.ceil(max / step - 1e-9));

	return Array.from({ length: count + 1 }, (_, index) => Math.round(index * step * 100) / 100);
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
			// Room at the top for the highest axis label and bar totals.
			spacing: [8, 0, 0, 0],
			style: { fontFamily: fontLabel },
			events: { render: finishLayout }
		},

		credits: { enabled: false },

		// Titles are HTML above the chart (ChartContainer), not Highcharts text.
		title: { text: null },
		subtitle: { text: null },

		xAxis: {
			lineColor: gridline,
			tickLength: 0,
			title: { text: null },
			labels: {
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
					// The legend moves under the chart, in columns (see getLegendColumns).
					condition: {
						callback() {
							return getLegendColumns(this) > 0;
						}
					},
					chartOptions: {
						legend: {
							layout: 'horizontal',
							align: 'left',
							verticalAlign: 'bottom',
							width: '100%',
							itemWidth: undefined,
							alignColumns: true,
							itemDistance: 24,
							margin: 24
						}
					}
				}
			]
		}
	};

	return Highcharts.merge(theme, ...optionSets);
}
