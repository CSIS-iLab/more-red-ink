<!--
  Receipt

  Summarizes the assumptions behind an estimate, one row per spending tool.

  Props:
  - mode, assumptions: the estimate's mode and its Fast Track choice or
    User Driven choices.
  - intro: { label, description } shown above the table
    (receiptContent.intro by default; the Share page passes shareIntro).

  Shows a table on wider screens and one card per spending tool on phones.
  All copy comes from receiptContent.js.
-->

<script>
	import { getReceiptText, receiptContent } from '$lib/utils/receiptContent.js';
	import { spendingComponents } from '$lib/utils/spendingComponents.js';

	let { mode, assumptions, intro = receiptContent.intro } = $props();

	const MISSING = '—';

	let choices = $derived(
		mode === 'fastTrack' ? { mode, fastTrackChoice: assumptions } : { mode, ...assumptions }
	);

	let rows = $derived(
		Object.entries(spendingComponents).map(([key, component]) => {
			const content = receiptContent.rows[key];
			const china = getReceiptText(content.china, choices) ?? MISSING;
			const otherEconomies = getReceiptText(content.otherEconomies, choices) ?? MISSING;

			return {
				key,
				label: getReceiptText(content.label, choices) ?? component.label,
				china,
				otherEconomies,
				// One merged cell when both columns say the same thing.
				shared: china === otherEconomies
			};
		})
	);
</script>

