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
		year = 2019,
		unit = 'pct_gdp',
		showComponents = true,
		scaleTo100 = false,
		onYearChange = () => {},
		onUnitChange = () => {},
		onShowComponentsChange = () => {},
		onScaleTo100Change = () => {}
	} = $props();

	let chartElement;

	const componentEntries = Object.entries(spendingComponents);

	const yearOptions = CHART_YEARS.map((year) => ({
		value: year,
		label: String(year)
	}));

	let filteredData = $derived(
		data.filter((row) => row.year === year && row.unit === unit).sort((a, b) => a.total - b.total)
	);

	let componentSeries = $derived(
		componentEntries.map(([key, metadata]) => ({
			name: metadata.label,
			color: COMPONENT_COLORS[key],
			data: filteredData.map((row) => {
				const value = row[key] ?? 0;

				if (!scaleTo100) {
					return value;
				}

				if (!row.total) {
					return 0;
				}

				return (value / row.total) * 100;
			})
		}))
	);

	function handleYearChange(value) {
		onYearChange(value);
	}

	function handleUnitChange(value) {
		onUnitChange(value);
	}

	function handleComponentsChange(event) {
		const checked = event.currentTarget.checked;

		onShowComponentsChange(checked);

		if (!checked && scaleTo100) {
			onScaleTo100Change(false);
		}
	}

	function handleScaleChange(event) {
		onScaleTo100Change(event.currentTarget.checked);
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
				text: `Industrial Policy Spending Breakdown by Economy, ${year}`,
				align: 'left',
				style: {
					fontFamily: 'Roboto, sans-serif',
					fontSize: '25.1px',
					fontWeight: '500'
				}
			},

			subtitle: {
				text: scaleTo100
					? 'Share of total industrial policy spending'
					: (getUnitOption(unit)?.subtitle ?? ''),
				align: 'left',
				className: 'text-heading-3'
			},

			xAxis: {
				categories: filteredData.map((row) => row.country),
				title: {
					text: null
				}
			},

			yAxis: {
				min: 0,
				max: scaleTo100 ? 100 : undefined,
				title: {
					text: null
				},
				labels: {
					formatter() {
						if (scaleTo100) {
							return `${this.value}%`;
						}

						return formatChartAxisValue(this.value, unit);
					}
				}
			},

			tooltip: {
				enabled: showComponents,
				shared: true,
				useHTML: true,
				formatter() {
					const country = filteredData[this.x]?.country ?? '';

					const rows = (this.points ?? []).map((point) => {
						const value = scaleTo100
							? `${Highcharts.numberFormat(point.y, 1)}%`
							: formatChartValue(point.y, unit);

						return `
							<div style="margin-top: 4px;">
								<span style="color: ${point.color}">●</span>
								${point.series.name}:
								<strong>${value}</strong>
							</div>
						`;
					});

					return `
						<div>
							<strong style="font-size: 16px;">${country}</strong>
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
							data: filteredData.map((row) => row.total)
						}
					]
		});

		return () => {
			chart.destroy();
		};
	});
</script>

<ChartContainer title="Chart 3: Year-Specific Spending">
	{#snippet controls()}
		<div class="year-specific-chart__controls">
			<Select label="Year" options={yearOptions} value={year} onchange={handleYearChange} />

			<Select label="Unit" options={UNIT_OPTIONS} value={unit} onchange={handleUnitChange} />

			<div class="year-specific-chart__options">
				<span class="text-body-2-regular">Options</span>

				<div class="year-specific-chart__checkboxes">
					<Checkbox
						label="Show spending components"
						checked={showComponents}
						onchange={handleComponentsChange}
					/>

					<Checkbox
						label="Scale to 100%"
						checked={scaleTo100}
						disabled={!showComponents}
						onchange={handleScaleChange}
					/>
				</div>
			</div>
		</div>
	{/snippet}

	<div class="year-specific-chart__chart" bind:this={chartElement}></div>
</ChartContainer>

<style>
	.year-specific-chart__chart {
		width: 100%;
		max-width: 822px;
		height: 677px;
	}

	.year-specific-chart__controls {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.year-specific-chart__options {
		display: grid;
		grid-template-columns: 140px 1fr;
		align-items: start;
	}

	.year-specific-chart__checkboxes {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
</style>
