<!--
  Visualizer

  Displays the estimate produced by the user's calculator choices.

  Responsibilities:
  - Require a valid active estimate configuration.
  - Resolve the estimate from source data and the current assumptions.
  - Render the receipt and all four chart views.
  - Provide access to sharing functionality.

  Implementation notes:
  - Call calculateEstimate() once for the current assumptions.
  - Pass the same resolved estimate to each chart component.
  - Do not have individual charts independently calculate the estimate.
-->
<!--
  Visualizer

  Displays the estimate produced by the user's calculator choices.

  Responsibilities:
  - Require a valid active estimate configuration.
  - Resolve the estimate from source data and the current assumptions.
  - Render the receipt and all four chart views.
  - Provide access to sharing functionality.

  Implementation notes:
  - Call calculateEstimate() once for the current assumptions.
  - Pass the same resolved estimate to each chart component.
  - Do not have individual charts independently calculate the estimate.

  TEMPORARY:
  - Issue #13 test harness for HistoricalSpendingChart.
  - Uses the real source data and calculation layer.
  - Replace with calculator-state integration in Issue #17.
-->

<script>
	import { onMount } from 'svelte';

	import HistoricalSpendingChart from '$lib/components/charts/HistoricalSpendingChart.svelte';
	import CumulativeSpendingChart from '$lib/components/charts/CumulativeSpendingChart.svelte';
	import { calculateEstimate } from '$lib/data/calculateEstimate.js';
	import { loadData } from '$lib/data/loadData.js';

	let historicalUnit = $state('pct_gdp');
	let cumulativeUnit = $state('pct_gdp');
	let resolvedData = $state([]);
	let loading = $state(true);
	let error = $state(null);

	onMount(async () => {
		try {
			const sourceData = await loadData();

			resolvedData = calculateEstimate(sourceData, {
				mode: 'fastTrack',
				fastTrackChoice: 'minimum'
			});
		} catch (err) {
			console.error(err);
			error = 'Unable to load chart data.';
		} finally {
			loading = false;
		}
	});
</script>

{#if loading}
	<p>Loading chart…</p>
{:else if error}
	<p>{error}</p>
{:else}
	<HistoricalSpendingChart
		data={resolvedData}
		{historicalUnit}
		onUnitChange={(value) => {
			historicalUnit = value;
		}}
	/><CumulativeSpendingChart
		data={resolvedData}
		unit={cumulativeUnit}
		onUnitChange={(value) => {
			cumulativeUnit = value;
		}}
	/>{/if}
