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

const readToken = (name) =>
	getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/**
 * A type-scale token (defined in rem) as pixels, which Highcharts needs for
 * its text layout. Read at render time so the mobile type scale applies.
 */
const readFontSize = (name) => {
	const rootSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

	return `${parseFloat(readToken(name)) * rootSize}px`;
};

/**
 * The resolved color for a spending component, e.g. '#005051'.
 */
export function getComponentColor(key) {
	return readToken(COMPONENT_COLOR_TOKENS[key]);
}

/**
 * Plot-area height as a share of its width, by viewport width
 * (approved chart ratios: 1:1 below 640px, 3:4 up to 1440px, 16:9 above).
 */
function getPlotRatio() {
	const width = window.innerWidth;

	if (width < 640) return 1;
	if (width <= 1440) return 3 / 4;
	return 9 / 16;
}

/**
 * When the legend sits under the chart, size its items so they form two
 * columns (approved mobile legend). Returns true if the legend changed.
 */
function fitLegendColumns(chart) {
	const { legend } = chart;

	if (!legend.display) return false;

	const padding = legend.options.padding ?? 0;
	const itemWidth =
		legend.options.layout === 'horizontal'
			? Math.floor((chart.chartWidth - padding * 2) / 2)
			: undefined;

	if (legend.options.itemWidth === itemWidth) return false;

	legend.update({ itemWidth }, false);

	return true;
}

/**
 * After each render, finish the responsive layout:
 * - put an under-chart legend into two columns, then
 * - resize the chart's height so the plot area keeps the approved ratio,
 *   whatever space the title and legend take, growing it further if a
 *   legend beside the chart would otherwise overlap the title.
 * Each change triggers one more render, which then finds nothing to change.
 */
function finishLayout() {
	if (fitLegendColumns(this)) {
		this.redraw(false);
		return;
	}

	// Height that gives the plot area the approved ratio.
	const ratioHeight =
		this.chartHeight + Math.round(this.plotWidth * getPlotRatio()) - this.plotHeight;

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
 * Build chart options: the shared theme merged with chart-specific options.
 */
export function createChartOptions(options) {
	const textPrimary = readToken('--color-text-primary');
	const textSecondary = readToken('--color-text-secondary');
	const textHelper = readToken('--color-text-helper');
	const gridline = readToken('--color-border-gridline');
	const borderSubtle = readToken('--color-border-subtle');
	const fontHeading = readToken('--font-heading');
	const fontLabel = readToken('--font-label');

	const theme = {
		chart: {
			backgroundColor: 'transparent',
			spacing: [0, 0, 0, 0],
			style: { fontFamily: fontLabel },
			events: { render: finishLayout }
		},

		credits: { enabled: false },

		title: {
			align: 'left',
			margin: 28,
			// HTML titles wrap and measure accurately, so the subtitle never overlaps.
			useHTML: true,
			style: {
				fontFamily: fontHeading,
				fontSize: readFontSize('--font-size-medium'),
				fontWeight: '500',
				color: textPrimary
			}
		},

		subtitle: {
			align: 'left',
			useHTML: true,
			style: {
				fontFamily: fontLabel,
				fontSize: readFontSize('--font-size-x-small'),
				fontWeight: '500',
				color: textHelper,
				// Highcharts places the subtitle 7px into the serif title's
				// line box; this leaves the approved 4px gap.
				paddingTop: '11px'
			}
		},

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
			itemHoverStyle: { color: textPrimary }
		},

		tooltip: {
			backgroundColor: readToken('--color-surface-primary'),
			borderColor: borderSubtle,
			style: {
				fontFamily: fontLabel,
				fontSize: readFontSize('--font-size-xxx-small'),
				color: textSecondary
			}
		},

		plotOptions: {
			column: {
				// Stacked segments sit flush, with no outline between them.
				borderWidth: 0
			},
			series: {
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
					// Below 960px the legend moves under the chart in two columns.
					condition: { callback: () => window.innerWidth < 960 },
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

	return Highcharts.merge(theme, options);
}
