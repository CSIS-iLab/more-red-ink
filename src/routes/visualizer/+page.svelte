<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	import HistoricalSpendingChart from '$lib/components/charts/HistoricalSpendingChart.svelte';
	import CumulativeSpendingChart from '$lib/components/charts/CumulativeSpendingChart.svelte';
	import YearSpecificChart from '$lib/components/charts/YearSpecificChart.svelte';
	import EconomySpecificChart from '$lib/components/charts/EconomySpecificChart.svelte';
	import Receipt from '$lib/components/charts/receipt/Receipt.svelte';
	import { calculateEstimate } from '$lib/data/calculateEstimate.js';
	import { loadData } from '$lib/data/loadData.js';
	import { buildShareUrl } from '$lib/sharing/buildShareUrl.js';
	import { calculatorState } from '$lib/stores/calculatorState.js';

	let resolvedData = $state([]);
	let loading = $state(true);
	let error = $state(null);

	const handleShare = async (chartType) => {
		const state = $calculatorState;

		const payload = {
			mode: state.mode,
			assumptions:
				state.mode === 'fastTrack' ? state.fastTrackChoice : { ...state.userDrivenChoices },
			chartType,
			displaySettings: { ...state[chartType] }
		};

		// buildShareUrl() builds its path with resolve('/share').
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		await goto(buildShareUrl(payload));
	};

	onMount(async () => {
		calculatorState.initialize();

		const state = $calculatorState;

		if (!state.mode) {
			await goto(resolve('/'));
			return;
		}

		if (!calculatorState.isEstimateComplete(state)) {
			const path = state.mode === 'fastTrack' ? '/fast-track' : '/user-driven';

			await goto(resolve(`${path}?incomplete=true`));
			return;
		}

		try {
			const sourceData = await loadData();

			resolvedData = calculateEstimate(sourceData, state);
		} catch (err) {
			console.error(err);
			error = 'Unable to load chart data.';
		} finally {
			loading = false;
		}
	});

	const handleNewEstimate = async () => {
		calculatorState.reset();
		await goto(resolve('/'));
	};
</script>

<div class="visualizer">
	<aside class="visualizer__summary">
		<div class="visualizer__summary-inner">
			<Receipt
				mode={$calculatorState.mode}
				assumptions={$calculatorState.mode === 'fastTrack'
					? $calculatorState.fastTrackChoice
					: $calculatorState.userDrivenChoices}
			/>

			<button class="visualizer__new-estimate" type="button" onclick={handleNewEstimate}>
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
				unit={$calculatorState.historical.unit}
				onUnitChange={(value) => {
					calculatorState.updateChartSettings('historical', { unit: value });
				}}
				share={() => handleShare('historical')}
			/>

			<CumulativeSpendingChart
				data={resolvedData}
				unit={$calculatorState.cumulative.unit}
				showComponents={$calculatorState.cumulative.showComponents}
				onUnitChange={(value) => {
					calculatorState.updateChartSettings('cumulative', { unit: value });
				}}
				onShowComponentsChange={(value) => {
					calculatorState.updateChartSettings('cumulative', { showComponents: value });
				}}
				share={() => handleShare('cumulative')}
			/>

			<YearSpecificChart
				data={resolvedData}
				year={$calculatorState.yearSpecific.year}
				unit={$calculatorState.yearSpecific.unit}
				showComponents={$calculatorState.yearSpecific.showComponents}
				scaleTo100={$calculatorState.yearSpecific.scaleTo100}
				onYearChange={(value) => {
					calculatorState.updateChartSettings('yearSpecific', { year: value });
				}}
				onUnitChange={(value) => {
					calculatorState.updateChartSettings('yearSpecific', { unit: value });
				}}
				onShowComponentsChange={(value) => {
					calculatorState.updateChartSettings('yearSpecific', { showComponents: value });
				}}
				onScaleTo100Change={(value) => {
					calculatorState.updateChartSettings('yearSpecific', { scaleTo100: value });
				}}
				share={() => handleShare('yearSpecific')}
			/>

			<EconomySpecificChart
				data={resolvedData}
				economy={$calculatorState.economySpecific.economy}
				unit={$calculatorState.economySpecific.unit}
				showComponents={$calculatorState.economySpecific.showComponents}
				onEconomyChange={(value) => {
					calculatorState.updateChartSettings('economySpecific', { economy: value });
				}}
				onUnitChange={(value) => {
					calculatorState.updateChartSettings('economySpecific', { unit: value });
				}}
				onShowComponentsChange={(value) => {
					calculatorState.updateChartSettings('economySpecific', { showComponents: value });
				}}
				share={() => handleShare('economySpecific')}
			/>
		{/if}
	</main>
</div>

<style>
	.visualizer {
		display: grid;
		grid-template-columns: 392px minmax(0, 1fr);
		align-items: stretch;
		width: 100%;
	}

	.visualizer__summary {
		min-width: 0;
		background-color: var(--color-page);
	}

	.visualizer__summary-inner {
		position: sticky;
		top: 0;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		padding: 2.5rem;
	}

	.visualizer__new-estimate {
		align-self: flex-start;
		padding: 0.75rem 1rem;
		border: 1px solid currentColor;
		border-radius: 3px;
		background: transparent;
		font: inherit;
	}

	.visualizer__charts {
		display: flex;
		min-width: 0;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		padding: 2rem;
		background-color: var(--color-surface-secondary);
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
