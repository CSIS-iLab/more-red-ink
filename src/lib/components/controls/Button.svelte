<script>
	let {
		type = 'button',
		variant = 'primary',
		disabled = false,
		onclick,
		children,
		...restProps
	} = $props();
</script>

<button
	{type}
	{disabled}
	{onclick}
	class:primary={variant === 'primary'}
	class:secondary={variant === 'secondary'}
	class="text-label-large"
	{...restProps}
>
	{@render children?.()}
</button>

<style>
	button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		min-height: 3rem;
		padding: 0 1rem;
		border: 1px solid transparent;
		border-radius: 0.25rem;
		font: inherit;
		cursor: pointer;
		transition:
			background-color 0.3s ease,
			border-color 0.3s ease;
	}

	.primary {
		background: var(--color-cta-enabled);
		color: var(--color-cta-text-primary);
	}

	.primary:hover:not(:disabled) {
		background: var(--color-cta-hover);
	}

	.primary:active:not(:disabled) {
		background: var(--color-cta-pressed);
	}

	.secondary {
		border-color: currentColor;
		background: transparent;
		color: inherit;
	}

	button:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	button:focus-visible {
		outline: 1px solid var(--color-white);
		outline-offset: -2px;
		box-shadow: 0 0 0 1px var(--color-neutral-600);
	}
</style>