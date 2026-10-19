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

	// Share URL for one chart's current estimate and settings. The Share
	// buttons link to it (opening a new tab) and update as settings change.
	const shareUrl = (chartType) => {
		const state = $calculatorState;

		return buildShareUrl({
			mode: state.mode,
			assumptions:
				state.mode === 'fastTrack' ? state.fastTrackChoice : { ...state.userDrivenChoices },
			chartType,
			displaySettings: { ...state[chartType] }
		});
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

	// Back returns to the assumptions form for an active estimate, or Home
	// when there's no active session.
	// (BackLink resolves the path itself.)
	let backHref = $derived(
		$calculatorState.mode === 'fastTrack'
			? '/fast-track'
			: $calculatorState.mode === 'userDriven'
				? '/user-driven'
				: '/'
	);

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
			<BackLink href={backHref} />

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
				share={shareUrl('historical')}
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
				share={shareUrl('cumulative')}
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
				share={shareUrl('yearSpecific')}
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
				share={shareUrl('economySpecific')}
			/>
		{/if}
	</div>
</div>

<style>
	.visualizer {
		display: grid;
		/* Sidebar: Figma's 576px at 1440px, scaling down to 416px so the
		   charts keep enough room on smaller laptops. */
		grid-template-columns: clamp(26rem, 40vw, 36rem) minmax(0, 1fr);
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
		/* flex: 1; */
		min-height: 0;
	}

	.visualizer__summary-inner :global(.receipt__table-scroll) {
		flex: 1;
		overflow-y: auto;
	}

	/* The rows scroll under a fixed header; space for the scrollbar is
	   kept beside both so their columns line up. */
	.visualizer__summary-inner :global(.receipt__table) {
		flex: 1;
	}

	.visualizer__summary-inner :global(.receipt__table-scroll) {
		scrollbar-gutter: stable;
	}

	/* The header reserves the same scrollbar space without drawing one. */
	.visualizer__summary-inner :global(.receipt__head-scroll) {
		overflow-y: hidden;
		scrollbar-gutter: stable;
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

		/* The Receipt column is centered and maxes out at 45.75rem
		   (plus side padding). */
		.visualizer__summary-inner {
			--summary-padding-x: 3rem;

			width: 100%;
			max-width: calc(45.75rem + 2 * var(--summary-padding-x));
			gap: 2.25rem;
			margin: 0 auto;
			padding: 2.5rem var(--summary-padding-x);
		}

		/* The text above the Receipt is centered and maxes out at 39.75rem,
		   matching the content width of the other pages. */
		.visualizer__summary-inner :global(.receipt__intro) {
			width: 100%;
			max-width: 39.75rem;
			margin: 0 auto;
		}

		.visualizer__summary-inner :global(.receipt__table-scroll) {
			overflow: visible;
			scrollbar-gutter: auto;
		}

		.visualizer__summary-inner :global(.receipt__head-scroll) {
			overflow: visible;
			scrollbar-gutter: auto;
		}

		.visualizer__new-estimate {
			display: flex;
			justify-content: center;
		}

		.visualizer__charts {
			min-height: 0;
			padding: 2rem;
		}
	}

	@media (max-width: 959px) {
		.visualizer__summary-inner {
			--summary-padding-x: 2rem;

			padding-top: 2.25rem;
			padding-bottom: 2.25rem;
		}
	}

	@media (max-width: 639px) {
		.visualizer__summary-inner {
			--summary-padding-x: 1rem;

			padding-top: 2rem;
			padding-bottom: 2rem;
		}

		.visualizer__charts {
			gap: 1rem;
			padding: 1rem;
		}
	}
</style>
