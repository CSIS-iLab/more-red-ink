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
		class:ghost={variant === 'ghost'}
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
		class:ghost={variant === 'ghost'}
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
		line-height: 1.2;
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

	.primary:hover:not(:disabled, .disabled, [aria-disabled='true']) {
		background: var(--color-cta-hover);
	}

	.primary:active:not(:disabled, .disabled, [aria-disabled='true']) {
		background: var(--color-cta-pressed);
	}

	.secondary {
		border-color: currentColor;
		background: transparent;
		color: inherit;
	}

	.ghost {
		border-color: var(--color-ghost-button-enabled-border);
		background: var(--color-ghost-button-enabled);
		color: var(--color-ghost-button-text);
	}

	.ghost:hover:not(:disabled, .disabled, [aria-disabled='true']) {
		border-color: var(--color-ghost-button-hover-border);
		background: var(--color-ghost-button-hover);
	}

	.ghost:active:not(:disabled, .disabled, [aria-disabled='true']) {
		border-color: var(--color-ghost-button-pressed-border);
		background: var(--color-ghost-button-pressed);
	}

	.action.ghost:focus-visible {
		outline: 2px solid var(--color-ghost-button-focus-border);
		outline-offset: 2px;
		box-shadow: none;
	}

	.action:disabled,
	.action.disabled,
	.action[aria-disabled='true'] {
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
