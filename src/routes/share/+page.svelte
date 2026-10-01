<script>
	import { onMount } from 'svelte';

	import HistoricalSpendingChart from '$lib/components/charts/HistoricalSpendingChart.svelte';
	import { calculateEstimate } from '$lib/data/calculateEstimate.js';
	import { loadData } from '$lib/data/loadData.js';
	import CumulativeSpendingChart from '$lib/components/charts/CumulativeSpendingChart.svelte';
	import YearSpecificChart from '$lib/components/charts/YearSpecificChart.svelte';
	import EconomySpecificChart from '$lib/components/charts/EconomySpecificChart.svelte';
	import Receipt from '$lib/components/charts/receipt/Receipt.svelte';

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
	{:else if payload}
		<div class="share-page__card">
			<div class="share-page__chart">
				{#if payload.chartType === 'historical'}
					<HistoricalSpendingChart data={resolvedData} unit={payload.displaySettings.unit} frozen />
				{:else if payload.chartType === 'cumulative'}
					<CumulativeSpendingChart
						data={resolvedData}
						unit={payload.displaySettings.unit}
						showComponents={payload.displaySettings.showComponents}
						frozen
					/>
				{:else if payload.chartType === 'yearSpecific'}
					<YearSpecificChart
						data={resolvedData}
						year={payload.displaySettings.year}
						unit={payload.displaySettings.unit}
						showComponents={payload.displaySettings.showComponents}
						scaleTo100={payload.displaySettings.scaleTo100}
						frozen
					/>
				{:else if payload.chartType === 'economySpecific'}
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
			</div>

			<div class="share-page__receipt">
				<Receipt mode={payload.mode} assumptions={payload.assumptions} />
			</div>
		</div>
	{:else}
		<p>Unable to load shared chart.</p>
	{/if}
</main>

<style>
	.share-page {
		width: 100%;
		padding: 2rem;
		background: var(--color-bg);
	}

	.share-page__card {
		display: grid;
		grid-template-columns: minmax(0, 2fr) minmax(300px, 1fr);
		gap: 2rem;
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		background: var(--color-white);
	}

	.share-page__chart {
		min-width: 0;
	}

	.share-page__receipt {
		min-width: 0;
		padding-left: 2rem;
		border-left: 1px solid var(--color-neutral-300);
	}

	@media (max-width: 900px) {
		.share-page__card {
			grid-template-columns: minmax(0, 1fr);
		}

		.share-page__receipt {
			padding-top: 2rem;
			padding-left: 0;
			border-top: 1px solid var(--color-neutral-300);
			border-left: 0;
		}
	}

	@media (max-width: 600px) {
		.share-page {
			padding: 1rem;
		}

		.share-page__card {
			padding: 1rem;
		}
	}
</style>