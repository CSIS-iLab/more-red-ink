<script>
	import Button from '$lib/components/controls/Button.svelte';

	let { title, controls, children } = $props();
</script>

<section class="chart-container">
	<h2 class="chart-container__title text-heading-5">{title}</h2>

	{#if controls}
		<div class="chart-container__controls">
			{@render controls()}
		</div>
	{/if}

	<hr class="chart-container__divider" />

	<div class="chart-container__content">
		{@render children?.()}
	</div>

	<div class="chart-container__actions">
		<Button variant="primary">Share chart</Button>
	</div>
</section>

<style>
	.chart-container {
		width: 100%;
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
	}

	.chart-container__actions {
		display: flex;
		justify-content: flex-end;
		margin-top: 2rem;
	}
</style>