<script>
	import Highcharts from 'highcharts';

	import ChartContainer from './ChartContainer.svelte';
	import Checkbox from '$lib/components/controls/Checkbox.svelte';
	import ControlRow from '$lib/components/controls/ControlRow.svelte';
	import Select from '$lib/components/controls/Select.svelte';
	import { CHART_YEARS, UNIT_OPTIONS, getUnitOption } from '$lib/utils/chartOptions.js';
	import { formatChartAxisValue, formatChartValue } from '$lib/utils/formatters.js';
	import { hoverPanel, stackedBarHover } from '$lib/utils/chartHover.js';
	import {
		createChartOptions,
		getComponentColor,
		getTotalColor,
		wholePercentTicks
	} from '$lib/utils/chartTheme.js';
	import { spendingComponents } from '$lib/utils/spendingComponents.js';

	let {
		data = [],
		unit = 'pct_gdp',
		showComponents = true,
		onUnitChange = () => {},
		onShowComponentsChange = () => {},
		share = () => {},
		frozen = false,
		showLegend = true
	} = $props();

	let chartElement;
	const componentEntries = Object.entries(spendingComponents);

	let filteredData = $derived(
		data.filter((row) => row.unit === unit && CHART_YEARS.includes(row.year))
	);

	let cumulativeData = $derived.by(() => {
		const totals = {};

		for (const row of filteredData) {
			if (!totals[row.country]) {
				totals[row.country] = {
					country: row.country,
					total: 0
				};

				for (const [key] of componentEntries) {
					totals[row.country][key] = 0;
				}
			}

			totals[row.country].total += row.total ?? 0;

			for (const [key] of componentEntries) {
				totals[row.country][key] += row[key] ?? 0;
			}
		}

		return Object.values(totals).sort((a, b) => a.total - b.total);
	});

	let componentSeries = $derived(
		componentEntries.map(([key, metadata]) => ({
			name: metadata.label,
			color: getComponentColor(key),
			custom: { defocusColor: getComponentColor(key, 'defocus') },
			data: cumulativeData.map((row) => row[key])
		}))
	);

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

		const chart = Highcharts.chart(
			chartElement,
			createChartOptions(
				{
					chart: {
						type: 'column'
					},

					title: {
						text: 'Cumulative Industrial Policy Spending by Economy, 2019 - 2024'
					},

					subtitle: {
						text: getUnitOption(unit)?.subtitle ?? ''
					},

					xAxis: {
						categories: cumulativeData.map((row) => row.country),
						title: {
							text: null
						}
					},

					yAxis: {
						tickPositioner: unit === 'pct_gdp' ? wholePercentTicks : undefined,
						// Stack the first component (Direct Subsidies) at the bottom.
						reversedStacks: false,
						stackLabels: {
							enabled: showComponents,
							formatter() {
								return formatChartValue(this.total, unit);
							}
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
						formatter() {
							// Components listed top to bottom, in the same order as the stack.
							const rows = [...(this.points ?? [])].reverse().map((point) => ({
								color: point.color,
								name: point.series.name,
								value: formatChartValue(point.y, unit)
							}));

							return hoverPanel(cumulativeData[this.x]?.country ?? '', rows);
						}
					},
					legend: {
						enabled: showLegend && showComponents,
						// List components top to bottom in the same order as the stack.
						reversed: true
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
								}
							}
						}
					},
					series: showComponents
						? componentSeries
						: [
								{
									name: 'Total spending',
									color: getTotalColor(),
									// Totals only: no hover interactions (approved design).
									enableMouseTracking: false,
									data: cumulativeData.map((row) => row.total)
								}
							]
				},
				showComponents ? stackedBarHover : {}
			)
		);

		return () => {
			chart.destroy();
		};
	});
</script>

<ChartContainer
	title="Chart 2: Cumulative Spending, 2019-2024"
	controls={frozen ? undefined : chartControls}
	share={frozen ? undefined : share}
	{frozen}
>
	{#snippet chartControls()}
		<ControlRow label="Unit">
			<Select options={UNIT_OPTIONS} value={unit} onchange={handleUnitChange} />
		</ControlRow>

		<ControlRow label="Options">
			<Checkbox
				label="Show spending components"
				checked={showComponents}
				onchange={handleComponentsChange}
			/>
		</ControlRow>
	{/snippet}

	<div class="cumulative-spending-chart__chart" bind:this={chartElement}></div>
</ChartContainer>

<style>
	.cumulative-spending-chart__chart {
		width: 100%;
	}
</style>
