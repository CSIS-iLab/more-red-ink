<script>
	import Highcharts from 'highcharts';

	import ChartContainer from './ChartContainer.svelte';
	import Select from '$lib/components/controls/Select.svelte';
	import { UNIT_OPTIONS, getUnitOption } from '$lib/utils/unitOptions.js';

	let { data = [], unit = 'pct_gdp', onUnitChange = () => {} } = $props();

	const HISTORICAL_YEARS = [2019, 2020, 2021, 2022, 2023, 2024];

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
		data.filter((row) => row.unit === unit && HISTORICAL_YEARS.includes(row.year))
	);

	let countries = $derived([...new Set(filteredData.map((row) => row.country))]);

	let series = $derived(
		countries.map((country) => ({
			name: country,
			color: COUNTRY_COLORS[country],
			data: HISTORICAL_YEARS.map((year) => {
				const row = filteredData.find((row) => row.country === country && row.year === year);

				return row?.total ?? null;
			})
		}))
	);

	function handleUnitChange(value) {
		onUnitChange(value);
	}

	function formatValue(value) {
		if (unit === 'pct_gdp') {
			const percentage = value * 100;

			return `${Highcharts.numberFormat(percentage, percentage % 1 === 0 ? 0 : 1)}%`;
		}

		return `$${Highcharts.numberFormat(value / 1000, 1)}B`;
	}

	function formatAxisValue(value) {
		if (unit === 'pct_gdp') {
			const percentage = value * 100;

			return `${Highcharts.numberFormat(percentage, percentage % 1 === 0 ? 0 : 1)}%`;
		}

		if (Math.abs(value) >= 1000) {
			return `$${Highcharts.numberFormat(value / 1000, 0)}B`;
		}

		return `$${Highcharts.numberFormat(value, 0)}B`;
	}

	$effect(() => {
		if (!chartElement) {
			return;
		}

		const chart = Highcharts.chart(chartElement, {
			chart: {
				type: 'spline',
				backgroundColor: 'transparent',
				marginTop: 100
			},

			credits: {
				enabled: false
			},

			title: {
				text: 'Annual Industrial Policy Spending by Country, 2019 - 2024',
				align: 'left',
				style: {
					fontFamily: 'Roboto, sans-serif',
					fontSize: '25.1px',
					fontWeight: '500'
				}
			},

			subtitle: {
				text: getUnitOption(unit)?.subtitle ?? '',
				align: 'left'
			},

			xAxis: {
				categories: HISTORICAL_YEARS,
				title: {
					text: null
				}
			},

			yAxis: {
				min: 0,
				title: {
					text: unit === 'pct_gdp' ? null : ''
				},
				labels: {
					formatter() {
						return formatAxisValue(this.value);
					}
				}
			},

			tooltip: {
				shared: true,
				useHTML: true,
				formatter() {
					const year = HISTORICAL_YEARS[this.x];
					const lines = [`<strong>${year}</strong>`];

					for (const point of this.points ?? []) {
						lines.push(
							`<span style="color: ${point.color}"><strong>${point.series.name}:</strong> ${formatValue(point.y)}</span>`
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
		});

		return () => {
			chart.destroy();
		};
	});
</script>

<ChartContainer title="Chart 1: Historical Spending, 2019-2024">
	{#snippet controls()}
		<div class="historical-spending-chart__controls">
			<Select label="Unit" options={UNIT_OPTIONS} value={unit} onchange={handleUnitChange} />
		</div>
	{/snippet}

	<div class="historical-spending-chart__chart" bind:this={chartElement}></div>
</ChartContainer>

<style>
	.historical-spending-chart__chart {
		width: 100%;
		max-width: 822px;
		height: 677px;
	}
</style>
