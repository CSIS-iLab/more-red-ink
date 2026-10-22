<script>
	import Highcharts from 'highcharts';

	import ChartContainer from './ChartContainer.svelte';
	import Checkbox from '$lib/components/controls/Checkbox.svelte';
	import ControlRow from '$lib/components/controls/ControlRow.svelte';
	import Select from '$lib/components/controls/Select.svelte';
	import { UNIT_OPTIONS, getUnitOption } from '$lib/utils/chartOptions.js';
	import { formatChartAxisValue, formatChartValue } from '$lib/utils/formatters.js';
	import { hoverPanel, stackedBarHover } from '$lib/utils/chartHover.js';
	import {
		createChartOptions,
		getComponentColor,
		shareChartOptions,
		getTotalColor,
		wholePercentTicks,
		finishLayout,
		alignYAxisLabels,
		setColumnSpacing,
		getVisibleSpendingComponents
	} from '$lib/utils/chartTheme.js';
	import { spendingComponents } from '$lib/utils/spendingComponents.js';

	let {
		data = [],
		unit = 'pct_gdp',
		showComponents = true,
		scaleTo100 = false,
		onUnitChange = () => {},
		onShowComponentsChange = () => {},
		onScaleTo100Change = () => {},
		share,
		frozen = false,
		mode = null,
		assumptions = null
	} = $props();

	let chartElement;

	// Shown above the chart by ChartContainer.
	// "Composition" when the bars show spending components.
	let chartTitle = $derived(
		showComponents
			? 'Cumulative Industrial Policy Spending Composition by Economy, 2019–2024'
			: 'Cumulative Industrial Policy Spending by Economy, 2019–2024'
	);
	let chartSubtitle = $derived(
		scaleTo100 ? 'Share of total industrial policy spending' : (getUnitOption(unit)?.subtitle ?? '')
	);
	let componentEntries = $derived(
		getVisibleSpendingComponents(spendingComponents, mode, assumptions)
	);

	let cumulativeData = $derived(
		data
			.filter((row) => row.unit === unit && row.year === 'Cumulative')
			.sort((a, b) => a.total - b.total)
	);

	let componentSeries = $derived(
		componentEntries.map(([key, metadata]) => ({
			name: metadata.label,
			color: getComponentColor(key),
			custom: { defocusColor: getComponentColor(key, 'defocus') },
			data: cumulativeData.map((row) => {
				const value = row[key] ?? 0;
				return scaleTo100 && row.total ? (value / row.total) * 100 : scaleTo100 ? 0 : value;
			})
		}))
	);

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

		const chart = Highcharts.chart(
			chartElement,
			createChartOptions(
				{
					chart: {
						type: 'column',
						spacingTop: 28,
						events: {
							render() {
								finishLayout.call(this);
								alignYAxisLabels(this);
								setColumnSpacing(this);
							}
						}
					},

					xAxis: {
						categories: cumulativeData.map((row) => row.country),
						title: {
							text: null
						}
					},

					yAxis: {
						max: scaleTo100 ? 100 : undefined,
						tickPositioner: unit === 'pct_gdp' && !scaleTo100 ? wholePercentTicks : undefined,
						// Stack the first component (Direct Subsidies) at the bottom.
						reversedStacks: false,
						stackLabels: {
							enabled: showComponents && !scaleTo100,
							crop: false,
							overflow: 'allow',
							formatter() {
								return formatChartValue(this.total, unit);
							}
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
						formatter() {
							// Components listed top to bottom, in the same order as the stack.
							const rows = [...(this.points ?? [])].reverse().map((point) => ({
								color: point.color,
								name: point.series.name,
								value: scaleTo100
									? `${Highcharts.numberFormat(point.y, 1)}%`
									: formatChartValue(point.y, unit)
							}));

							// The bar's total, as printed above it (scaled bars show no total).
							const total = scaleTo100
								? undefined
								: formatChartValue(this.points?.[0]?.total ?? 0, unit);

							return hoverPanel(cumulativeData[this.x]?.country ?? '', rows, { total });
						}
					},
					legend: {
						enabled: showComponents,
						// List components top to bottom in the same order as the stack.
						reversed: true
					},
					plotOptions: {
						column: {
							stacking: showComponents ? 'normal' : undefined,
							borderRadius: 0,
							pointPadding: 0,
							groupPadding: 0,
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
				showComponents ? stackedBarHover : {},
				frozen ? shareChartOptions : {}
			)
		);

		return () => {
			chart.destroy();
		};
	});
</script>

<ChartContainer
	title="Chart 2: Cumulative Spending, 2019–2024"
	{chartTitle}
	{chartSubtitle}
	controls={frozen ? undefined : chartControls}
	share={frozen ? undefined : share}
	{frozen}
>
	{#snippet chartControls()}
		<ControlRow label="Unit">
			<Select
				options={UNIT_OPTIONS}
				value={unit}
				disabled={scaleTo100}
				helper={scaleTo100 ? 'Unit is not applicable when “Scale to 100%” is selected' : undefined}
				onchange={handleUnitChange}
			/>
		</ControlRow>

		<ControlRow label="Options">
			<Checkbox
				label="Show spending components"
				checked={showComponents}
				onchange={handleComponentsChange}
			/>
			<!-- Scale to 100% only applies to spending components (approved design). -->
			{#if showComponents}
				<Checkbox label="Scale to 100%" checked={scaleTo100} onchange={handleScaleChange} />
			{/if}
		</ControlRow>
	{/snippet}

	<div class="cumulative-spending-chart__chart" bind:this={chartElement}></div>
</ChartContainer>

<style>
	.cumulative-spending-chart__chart {
		width: 100%;
	}
</style>
