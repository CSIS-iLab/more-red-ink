<script>
	import { getContext, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	import HistoricalSpendingChart from '$lib/components/charts/HistoricalSpendingChart.svelte';
	import { calculateEstimate } from '$lib/data/calculateEstimate.js';
	import { loadData } from '$lib/data/loadData.js';
	import CumulativeSpendingChart from '$lib/components/charts/CumulativeSpendingChart.svelte';
	import YearSpecificChart from '$lib/components/charts/YearSpecificChart.svelte';
	import EconomySpecificChart from '$lib/components/charts/EconomySpecificChart.svelte';
	import Receipt from '$lib/components/charts/receipt/Receipt.svelte';
	import Button from '$lib/components/controls/Button.svelte';
	import { buildShareUrl } from '$lib/sharing/buildShareUrl.js';
	import { parseShareUrl } from '$lib/sharing/parseShareUrl.js';
	import { getEstimateState } from '$lib/sharing/sharePayload.js';
	import { calculatorState } from '$lib/stores/calculatorState.js';
	import { REPORT_URL } from '$lib/utils/links.js';
	import { receiptContent } from '$lib/utils/receiptContent.js';

	let payload = $state(null);
	let resolvedData = $state([]);
	let loading = $state(true);
	// 'link' (missing, invalid, or unusable share link) or 'data' (couldn't load).
	let error = $state(null);

	// TODO: the 'data' copy is a draft; the approved design only covers 'link'.
	const ERROR_CONTENT = {
		link: {
			heading: 'Page not found.',
			text: 'The link may be incorrect or incomplete.'
		},
		data: {
			heading: 'Something went wrong.',
			text: "The data for this chart couldn't be loaded. Please try again later."
		}
	};

	let errorContent = $derived(ERROR_CONTENT[error ?? 'link']);

	// The header names the broken-link state "Invalid URL" (approved design).
	const pageNameOverride = getContext('pageNameOverride');

	$effect(() => {
		pageNameOverride.value = error === 'link' ? 'Invalid URL' : null;

		return () => {
			pageNameOverride.value = null;
		};
	});

	// Show the broken-link message, logging the specific reason for debugging.
	const failLink = (reason) => {
		console.warn(`Share link can't be displayed: ${reason}`);
		error = 'link';
	};

	let copyStatus = $state(null);

	onMount(async () => {
		try {
			const { payload: parsedPayload, error: payloadError } = parseShareUrl(page.url.searchParams);

			if (payloadError) {
				failLink(payloadError);
				return;
			}

			const sourceData = await loadData();

			if (
				parsedPayload.chartType === 'economySpecific' &&
				!sourceData.some((row) => row.country === parsedPayload.displaySettings.economy)
			) {
				failLink('the shared economy is not available in the source data.');
				return;
			}

			resolvedData = calculateEstimate(sourceData, getEstimateState(parsedPayload));

			if (resolvedData.length === 0) {
				failLink('the shared estimate could not be calculated.');
				return;
			}

			payload = parsedPayload;
		} catch (err) {
			console.error(err);
			error = 'data';
		} finally {
			loading = false;
		}
	});

	// Copy the canonical link, rebuilt from the parsed payload, so any extra
	// parameters added to the address (such as tracking codes) are dropped.
	const handleCopyLink = async () => {
		const url = new URL(buildShareUrl(payload), page.url.origin).href;

		try {
			await navigator.clipboard.writeText(url);
			copyStatus = 'copied';
		} catch (err) {
			console.error(err);
			copyStatus = 'failed';
		}

		setTimeout(() => {
			copyStatus = null;
		}, 3000);
	};

	const handleNewEstimate = async () => {
		calculatorState.reset();
		await goto(resolve('/'));
	};
</script>

<svelte:head>
	<title>{error === 'link' ? 'Invalid URL' : 'Share'} | More Red Ink Calculator</title>
</svelte:head>

<div class="share-page" class:share-page--error={!loading && !payload}>
	{#if loading}
		<p class="share-page__status text-body-2-regular" role="status">Loading shared chart…</p>
	{:else if payload}
		<h1 class="visually-hidden">Shared chart</h1>

		<article class="share-page__card">
			<div class="share-page__chart">
				{#if payload.chartType === 'historical'}
					<HistoricalSpendingChart data={resolvedData} unit={payload.displaySettings.unit} frozen />
				{:else if payload.chartType === 'cumulative'}
					<CumulativeSpendingChart
						data={resolvedData}
						unit={payload.displaySettings.unit}
						showComponents={payload.displaySettings.showComponents}
						scaleTo100={payload.displaySettings.scaleTo100}
						frozen
						mode={payload.mode}
						assumptions={payload.assumptions}
					/>
				{:else if payload.chartType === 'yearSpecific'}
					<YearSpecificChart
						data={resolvedData}
						year={payload.displaySettings.year}
						unit={payload.displaySettings.unit}
						showComponents={payload.displaySettings.showComponents}
						scaleTo100={payload.displaySettings.scaleTo100}
						frozen
						mode={payload.mode}
						assumptions={payload.assumptions}
					/>
				{:else if payload.chartType === 'economySpecific'}
					<EconomySpecificChart
						data={resolvedData}
						economy={payload.displaySettings.economy}
						unit={payload.displaySettings.unit}
						showComponents={payload.displaySettings.showComponents}
						scaleTo100={payload.displaySettings.scaleTo100}
						frozen
						mode={payload.mode}
						assumptions={payload.assumptions}
					/>
				{/if}
			</div>

			<div class="share-page__receipt">
				<Receipt
					mode={payload.mode}
					assumptions={payload.assumptions}
					intro={receiptContent.shareIntro}
				/>

				<footer class="share-page__attribution">
					<p>
						This chart was generated by the Industrial Policy Spending Calculator, a tool that
						complements the report
						<!-- External link, so resolve() doesn't apply. -->
						<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
						<a href={REPORT_URL} target="_blank" rel="noreferrer"
							>More Red Ink: The Emerging Industrial Policy Spending Arms Race by China and Others</a
						>.
					</p>

					<img
						class="share-page__logo"
						src="/logos/csis-trustee-chair.svg"
						alt="CSIS Trustee Chair in Chinese Business & Economics"
						width="249"
						height="29"
					/>
				</footer>
			</div>
		</article>

		<div class="share-page__actions">
			<Button variant="ghost" onclick={handleCopyLink}>
				{copyStatus === 'copied' ? 'Link copied' : 'Copy link'}
			</Button>

			<Button variant="ghost" onclick={handleNewEstimate}>Create a new estimate</Button>

			<Button variant="ghost" href={REPORT_URL} target="_blank" rel="noreferrer">
				Read the report
				<img src="/icons/external-link.svg" alt="" />
				<span class="visually-hidden">(opens in a new tab)</span>
			</Button>
		</div>

		<!-- The button label confirms a copy; only a failure needs visible text. -->
		<p
			class="share-page__copy-status text-label-small"
			class:visually-hidden={copyStatus !== 'failed'}
			aria-live="polite"
		>
			{#if copyStatus === 'copied'}
				Link copied to your clipboard.
			{:else if copyStatus === 'failed'}
				Couldn't copy the link. Copy it from your browser's address bar instead.
			{/if}
		</p>
	{:else}
		<div class="share-page__error" role="alert">
			<h1 class="share-page__error-heading text-heading-2">{errorContent.heading}</h1>
			<p class="share-page__error-text text-body-2-regular">{errorContent.text}</p>

			<div class="share-page__error-actions">
				<Button variant="primary" href={resolve('/')}>Back to home</Button>
			</div>
		</div>
	{/if}
</div>

<style>
	.share-page {
		--share-padding-x: 4.5rem;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2.5rem;
		width: 100%;
		padding: 2.5rem var(--share-padding-x);
		background: var(--color-page);
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.share-page__status {
		margin: 0;
	}

	/* ---------------------------- error --------------------------- */

	/* Centered in the space between the header and footer, like Figma's
	   error frame. */
	.share-page--error {
		flex: 1;
		/* Fills the screen below the 64px header (AppHeader). */
		min-height: calc(100vh - 64px);
		justify-content: center;
		padding-top: 0;
		padding-bottom: 0;
	}

	.share-page__error {
		width: min(100%, 39.75rem);
	}

	.share-page__error-heading {
		margin: 0;
		padding: 4.5rem 0 1.125rem;
		color: var(--color-text-primary);
		line-height: 1.1;
	}

	.share-page__error-text {
		margin: 0;
		color: var(--color-text-primary);
		line-height: 1.5;
	}

	.share-page__error-actions {
		display: flex;
		padding: 2.5rem 0;
	}

	/* ---------------------------- card ---------------------------- */

	/* Chart and Receipt side by side, split by a 1px divider. */
	.share-page__card {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 30.5rem;
		width: 100%;
		max-width: 81rem;
		background: var(--color-surface-primary);
	}

	.share-page__chart {
		min-width: 0;
		padding: 2.5rem 2.25rem 2.25rem 2.5rem;
		border-right: 1px solid var(--color-border-subtle);
	}

	/* The Receipt column takes the chart's height (it doesn't size the
	   row), and the table rows scroll to fit. */
	.share-page__receipt {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		min-width: 0;
		padding: 2.5rem 1.75rem 1.5rem;
		contain: size;
	}

	.share-page__receipt :global(.receipt) {
		flex: 1;
		min-height: 0;
	}

	.share-page__receipt :global(.receipt__table) {
		flex: 1;
	}

	.share-page__receipt :global(.receipt__table-scroll) {
		flex: 1;
		overflow-y: auto;
		scrollbar-gutter: stable;
	}

	/* The header reserves the same scrollbar space so the columns line up. */
	.share-page__receipt :global(.receipt__head-scroll) {
		overflow-y: hidden;
		scrollbar-gutter: stable;
	}

	/* Share intro: a label and one line of text (not the Visualizer heading). */
	.share-page__receipt :global(.receipt__intro) {
		gap: 0.5rem;
	}

	.share-page__receipt :global(.receipt__heading) {
		font-family: var(--font-label);
		font-size: var(--font-size-xx-small);
		font-weight: var(--font-weight-medium);
		line-height: 1.2;
	}

	.share-page__receipt :global(.receipt__intro p) {
		font-size: var(--font-size-xxx-small);
	}

	/* ------------------------- attribution ------------------------ */

	.share-page__attribution {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 1rem;
	}

	.share-page__attribution p {
		margin: 0;
		color: var(--color-text-helper);
		font-family: var(--font-label);
		font-size: 0.75rem;
		line-height: 1.2;
	}

	.share-page__attribution a {
		color: inherit;
	}

	.share-page__logo {
		flex-shrink: 0;
		width: 15.75rem;
		height: auto;
	}

	/* --------------------------- actions -------------------------- */

	.share-page__actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1.5rem;
	}

	/* Figma: 12px/20px padding (16px right of an icon), less the 1px border. */
	.share-page__actions :global(.action) {
		padding: calc(0.75rem - 1px) calc(1.25rem - 1px);
	}

	.share-page__actions :global(a.action) {
		padding-right: calc(1rem - 1px);
	}

	.share-page__actions :global(.action img) {
		width: 1.125rem;
		height: 1.125rem;
	}

	.share-page__copy-status {
		margin: -1.5rem 0 0;
		text-align: center;
	}

	@media (max-width: 1439px) {
		.share-page {
			--share-padding-x: 4rem;
		}
	}

	/* Below 1200px the Receipt sits under the chart, divided by an inset
	   line, and the table shows every row. */
	@media (max-width: 1199px) {
		.share-page {
			--share-padding-x: 3rem;

			padding-top: 2.25rem;
			padding-bottom: 2.25rem;
		}

		.share-page__card {
			grid-template-columns: minmax(0, 1fr);
			max-width: 54rem;
		}

		.share-page__chart {
			padding: 2.25rem 2.25rem 2.25rem 2.5rem;
			border-right: 0;
		}

		.share-page__receipt {
			margin: 0 1.5rem;
			padding: 2.5rem 1rem;
			border-top: 1px solid var(--color-border-subtle);
			contain: none;
		}

		.share-page__receipt :global(.receipt__table-scroll),
		.share-page__receipt :global(.receipt__head-scroll) {
			overflow: visible;
			scrollbar-gutter: auto;
		}

		/* Text on the left, logo on the right. */
		.share-page__attribution {
			flex-direction: row;
			align-items: flex-end;
			justify-content: space-between;
			gap: 0.75rem;
		}

		.share-page__attribution p {
			max-width: 30.75rem;
		}
	}

	@media (max-width: 959px) {
		.share-page {
			--share-padding-x: 2rem;
		}

		.share-page__attribution {
			flex-direction: column;
			gap: 1rem;
		}

		.share-page__attribution p {
			max-width: none;
		}

		/* Buttons stack, all the same width. */
		.share-page__actions {
			display: grid;
			grid-auto-rows: auto;
			gap: 1rem;
		}
	}

	/* Phones: one padded column, with Receipt cards. */
	@media (max-width: 639px) {
		.share-page {
			--share-padding-x: 1rem;
		}

		.share-page__card {
			gap: 1.75rem;
			padding: 1rem;
		}

		.share-page__chart {
			padding: 0;
		}

		.share-page__receipt {
			margin: 0;
			padding: 1.75rem 0 0;
		}

		.share-page__logo {
			width: min(15.75rem, 100%);
		}
	}
</style>
