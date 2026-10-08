<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	import HistoricalSpendingChart from '$lib/components/charts/HistoricalSpendingChart.svelte';
	import CumulativeSpendingChart from '$lib/components/charts/CumulativeSpendingChart.svelte';
	import YearSpecificChart from '$lib/components/charts/YearSpecificChart.svelte';
	import EconomySpecificChart from '$lib/components/charts/EconomySpecificChart.svelte';
	import Receipt from '$lib/components/charts/receipt/Receipt.svelte';
	import BackLink from '$lib/components/controls/BackLink.svelte';
	import Button from '$lib/components/controls/Button.svelte';
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

<svelte:head>
	<title>Visualizer | More Red Ink Calculator</title>
</svelte:head>

<div class="visualizer">
	<aside class="visualizer__summary">
		<div class="visualizer__summary-inner">
			<BackLink
				href={$calculatorState.mode === 'fastTrack'
					? resolve('/fast-track')
					: resolve('/user-driven')}
			/>

			<Receipt
				mode={$calculatorState.mode}
				assumptions={$calculatorState.mode === 'fastTrack'
					? $calculatorState.fastTrackChoice
					: $calculatorState.userDrivenChoices}
			/>

			<div class="visualizer__new-estimate">
				<Button variant="ghost" onclick={handleNewEstimate}>Create a new estimate</Button>
			</div>
		</div>
	</aside>

	<div class="visualizer__charts">
		{#if loading}
			<p class="visualizer__status text-body-2-regular" role="status">Loading charts…</p>
		{:else if error}
			<p class="visualizer__status text-body-2-regular" role="alert">{error}</p>
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
	</div>
</div>

<style>
	.visualizer {
		display: grid;
		grid-template-columns: 36rem minmax(0, 1fr);
		align-items: start;
		width: 100%;
	}

	/* The sidebar stays in view while the charts scroll; the Receipt table
	   scrolls inside it. */
	.visualizer__summary {
		position: sticky;
		top: 0;
		min-width: 0;
		height: 100vh;
		background-color: var(--color-page);
	}

	.visualizer__summary-inner {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		height: 100%;
		padding: 2.5rem 1.75rem;
	}

	.visualizer__summary-inner :global(.receipt) {
		flex: 1;
		min-height: 0;
	}

	.visualizer__summary-inner :global(.receipt__table-scroll) {
		flex: 1;
		overflow-y: auto;
	}

	.visualizer__summary-inner :global(.receipt__table thead th) {
		position: sticky;
		top: 0;
		background: var(--color-page);
	}

	.visualizer__charts {
		display: flex;
		min-width: 0;
		min-height: 100vh;
		flex-direction: column;
		gap: 2rem;
		padding: 2rem 2.5rem;
		background-color: var(--color-surface-secondary);
	}

	.visualizer__status {
		margin: 0;
	}

	/* Below 1200px the Receipt section sits above the charts. */
	@media (max-width: 1199px) {
		.visualizer {
			grid-template-columns: minmax(0, 1fr);
		}

		.visualizer__summary {
			position: static;
			height: auto;
		}

		.visualizer__summary-inner {
			width: min(100%, 27rem + 3.5rem);
			margin: 0 auto;
		}

		.visualizer__summary-inner :global(.receipt__table-scroll) {
			overflow: visible;
		}

		.visualizer__new-estimate {
			display: flex;
			justify-content: center;
		}

		.visualizer__charts {
			min-height: 0;
			padding: 1.5rem;
		}
	}

	@media (max-width: 639px) {
		.visualizer__summary-inner {
			padding: 2rem 1rem;
		}

		.visualizer__charts {
			gap: 1rem;
			padding: 1rem;
		}
	}
</style>
