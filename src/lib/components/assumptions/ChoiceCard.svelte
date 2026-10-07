<script>
	let {
		name,
		value,
		checked = false,
		disabled = false,
		invalid = false,
		onchange = () => {},
		children,
		...restProps
	} = $props();
</script>

<label class="choice-card" class:checked class:disabled class:invalid>
	<input
		type="radio"
		{name}
		{value}
		{checked}
		{disabled}
		onchange={() => onchange(value)}
		{...restProps}
	/>

	<div class="choice-card__content">
		{@render children?.()}
	</div>
</label>

<style>
	.choice-card {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		width: 100%;
		box-sizing: border-box;
		padding: 1rem;
		border: 1px solid var(--color-card-button-enabled-border);
		border-radius: 0.5rem;
		background: var(--color-card-button-enabled);
		color: var(--color-card-button-text-primary);
		cursor: pointer;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease;
	}

	input {
		appearance: none;
		flex: 0 0 auto;
		width: 1.25rem;
		height: 1.25rem;
		margin: 0.125rem 0 0;
		box-sizing: border-box;
		border: 1px solid var(--color-card-button-enabled-border);
		border-radius: 50%;
		background: transparent;
		cursor: pointer;
	}

	/* Hover */
	.choice-card:hover:not(.disabled) {
		border-color: var(--color-card-button-hover-border);
		background: var(--color-card-button-hover);
	}

	.choice-card:hover:not(.disabled) input {
		border-color: var(--color-card-button-hover-border);
	}

	/* Error */
	.choice-card.invalid {
		border-color: var(--color-card-button-error-border);
		background: var(--color-card-button-error);
	}

	/* Selected / pressed */
	.choice-card.checked {
		border: 2px solid var(--color-card-button-pressed-border);
		padding: calc(1rem - 1px);
		background: var(--color-card-button-pressed);
	}

	.choice-card.checked input {
		border: 0.3125rem solid var(--color-card-button-pressed-border);
	}

	/* Focus */
	.choice-card:has(input:focus-visible) {
		outline: 2px solid var(--color-card-button-focus-border);
		outline-offset: 2px;
	}

	.choice-card:not(.checked):has(input:focus-visible) input {
		border: 2px solid var(--color-card-button-focus-border);
	}

	input:focus-visible {
		outline: none;
	}

	.choice-card__content {
		flex: 1;
		min-width: 0;
	}

	/* Disabled */
	.disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.disabled input {
		cursor: not-allowed;
	}
</style>
