<script>
	import Highcharts from 'highcharts';

	import ChartContainer from './ChartContainer.svelte';
	import ControlRow from '$lib/components/controls/ControlRow.svelte';
	import Select from '$lib/components/controls/Select.svelte';
	import { CHART_YEARS, UNIT_OPTIONS, getUnitOption } from '$lib/utils/chartOptions.js';
	import { formatChartAxisValue, formatChartValue } from '$lib/utils/formatters.js';
	import { hoverPanel } from '$lib/utils/chartHover.js';
	import { createChartOptions, getCountryColor, wholePercentTicks } from '$lib/utils/chartTheme.js';

	let {
		data = [],
		unit = 'pct_gdp',
		onUnitChange = () => {},
		share = () => {},
		frozen = false
	} = $props();

	let chartElement;

	let filteredData = $derived(
		data.filter((row) => row.unit === unit && CHART_YEARS.includes(row.year))
	);

	let countries = $derived([...new Set(filteredData.map((row) => row.country))]);

	let series = $derived(
		countries.map((country) => ({
			name: country,
			color: getCountryColor(country),
			custom: { defocusColor: getCountryColor(country, 'defocus') },
			// Hover dot glow in the country's color.
			states: {
				hover: {
					halo: { size: 11, opacity: 1, attributes: { fill: getCountryColor(country, 'glow') } }
				}
			},
			data: CHART_YEARS.map((year) => {
				const row = filteredData.find((row) => row.country === country && row.year === year);

				return row?.total ?? null;
			})
		}))
	);

	function handleUnitChange(value) {
		onUnitChange(value);
	}

	$effect(() => {
		if (!chartElement) {
			return;
		}

		const chart = Highcharts.chart(
			chartElement,
			createChartOptions({
				chart: {
					// Straight segments between data points (approved design).
					type: 'line'
				},

				title: {
					text: 'Annual Industrial Policy Spending by Economy, 2019 - 2024'
				},

				subtitle: {
					text: getUnitOption(unit)?.subtitle ?? ''
				},
				xAxis: {
					categories: CHART_YEARS,
					title: {
						text: null
					}
				},

				yAxis: {
					tickPositioner: unit === 'pct_gdp' ? wholePercentTicks : undefined,
					labels: {
						formatter() {
							return formatChartAxisValue(this.value, unit);
						}
					}
				},

				tooltip: {
					shared: true,
					formatter() {
						// Economies listed in the order of their data points.
						const rows = [...(this.points ?? [])]
							.sort((a, b) => b.y - a.y)
							.map((point) => ({
								color: point.color,
								name: point.series.name,
								value: formatChartValue(point.y, unit)
							}));

						return hoverPanel(CHART_YEARS[this.x], rows, 'line');
					}
				},

				legend: {
					enabled: true
				},

				plotOptions: {
					line: {
						lineWidth: 2,
						// Dots appear only on hover, for every economy in that year.
						marker: {
							enabled: false,
							symbol: 'circle',
							states: {
								hover: { enabled: true, radius: 4, lineWidth: 1, lineColor: '#ffffff' }
							}
						},
						states: { hover: { lineWidthPlus: 0 } }
					}
				},

				series
			})
		);

		return () => {
			chart.destroy();
		};
	});
</script>

<ChartContainer
	title="Chart 1: Historical Spending, 2019-2024"
	controls={frozen ? undefined : chartControls}
	share={frozen ? undefined : share}
	{frozen}
>
	{#snippet chartControls()}
		<ControlRow label="Unit">
			<Select options={UNIT_OPTIONS} value={unit} onchange={handleUnitChange} />
		</ControlRow>
	{/snippet}

	<div class="historical-spending-chart__chart" bind:this={chartElement}></div>
</ChartContainer>

<style>
	.historical-spending-chart__chart {
		width: 100%;
	}
</style>
