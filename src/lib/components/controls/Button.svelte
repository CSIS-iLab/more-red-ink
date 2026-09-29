<script>
	let {
		href,
		type = 'button',
		variant = 'primary',
		disabled = false,
		onclick,
		children,
		...restProps
	} = $props();
</script>

{#if href}
	<!-- eslint-disable svelte/no-navigation-without-resolve -->
	<a
		{href}
		{onclick}
		aria-disabled={disabled || undefined}
		class:primary={variant === 'primary'}
		class:secondary={variant === 'secondary'}
		class:disabled
		class="action text-label-large"
		{...restProps}
	>
		{@render children?.()}
	</a>
	<!-- eslint-enable svelte/no-navigation-without-resolve -->
{:else}
	<button
		{type}
		{disabled}
		{onclick}
		class:primary={variant === 'primary'}
		class:secondary={variant === 'secondary'}
		class="action text-label-large"
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}

<style>
	.action {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		min-height: 3rem;
		padding: 0 1.25rem;
		border: 1px solid transparent;
		border-radius: 0.25rem;
		font: inherit;
		text-decoration: none;
		cursor: pointer;
		transition:
			background-color 0.3s ease,
			border-color 0.3s ease;
	}

	.primary {
		background: var(--color-cta-enabled);
		color: var(--color-cta-text-primary);
	}

	.primary:hover:not(:disabled, .disabled) {
		background: var(--color-cta-hover);
	}

	.primary:active:not(:disabled, .disabled) {
		background: var(--color-cta-pressed);
	}

	.secondary {
		border-color: currentColor;
		background: transparent;
		color: inherit;
	}

	.action:disabled,
	.action.disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	a.disabled {
		pointer-events: none;
	}

	.action:focus-visible {
		outline: 1px solid var(--color-white);
		outline-offset: -2px;
		box-shadow: 0 0 0 1px var(--color-neutral-600);
	}

	.action :global(img) {
		width: 1.5rem;
		height: 1.5rem;
		flex-shrink: 0;
	}

	.primary :global(img) {
		filter: brightness(0) invert(1);
	}
</style>
