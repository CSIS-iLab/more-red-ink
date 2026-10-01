<script>
	import { onMount } from 'svelte';

	import HistoricalSpendingChart from '$lib/components/charts/HistoricalSpendingChart.svelte';
	import { calculateEstimate } from '$lib/data/calculateEstimate.js';
	import { loadData } from '$lib/data/loadData.js';
	import CumulativeSpendingChart from '$lib/components/charts/CumulativeSpendingChart.svelte';
	import YearSpecificChart from '$lib/components/charts/YearSpecificChart.svelte';
	import EconomySpecificChart from '$lib/components/charts/EconomySpecificChart.svelte';

	let payload = $state(null);
	let resolvedData = $state([]);
	let loading = $state(true);
	let error = $state(null);

	onMount(async () => {
		try {
			const storedPayload = sessionStorage.getItem('sharePayload');

			if (!storedPayload) {
				error = 'Unable to load shared chart.';
				return;
			}

			payload = JSON.parse(storedPayload);

			const sourceData = await loadData();

			const estimateState =
				payload.mode === 'fastTrack'
					? {
							mode: payload.mode,
							fastTrackChoice: payload.assumptions
						}
					: {
							mode: payload.mode,
							userDrivenChoices: payload.assumptions
						};

			resolvedData = calculateEstimate(sourceData, estimateState);
		} catch (err) {
			console.error(err);
			error = 'Unable to load shared chart.';
		} finally {
			loading = false;
		}
	});
</script>

<main class="share-page">
	{#if loading}
		<p>Loading shared chart…</p>
	{:else if error}
		<p>{error}</p>
	{:else if payload?.chartType === 'historical'}
		<HistoricalSpendingChart data={resolvedData} unit={payload.displaySettings.unit} frozen />
	{:else if payload?.chartType === 'cumulative'}
		<CumulativeSpendingChart
			data={resolvedData}
			unit={payload.displaySettings.unit}
			showComponents={payload.displaySettings.showComponents}
			frozen
		/>
	{:else if payload?.chartType === 'yearSpecific'}
		<YearSpecificChart
			data={resolvedData}
			year={payload.displaySettings.year}
			unit={payload.displaySettings.unit}
			showComponents={payload.displaySettings.showComponents}
			scaleTo100={payload.displaySettings.scaleTo100}
			frozen
		/>
	{:else if payload?.chartType === 'economySpecific'}
		<EconomySpecificChart
			data={resolvedData}
			economy={payload.displaySettings.economy}
			unit={payload.displaySettings.unit}
			showComponents={payload.displaySettings.showComponents}
			frozen
		/>
	{:else}
		<p>Unable to load shared chart.</p>
	{/if}
</main>
