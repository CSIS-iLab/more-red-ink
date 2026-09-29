<!--
  HistoricalSpendingChart

  Historical spending visualization.

  Responsibilities:
  - Render the historical spending chart from the resolved estimate.
  - Allow the user to select the displayed unit.
  - Configure the Highcharts visualization for this view.

  Implementation notes:
  - Receive resolved estimate data rather than raw source data.
  - Chart-specific filtering and presentation logic belongs here.
  - Do not resolve methodology-specific spreadsheet fields here.
-->

<script>
	import Highcharts from 'highcharts';

	import ChartContainer from './ChartContainer.svelte';
	import Select from '$lib/components/controls/Select.svelte';

	let { data = [] } = $props();

	const HISTORICAL_YEARS = [2019, 2020, 2021, 2022, 2023, 2024];

	const UNIT_OPTIONS = [
		{ value: 'pct_gdp', label: '% of GDP' },
		{ value: 'usd_market', label: 'USD (market exchange rate)' },
		{ value: 'usd_ppp', label: 'USD (PPP)' }
	];

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

	let selectedUnit = $state('pct_gdp');
	let chartElement;

	let filteredData = $derived(
		data.filter((row) => row.unit === selectedUnit && HISTORICAL_YEARS.includes(row.year))
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
		selectedUnit = value;
	}

	function formatValue(value) {
		if (selectedUnit === 'pct_gdp') {
			const percentage = value * 100;

			return `${Highcharts.numberFormat(percentage, percentage % 1 === 0 ? 0 : 1)}%`;
		}

		return `$${Highcharts.numberFormat(value / 1000, 1)}B`;
	}

	function formatAxisValue(value) {
		if (selectedUnit === 'pct_gdp') {
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
				backgroundColor: 'transparent'
			},

			credits: {
				enabled: false
			},

			title: {
				text: 'Annual Industrial Policy Spending by Country, 2019 - 2024',
				align: 'left'
			},

			subtitle: {
				text:
					selectedUnit === 'pct_gdp'
						? 'As a percentage of GDP'
						: selectedUnit === 'usd_market'
							? 'USD, market exchange rate'
							: 'USD, purchasing power parity',
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
					text: selectedUnit === 'pct_gdp' ? null : ''
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
			<Select
				label="Unit"
				options={UNIT_OPTIONS}
				value={selectedUnit}
				onchange={handleUnitChange}
			/>
		</div>
	{/snippet}

	<div class="historical-spending-chart__chart" bind:this={chartElement}></div>
</ChartContainer>

<style>
	.historical-spending-chart__controls {
		max-width: 18rem;
	}

	.historical-spending-chart__chart {
		width: 100%;
		min-height: 24rem;
	}
</style>
