<script>
	import Highcharts from 'highcharts';

	import ChartContainer from './ChartContainer.svelte';
	import ControlRow from '$lib/components/controls/ControlRow.svelte';
	import Select from '$lib/components/controls/Select.svelte';
	import { CHART_YEARS, UNIT_OPTIONS, getUnitOption } from '$lib/utils/chartOptions.js';
	import { formatChartAxisValue, formatChartValue } from '$lib/utils/formatters.js';
	import { createChartOptions, wholePercentTicks } from '$lib/utils/chartTheme.js';

	let {
		data = [],
		unit = 'pct_gdp',
		onUnitChange = () => {},
		share = () => {},
		frozen = false
	} = $props();

	const COUNTRY_COLORS = {
		China: '#c3453d',
		Taiwan: '#b88d3b',
		'United States': '#1d58a0',
		'South Korea': '#bb5b7e',
		France: '#c55e2f',
		Germany: '#60d4fa',
		Japan: '#79478d',
		Brazil: '#5abe81'
	};

	let chartElement;

	let filteredData = $derived(
		data.filter((row) => row.unit === unit && CHART_YEARS.includes(row.year))
	);

	let countries = $derived([...new Set(filteredData.map((row) => row.country))]);

	let series = $derived(
		countries.map((country) => ({
			name: country,
			color: COUNTRY_COLORS[country],
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
					type: 'spline'
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
					useHTML: true,
					formatter() {
						const year = CHART_YEARS[this.x];
						const lines = [`<strong>${year}</strong>`];

						for (const point of this.points ?? []) {
							lines.push(
								`<span style="color: ${point.color}"><strong>${point.series.name}:</strong> ${formatChartValue(point.y, unit)}</span>`
							);
						}

						return lines.join('<br>');
					}
				},

				legend: {
					enabled: true
				},

				plotOptions: {
					spline: {
						legendSymbol: 'rectangle',
						marker: {
							enabled: false,
							symbol: 'circle',
							states: {
								hover: {
									enabled: true
								}
							}
						},
						lineWidth: 2
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
