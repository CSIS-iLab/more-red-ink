<script>
	import Button from '$lib/components/controls/Button.svelte';

	let { title, controls, children, share = () => {}, frozen = false } = $props();
</script>

<section class="chart-container" class:chart-container--frozen={frozen}>
	{#if !frozen}
		<h3 class="chart-container__title text-heading-3">{title}</h3>

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
		width: 100%;
		max-width: 872px;
		padding: 1.5rem;
		border: 1px solid var(--color-neutral-300);
		border-radius: 0.5rem;
		background: var(--color-white);
	}

	.chart-container__title {
		margin: 0;
	}

	.chart-container__controls {
		margin-top: 1.5rem;
	}

	.chart-container__divider {
		margin: 2rem 0;
		border: 0;
		border-top: 1px solid var(--color-neutral-300);
	}

	.chart-container__content {
		min-width: 0;
		padding: 25px;
		border: 1px solid var(--color-slate-200);
	}

	.chart-container__actions {
		display: flex;
		justify-content: flex-start;
		margin-top: 2rem;
	}

	.chart-container--frozen {
		max-width: none;
		padding: 0;
		border: 0;
		border-radius: 0;
	}

	.chart-container--frozen .chart-container__content {
		padding: 0;
		border: 0;
	}
</style>
