<script>
	import { onMount } from 'svelte';

	import HistoricalSpendingChart from '$lib/components/charts/HistoricalSpendingChart.svelte';
	import CumulativeSpendingChart from '$lib/components/charts/CumulativeSpendingChart.svelte';
	import YearSpecificChart from '$lib/components/charts/YearSpecificChart.svelte';
	import EconomySpecificChart from '$lib/components/charts/EconomySpecificChart.svelte';
	import { calculateEstimate } from '$lib/data/calculateEstimate.js';
	import { loadData } from '$lib/data/loadData.js';

	let historicalUnit = $state('pct_gdp');

	let cumulativeUnit = $state('pct_gdp');
	let cumulativeShowComponents = $state(false);

	let yearSpecificYear = $state(2019);
	let yearSpecificUnit = $state('pct_gdp');
	let yearSpecificShowComponents = $state(true);
	let yearSpecificScaleTo100 = $state(false);

	let economySpecificEconomy = $state('China');
	let economySpecificUnit = $state('pct_gdp');
	let economySpecificShowComponents = $state(true);

	let resolvedData = $state([]);
	let loading = $state(true);
	let error = $state(null);

	// TEMPORARY: Load and resolve a Fast Track Minimum estimate so the Visualizer
	// can be reviewed with real data. Replace with calculator-state integration in #17.
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

<div class="visualizer">
	<aside class="visualizer__summary">
		<div class="visualizer__summary-inner">
			<!-- TEMPORARY: Receipt.svelte will replace this placeholder in #11. -->
			<div class="visualizer__receipt-placeholder">
				<h2>Understanding Industrial Policy Spending</h2>

				<p>
					The estimate summary and assumptions used to calculate this estimate will appear here.
				</p>
			</div>

			<!-- TEMPORARY: Reset/navigation behavior will be implemented during Visualizer integration. -->
			<button class="visualizer__new-estimate" type="button" disabled>
				Create a new estimate
			</button>
		</div>
	</aside>

	<main class="visualizer__charts">
		{#if loading}
			<p class="visualizer__status">Loading charts…</p>
		{:else if error}
			<p class="visualizer__status">{error}</p>
		{:else}
			<HistoricalSpendingChart
				data={resolvedData}
				unit={historicalUnit}
				onUnitChange={(value) => {
					historicalUnit = value;
				}}
			/>

			<CumulativeSpendingChart
				data={resolvedData}
				unit={cumulativeUnit}
				showComponents={cumulativeShowComponents}
				onUnitChange={(value) => {
					cumulativeUnit = value;
				}}
				onShowComponentsChange={(value) => {
					cumulativeShowComponents = value;
				}}
			/>

			<YearSpecificChart
				data={resolvedData}
				year={yearSpecificYear}
				unit={yearSpecificUnit}
				showComponents={yearSpecificShowComponents}
				scaleTo100={yearSpecificScaleTo100}
				onYearChange={(value) => {
					yearSpecificYear = value;
				}}
				onUnitChange={(value) => {
					yearSpecificUnit = value;
				}}
				onShowComponentsChange={(value) => {
					yearSpecificShowComponents = value;
				}}
				onScaleTo100Change={(value) => {
					yearSpecificScaleTo100 = value;
				}}
			/>

			<EconomySpecificChart
				data={resolvedData}
				economy={economySpecificEconomy}
				unit={economySpecificUnit}
				showComponents={economySpecificShowComponents}
				onEconomyChange={(value) => {
					economySpecificEconomy = value;
				}}
				onUnitChange={(value) => {
					economySpecificUnit = value;
				}}
				onShowComponentsChange={(value) => {
					economySpecificShowComponents = value;
				}}
			/>
		{/if}
	</main>
</div>

<style>
	.visualizer {
		display: grid;
		grid-template-columns: minmax(300px, 34%) minmax(0, 1fr);
		align-items: stretch;
		width: 100%;
	}

	.visualizer__summary {
		min-width: 0;
		background-color: var(--color-bg);
	}

	.visualizer__summary-inner {
		position: sticky;
		top: 0;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		padding: 2.5rem;
	}

	.visualizer__receipt-placeholder {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.visualizer__receipt-placeholder h2,
	.visualizer__receipt-placeholder p {
		margin: 0;
	}

	.visualizer__new-estimate {
		align-self: flex-start;
		padding: 0.75rem 1rem;
		border: 1px solid currentColor;
		border-radius: 3px;
		background: transparent;
		font: inherit;
	}

	.visualizer__new-estimate:disabled {
		cursor: not-allowed;
		opacity: 0.55;
	}

	.visualizer__charts {
		display: flex;
		min-width: 0;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		padding: 2rem;
		background-color: var(--color-surface-primary);
	}

	.visualizer__status {
		margin: 0;
	}

	@media (max-width: 900px) {
		.visualizer {
			grid-template-columns: minmax(0, 1fr);
		}

		.visualizer__summary-inner {
			position: static;
			padding: 1.5rem;
		}

		.visualizer__charts {
			padding: 1.5rem;
		}
	}

	@media (max-width: 600px) {
		.visualizer__summary-inner,
		.visualizer__charts {
			padding: 1rem;
		}
	}
</style>
