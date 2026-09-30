<script>
	import Highcharts from 'highcharts';

	import ChartContainer from './ChartContainer.svelte';
	import Checkbox from '$lib/components/controls/Checkbox.svelte';
	import Select from '$lib/components/controls/Select.svelte';
	import {
		CHART_YEARS,
		COMPONENT_COLORS,
		UNIT_OPTIONS,
		getUnitOption
	} from '$lib/utils/chartOptions.js';
	import { formatChartAxisValue, formatChartValue } from '$lib/utils/formatters.js';
	import { spendingComponents } from '$lib/utils/spendingComponents.js';

	let {
		data = [],
		economy = 'China',
		unit = 'pct_gdp',
		showComponents = true,
		onEconomyChange = () => {},
		onUnitChange = () => {},
		onShowComponentsChange = () => {}
	} = $props();

	let chartElement;

	const componentEntries = Object.entries(spendingComponents);

	let economyOptions = $derived(
		[...new Set(data.map((row) => row.country))]
			.sort((a, b) => a.localeCompare(b))
			.map((country) => ({
				value: country,
				label: country
			}))
	);

	let filteredData = $derived(
		data
			.filter(
				(row) =>
					row.country === economy &&
					row.unit === unit &&
					CHART_YEARS.includes(row.year)
			)
			.sort((a, b) => a.year - b.year)
	);

	let componentSeries = $derived(
		componentEntries.map(([key, metadata]) => ({
			name: metadata.label,
			color: COMPONENT_COLORS[key],
			data: CHART_YEARS.map((year) => {
				const row = filteredData.find((row) => row.year === year);

				return row?.[key] ?? 0;
			})
		}))
	);

	function handleEconomyChange(value) {
		onEconomyChange(value);
	}

	function handleUnitChange(value) {
		onUnitChange(value);
	}

	function handleComponentsChange(event) {
		onShowComponentsChange(event.currentTarget.checked);
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
				text: `Industrial Policy Spending in ${economy}, 2019 - 2024`,
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
				categories: CHART_YEARS,
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
				shared: true,
				useHTML: true,
				formatter() {
					const year = CHART_YEARS[this.x];

					const rows = (this.points ?? []).map(
						(point) => `
							<div style="margin-top: 4px;">
								<span style="color: ${point.color}">●</span>
								${point.series.name}:
								<strong>${formatChartValue(point.y, unit)}</strong>
							</div>
						`
					);

					return `
						<div>
							<strong style="font-size: 16px;">${year}</strong>
							${rows.join('')}
						</div>
					`;
				}
			},

			legend: {
				enabled: showComponents
			},

			plotOptions: {
				column: {
					stacking: showComponents ? 'normal' : undefined,
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

			series: showComponents
				? componentSeries
				: [
						{
							name: 'Total spending',
							color: '#325573',
							data: CHART_YEARS.map((year) => {
								const row = filteredData.find((row) => row.year === year);

								return row?.total ?? null;
							})
						}
					]
		});

		return () => {
			chart.destroy();
		};
	});
</script>

<ChartContainer title="Chart 4: Economy-Specific Spending, 2019-2024">
	{#snippet controls()}
		<div class="economy-specific-chart__controls">
			<Select
				label="Economy"
				options={economyOptions}
				value={economy}
				onchange={handleEconomyChange}
			/>

			<Select
				label="Unit"
				options={UNIT_OPTIONS}
				value={unit}
				onchange={handleUnitChange}
			/>

			<div class="economy-specific-chart__options">
				<span class="text-body-2-regular">Options</span>

				<Checkbox
					label="Show spending components"
					checked={showComponents}
					onchange={handleComponentsChange}
				/>
			</div>
		</div>
	{/snippet}

	<div class="economy-specific-chart__chart" bind:this={chartElement}></div>
</ChartContainer>

<style>
	.economy-specific-chart__chart {
		width: 100%;
		max-width: 822px;
		height: 677px;
	}

	.economy-specific-chart__controls {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.economy-specific-chart__options {
		display: grid;
		grid-template-columns: 140px 1fr;
		align-items: center;
	}
</style>