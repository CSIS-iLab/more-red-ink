<script>
	import Highcharts from 'highcharts';

	import ChartContainer from './ChartContainer.svelte';
	import Checkbox from '$lib/components/controls/Checkbox.svelte';
	import Select from '$lib/components/controls/Select.svelte';
	import { CHART_YEARS, UNIT_OPTIONS, getUnitOption } from '$lib/utils/chartOptions.js';
	import { formatChartAxisValue, formatChartValue } from '$lib/utils/formatters.js';

	let { data = [], unit = 'pct_gdp', onUnitChange = () => {} } = $props();

	let chartElement;
	let showComponents = $state(false);

	let filteredData = $derived(
		data.filter((row) => row.unit === unit && CHART_YEARS.includes(row.year))
	);

	let cumulativeData = $derived.by(() => {
		const totals = {};

		for (const row of filteredData) {
			totals[row.country] = (totals[row.country] ?? 0) + (row.total ?? 0);
		}

		return Object.entries(totals)
			.map(([country, total]) => ({
				country,
				total
			}))
			.sort((a, b) => a.total - b.total);
	});

	function handleUnitChange(value) {
		onUnitChange(value);
	}

	function handleComponentsChange(event) {
		showComponents = event.currentTarget.checked;
	}

	$effect(() => {
		if (!chartElement) {
			return;
		}

		const chart = Highcharts.chart(chartElement, {
			chart: {
				type: 'column',
				backgroundColor: 'transparent',
				marginTop: 100
			},

			credits: {
				enabled: false
			},

			title: {
				text: 'Cumulative Industrial Policy Spending by Country, 2019 - 2024',
				align: 'left',
				style: {
					fontFamily: 'Roboto, sans-serif',
					fontSize: '25.1px',
					fontWeight: '500'
				}
			},

			subtitle: {
				text: getUnitOption(unit)?.subtitle ?? '',
				align: 'left',
        				className: 'text-heading-3'
			},

			xAxis: {
				categories: cumulativeData.map((row) => row.country),
				title: {
					text: null
				}
			},

			yAxis: {
				min: 0,
				title: {
					text: null
				},
				labels: {
					formatter() {
						return formatChartAxisValue(this.value, unit);
					}
				}
			},

			tooltip: {
				enabled: showComponents,
				formatter() {
					return `<strong>${this.key}</strong><br>${formatChartValue(this.y, unit)}`;
				}
			},
			legend: {
				enabled: false
			},
			plotOptions: {
				column: {
					borderRadius: 0,
					pointPadding: 0.05,
					groupPadding: 0.1,
					dataLabels: {
						enabled: !showComponents,
						inside: false,
						crop: false,
						overflow: 'allow',
						formatter() {
							return formatChartValue(this.y, unit);
						},
						style: {
							fontWeight: '600',
							textOutline: 'none'
						}
					}
				}
			},
			series: [
				{
					name: 'Total spending',
					color: '#325573',
					data: cumulativeData.map((row) => row.total)
				}
			]
		});

		return () => {
			chart.destroy();
		};
	});
</script>

<ChartContainer title="Chart 2: Cumulative Spending, 2019-2024">
	{#snippet controls()}
		<div class="cumulative-spending-chart__controls">
			<Select label="Unit" options={UNIT_OPTIONS} value={unit} onchange={handleUnitChange} />

			<div class="cumulative-spending-chart__options">
				<span class="text-body-2-regular">Options</span>

				<Checkbox
					label="Show spending components"
					checked={showComponents}
					onchange={handleComponentsChange}
				/>
			</div>
		</div>
	{/snippet}

	<div class="cumulative-spending-chart__chart" bind:this={chartElement}></div>
</ChartContainer>

<style>
	.cumulative-spending-chart__chart {
		width: 100%;
		max-width: 822px;
		height: 677px;
	}

	.cumulative-spending-chart__controls {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.cumulative-spending-chart__options {
		display: grid;
		grid-template-columns: 140px 1fr;
		align-items: center;
	}
</style>
