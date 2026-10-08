<script>
	import Button from '$lib/components/controls/Button.svelte';

	let { title, controls, children, share = () => {}, frozen = false } = $props();
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
		{@render children?.()}
	</div>

	{#if !frozen}
		<div class="chart-container__actions">
			<Button variant="primary" onclick={share}>
				Share chart
				<img src="/icons/external-link.svg" alt="" aria-hidden="true" />
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
		border-top: 1px solid var(--color-border-subtle);
	}

	.chart-container__content {
		min-width: 0;
		padding: 1.5rem;
		border: 1px solid var(--color-border-subtle);
		background: var(--color-surface-primary);
	}

	.chart-container__actions {
		display: flex;
		justify-content: flex-start;
	}

	.chart-container__actions :global(.action) {
		padding: 0.75rem 1rem 0.75rem 1.25rem;
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

	@media (max-width: 1440px) {
		.chart-container:not(.chart-container--frozen) {
			gap: 2.25rem;
			padding: 2.25rem;
		}
	}

	@media (max-width: 959px) {
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
			border-top: 1px solid var(--color-border-subtle);
		}
	}
</style>
