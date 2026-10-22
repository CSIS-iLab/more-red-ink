<script>
	import { onMount } from 'svelte';
	import { goto, beforeNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';

	import HistoricalSpendingChart from '$lib/components/charts/HistoricalSpendingChart.svelte';
	import CumulativeSpendingChart from '$lib/components/charts/CumulativeSpendingChart.svelte';
	import YearSpecificChart from '$lib/components/charts/YearSpecificChart.svelte';
	import EconomySpecificChart from '$lib/components/charts/EconomySpecificChart.svelte';
	import Receipt from '$lib/components/charts/receipt/Receipt.svelte';
	import BackLink from '$lib/components/controls/BackLink.svelte';
	import TextLink from '$lib/components/controls/TextLink.svelte';
	import { calculateEstimate } from '$lib/data/calculateEstimate.js';
	import { loadData } from '$lib/data/loadData.js';
	import { buildShareUrl } from '$lib/sharing/buildShareUrl.js';
	import { calculatorState } from '$lib/stores/calculatorState.js';

	let resolvedData = $state([]);
	let loading = $state(true);
	let error = $state(null);

	beforeNavigate(({ to }) => {
		if (to?.route?.id === '/fast-track' || to?.route?.id === '/user-driven') {
			calculatorState.resetChartSettings();
		}
	});

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

	// A new estimate starts at Home's "Using the Calculator" section: people
	// coming from here have already read the introduction.
	const newEstimateHref = `${resolve('/')}#using-the-calculator`;

	const handleNewEstimate = async (event) => {
		event.preventDefault();
		// Built from resolve('/'); the lint rule doesn't allow for the hash.
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		await goto(newEstimateHref);
		calculatorState.reset();
	};
</script>

<svelte:head>
	<title>Visualizer | More Red Ink Calculator</title>
</svelte:head>

<div class="visualizer">
	<aside class="visualizer__summary">
		<div class="visualizer__summary-inner">
			<nav class="visualizer__nav" aria-label="Estimate">
				<BackLink href={backHref} />

				<TextLink href={newEstimateHref} onclick={handleNewEstimate}>
					Create a new estimate
				</TextLink>
			</nav>

			<Receipt
				mode={$calculatorState.mode}
				assumptions={$calculatorState.mode === 'fastTrack'
					? $calculatorState.fastTrackChoice
					: $calculatorState.userDrivenChoices}
			/>
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
				scaleTo100={$calculatorState.cumulative.scaleTo100}
				onScaleTo100Change={(value) => {
					calculatorState.updateChartSettings('cumulative', { scaleTo100: value });
				}}
				onUnitChange={(value) => {
					calculatorState.updateChartSettings('cumulative', { unit: value });
				}}
				onShowComponentsChange={(value) => {
					calculatorState.updateChartSettings('cumulative', { showComponents: value });
				}}
				share={shareUrl('cumulative')}
				mode={$calculatorState.mode}
				assumptions={$calculatorState.mode === 'fastTrack'
					? $calculatorState.fastTrackChoice
					: $calculatorState.userDrivenChoices}
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
				mode={$calculatorState.mode}
				assumptions={$calculatorState.mode === 'fastTrack'
					? $calculatorState.fastTrackChoice
					: $calculatorState.userDrivenChoices}
			/>

			<EconomySpecificChart
				data={resolvedData}
				economy={$calculatorState.economySpecific.economy}
				unit={$calculatorState.economySpecific.unit}
				showComponents={$calculatorState.economySpecific.showComponents}
				scaleTo100={$calculatorState.economySpecific.scaleTo100}
				onScaleTo100Change={(value) => {
					calculatorState.updateChartSettings('economySpecific', { scaleTo100: value });
				}}
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
				mode={$calculatorState.mode}
				assumptions={$calculatorState.mode === 'fastTrack'
					? $calculatorState.fastTrackChoice
					: $calculatorState.userDrivenChoices}
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

	/* The sidebar sticks below the 64px header (AppHeader) while the page
	   scrolls the charts, until the footer pushes it up; the Receipt table
	   scrolls inside it. */
	.visualizer__summary {
		position: sticky;
		top: 64px;
		min-width: 0;
		height: calc(100vh - 64px);
		max-height: calc(100vh - 64px); /* fallback for older browsers */
		max-height: calc(100dvh - 64px);
		background-color: var(--color-page);

		/* Divides the sidebar from the charts. */
		@media (width >= 1200px) {
			border-right: 1px solid var(--color-border-subtle);
		}
	}

	.visualizer__summary-inner {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		height: 100%;
		padding: 1.75rem;
	}

	/* Back on the left, "Create a new estimate" on the right. */
	.visualizer__nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.visualizer__summary-inner :global(.receipt) {
		flex: 1;
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
		min-height: calc(100vh - 64px);
		flex-direction: column;
		gap: 2rem;
		padding: 2rem 2.5rem;
		background-color: var(--color-surface-secondary);
	}

	.visualizer__status {
		margin: 0;
	}

	/* Below 1200px the Receipt section sits above the charts, on the page
	   grid (5vw margins): the text column (with Back and "Create a new
	   estimate") spans 6 columns and the table 8 of 12, centered; below
	   960px the table runs full width, and below 640px so does the text. */
	@media (max-width: 1199px) {
		.visualizer {
			grid-template-columns: minmax(0, 1fr);
		}

		/* Full height when stacked: the sidebar's viewport-height limit
		   only applies beside the charts. */
		.visualizer__summary {
			position: static;
			height: auto;
			max-height: none;
		}

		.visualizer__summary-inner {
			--grid-columns: 12;
			--grid-gutter: 1.5rem;
			/* Width of one grid column (resolved against each element's container). */
			--grid-column: calc(
				(100% - (var(--grid-columns) - 1) * var(--grid-gutter)) / var(--grid-columns)
			);
			--text-width: calc(6 * var(--grid-column) + 5 * var(--grid-gutter));
			--table-width: calc(8 * var(--grid-column) + 7 * var(--grid-gutter));

			gap: 2.25rem;
			padding: 2.5rem 5vw;
		}

		.visualizer__nav,
		.visualizer__summary-inner :global(.receipt__intro) {
			width: var(--text-width);
			margin-inline: auto;
		}

		.visualizer__summary-inner :global(.receipt__table) {
			width: var(--table-width);
			margin-inline: auto;
		}

		.visualizer__summary-inner :global(.receipt__table-scroll) {
			overflow: visible;
			scrollbar-gutter: auto;
		}

		.visualizer__summary-inner :global(.receipt__head-scroll) {
			overflow: visible;
			scrollbar-gutter: auto;
		}

		.visualizer__charts {
			min-height: 0;
			padding: 2rem 5vw;
		}
	}

	@media (max-width: 959px) {
		.visualizer__summary-inner {
			--grid-columns: 8;
			--grid-gutter: 1rem;
			--table-width: 100%;

			padding-top: 2.25rem;
			padding-bottom: 2.25rem;
		}
	}

	@media (max-width: 639px) {
		.visualizer__summary-inner {
			--text-width: 100%;

			padding-top: 2rem;
			padding-bottom: 2rem;
		}

		.visualizer__charts {
			gap: 1rem;
			padding: 1rem 5vw;
		}
	}
</style>
