<script>
	import Button from '$lib/components/controls/Button.svelte';

	let {
		title,
		chartTitle,
		chartSubtitle,
		controls,
		children,
		// URL of this chart's Share page (opened in a new tab).
		share,
		frozen = false
	} = $props();
</script>

<section class="chart-container" class:chart-container--frozen={frozen}>
	{#if !frozen}
		<h3 class="chart-container__title">{title}</h3>

		{#if controls}
			<div class="chart-container__controls">
				{@render controls()}
			</div>
		{/if}

		<hr class="chart-container__divider" />
	{/if}

	<div class="chart-container__content">
		{#if chartTitle}
			<div class="chart-container__heading">
				<h4 class="chart-container__chart-title">{chartTitle}</h4>

				{#if chartSubtitle}
					<p class="chart-container__chart-subtitle">{chartSubtitle}</p>
				{/if}
			</div>
		{/if}

		{@render children?.()}
	</div>

	{#if !frozen}
		<div class="chart-container__actions">
			<Button variant="primary" href={share} target="_blank" rel="noopener">
				Share chart
				<img src="/icons/external-link.svg" alt="" aria-hidden="true" />
				<span class="visually-hidden">(opens in a new tab)</span>
			</Button>
		</div>
	{/if}
</section>

<style>
	.chart-container {
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
		width: 100%;
		padding: 2.5rem;
		border: 1px solid var(--color-border-subtle);
		border-radius: 1rem;
		background: var(--color-surface-primary);
	}

	.chart-container__title {
		margin: 0;
		color: var(--color-text-primary);
		font-family: var(--font-heading);
		font-size: var(--font-size-medium);
		font-weight: var(--font-weight-medium);
		line-height: 1.1;
	}

	.chart-container__controls {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.chart-container__divider {
		width: 100%;
		margin: 0;
		border: 0;
		border-top: 1px solid var(--color-border-strong);
	}

	.chart-container__content {
		min-width: 0;
		padding: 1.5rem;
		border: 1px solid var(--color-border-subtle);
		background: var(--color-surface-primary);
	}

	/* Chart title and subtitle, above the Highcharts chart. */
	.chart-container__heading {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		/* 28px to the chart, less the chart's 8px top spacing. */
		margin-bottom: 1.25rem;
	}

	.chart-container__chart-title {
		margin: 0;
		color: var(--color-text-primary);
		font-family: var(--font-heading);
		font-size: var(--font-size-medium);
		font-weight: var(--font-weight-medium);
		line-height: 1.1;
	}

	.chart-container__chart-subtitle {
		margin: 0;
		color: var(--color-text-helper);
		font-family: var(--font-label);
		font-size: var(--font-size-x-small);
		font-weight: var(--font-weight-medium);
		line-height: 1.2;
	}

	.chart-container__actions {
		display: flex;
		justify-content: flex-start;
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	/* Figma: 12/16/12/20 with no border; less 1px for the button's
	   transparent border so it stays 48px tall. */
	.chart-container__actions :global(.action) {
		padding: calc(0.75rem - 1px) 1rem calc(0.75rem - 1px) 1.25rem;
	}

	.chart-container--frozen {
		gap: 0;
		padding: 0;
		border: 0;
		border-radius: 0;
	}

	.chart-container--frozen .chart-container__content {
		padding: 0;
		border: 0;
	}

	@media (max-width: 1439px) {
		.chart-container:not(.chart-container--frozen) {
			gap: 2.25rem;
			padding: 2.25rem;
		}
	}

	@media (max-width: 959px) {
		.chart-container__heading {
			margin-bottom: 1rem;
		}

		.chart-container:not(.chart-container--frozen) {
			gap: 1.5rem;
			padding: 1.25rem 1.5rem;
		}

		.chart-container:not(.chart-container--frozen) .chart-container__content {
			padding: 1rem 1rem 1.25rem;
		}
	}

	/* Phones: the chart runs edge to edge inside the card, and Share is
	   centered under a divider. */
	@media (max-width: 639px) {
		.chart-container:not(.chart-container--frozen) {
			gap: 0;
			padding: 0;
			border-radius: 0.5rem;
		}

		.chart-container:not(.chart-container--frozen) .chart-container__title {
			padding: 1.25rem 1.25rem 0;
		}

		.chart-container:not(.chart-container--frozen) .chart-container__controls {
			margin-top: 2.25rem;
			padding: 0 1.25rem;
		}

		.chart-container:not(.chart-container--frozen) .chart-container__divider {
			width: auto;
			margin: 2.25rem 1.25rem 0;
		}

		.chart-container:not(.chart-container--frozen) .chart-container__content {
			border: 0;
		}

		.chart-container__actions {
			justify-content: center;
			margin: 0 1.25rem;
			padding: 1.25rem 0;
			border-top: 1px solid var(--color-border-strong);
		}
	}
</style>
