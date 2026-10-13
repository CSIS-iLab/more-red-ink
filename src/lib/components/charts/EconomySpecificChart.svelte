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
		economy = 'China',
		unit = 'pct_gdp',
		showComponents = true,
		onEconomyChange = () => {},
		onUnitChange = () => {},
		onShowComponentsChange = () => {},
		share,
		frozen = false,
		showLegend = true
	} = $props();

	let chartElement;

	// Shown above the chart by ChartContainer.
	let chartTitle = $derived(`Industrial Policy Spending in ${economy}, 2019 - 2024`);
	let chartSubtitle = $derived(getUnitOption(unit)?.subtitle ?? '');

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
				(row) => row.country === economy && row.unit === unit && CHART_YEARS.includes(row.year)
			)
			.sort((a, b) => a.year - b.year)
	);

	let componentSeries = $derived(
		componentEntries.map(([key, metadata]) => ({
			name: metadata.label,
			color: getComponentColor(key),
			custom: { defocusColor: getComponentColor(key, 'defocus') },
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

		const chart = Highcharts.chart(
			chartElement,
			createChartOptions(
				{
					chart: {
						type: 'column'
					},

					xAxis: {
						categories: CHART_YEARS,
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

							return hoverPanel(CHART_YEARS[this.x], rows);
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
									data: CHART_YEARS.map((year) => {
										const row = filteredData.find((row) => row.year === year);

										return row?.total ?? null;
									})
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
	title="Chart 4: Economy-Specific Spending, 2019-2024"
	{chartTitle}
	{chartSubtitle}
	controls={frozen ? undefined : chartControls}
	share={frozen ? undefined : share}
	{frozen}
>
	{#snippet chartControls()}
		<ControlRow label="Economy">
			<Select options={economyOptions} value={economy} onchange={handleEconomyChange} />
		</ControlRow>

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

	<div class="economy-specific-chart__chart" bind:this={chartElement}></div>
</ChartContainer>

<style>
	.economy-specific-chart__chart {
		width: 100%;
	}
</style>