<section class="receipt">
	<div class="receipt__intro">
		<h2 class="receipt__heading">{intro.label}</h2>

		{#each intro.description as paragraph (paragraph)}
			<p class="text-body-3-regular">{paragraph}</p>
		{/each}
	</div>

	<!-- Wider screens: table. The visible header row sits outside the
	     scrolling area (screen readers use the hidden copy in the table). -->
	<div class="receipt__table">
		<div class="receipt__head-scroll">
			<table class="receipt__grid receipt__head" aria-hidden="true">
				{@render columns()}
				<thead>
					<tr>
						<th>{receiptContent.columns.component}</th>
						<th>{receiptContent.columns.china}</th>
						<th>{receiptContent.columns.otherEconomies}</th>
					</tr>
				</thead>
			</table>
		</div>

		<div class="receipt__table-scroll">
			<table class="receipt__grid">
				{@render columns()}
				<thead class="receipt__hidden-head">
					<tr>
						<th scope="col">{receiptContent.columns.component}</th>
						<th scope="col">{receiptContent.columns.china}</th>
						<th scope="col">{receiptContent.columns.otherEconomies}</th>
					</tr>
				</thead>

				<tbody>
					{#each rows as row (row.key)}
						<tr>
							<th scope="row">{row.label}</th>

							{#if row.shared}
								<td colspan="2">{row.china}</td>
							{:else}
								<td>{row.china}</td>
								<td>{row.otherEconomies}</td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	{#snippet columns()}
		<colgroup>
			<col class="receipt__component-column" />
			<col />
			<col />
		</colgroup>
	{/snippet}

	<!-- Phones: one card per spending tool -->
	<ul class="receipt__cards">
		{#each rows as row (row.key)}
			<li class="receipt__card">
				<h3 class="receipt__card-title">{row.label}</h3>

				<dl class="receipt__card-body">
					<div>
						<dt>{receiptContent.columns.china}</dt>
						<dd>{row.china}</dd>
					</div>

					<div>
						<dt>{receiptContent.columns.otherEconomies}</dt>
						<dd>{row.otherEconomies}</dd>
					</div>
				</dl>
			</li>
		{/each}
	</ul>
</section>

<style>
	.receipt {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		width: 100%;
		min-width: 0;
	}

	/* ---------------------------- intro ---------------------------- */

	/* 12px from the heading to the text; a blank line between paragraphs. */
	.receipt__intro {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.receipt__intro p + p {
		margin-top: 1.2em;
	}

	.receipt__heading {
		margin: 0;
		color: var(--color-text-primary);
		font-family: var(--font-heading);
		font-size: var(--font-size-small);
		font-weight: var(--font-weight-semibold);
		line-height: 1.1;
	}

	.receipt__intro p {
		margin: 0;
		color: var(--color-text-secondary);
		line-height: 1.2;
	}

	/* ---------------------------- table ---------------------------- */

	.receipt__table {
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	.receipt__table-scroll {
		min-height: 0;
	}

	.receipt__grid {
		width: 100%;
		border-collapse: separate;
		border-spacing: 0 4px;
		table-layout: fixed;
	}

	.receipt__grid th:nth-child(1),
	.receipt__grid td:nth-child(1),
	.receipt__grid th:nth-child(2),
	.receipt__grid td:nth-child(2):not([colspan]) {
		border-right: 2px solid var(--receipt-divider-color, var(--color-page));
	}

	/* Align the separate header table with the scrollable body table.
   The body loses 24px to the custom scrollbar; the header wrapper
   already reserves 15px, leaving a 9px difference to compensate for. */
	.receipt__head-scroll {
		padding-right: 9px;
	}

	.receipt__component-column {
		width: 8rem;
	}

	.receipt__head th {
		padding: 4px 8px 4px 4px;
		color: var(--color-text-helper);
		font-family: var(--font-metadata);
		font-size: var(--font-size-xxx-small);
		font-weight: var(--font-weight-medium);
		line-height: 1.2;
		text-align: left;
		text-transform: uppercase;
		vertical-align: top;
	}

	/* The data table's own header row, for screen readers only. */
	.receipt__hidden-head th {
		height: 0;
		padding: 0;
		overflow: hidden;
		font-size: 0;
		line-height: 0;
	}

	/* Pull the rows up over the hidden header row's spacing so they start
	   right under the visible header. */
	.receipt__table-scroll .receipt__grid {
		margin-top: -8px;
	}

	.receipt__grid tbody th,
	.receipt__grid tbody td {
		padding: 10px;
		background: var(--color-table-row);
		font-family: var(--font-body);
		font-size: var(--font-size-xx-small);
		line-height: 1.2;
		text-align: left;
		vertical-align: top;
	}

	.receipt__grid tbody th {
		color: var(--color-text-primary);
		font-weight: var(--font-weight-medium);
	}

	.receipt__grid tbody td {
		color: var(--color-text-secondary);
		font-weight: var(--font-weight-regular);
	}

	/* Custom scrollbar, used when the page limits the table's height. */
	.receipt__table-scroll {
		scrollbar-width: auto;
	}

	.receipt__table-scroll::-webkit-scrollbar {
		width: 24px;
	}

	.receipt__table-scroll::-webkit-scrollbar-track {
		background: var(--color-scrollbar-track);
	}

	.receipt__table-scroll::-webkit-scrollbar-thumb {
		border: 4px solid var(--color-scrollbar-track);
		border-radius: 1000px;
		background: var(--color-scrollbar-thumb);
	}

	/* ---------------------------- cards ---------------------------- */

	.receipt__cards {
		display: none;
		flex-direction: column;
		gap: 0.75rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.receipt__card {
		border: 1px solid var(--color-border-subtle);
	}

	.receipt__card-title {
		margin: 0;
		padding: 10px;
		background: var(--color-table-row);
		color: var(--color-text-primary);
		font-family: var(--font-label);
		font-size: var(--font-size-xx-small);
		font-weight: var(--font-weight-medium);
		line-height: 1.2;
	}

	.receipt__card-body {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: 0;
		padding: 12px 10px;
		background: var(--color-table-card);
	}

	.receipt__card-body div {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.receipt__card-body dt {
		color: var(--color-text-helper);
		font-family: var(--font-label);
		font-size: var(--font-size-xxx-small);
		font-weight: var(--font-weight-medium);
		line-height: 1.2;
	}

	.receipt__card-body dd {
		margin: 0;
		color: var(--color-text-secondary);
		font-family: var(--font-body);
		font-size: var(--font-size-xx-small);
		line-height: 1.2;
	}

	@media (max-width: 639px) {
		.receipt__table {
			display: none;
		}

		.receipt__cards {
			display: flex;
		}
	}
</style>
