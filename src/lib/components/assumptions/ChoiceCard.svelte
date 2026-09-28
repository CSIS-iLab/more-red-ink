<script>
	let {
		name,
		value,
		checked = false,
		disabled = false,
		onchange = () => {},
		children,
		...restProps
	} = $props();
</script>

<label class="choice-card" class:checked class:disabled>
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
		border: 1px solid var(--color-radio-card-enabled-border);
		border-radius: 0.5rem;
		background: var(--color-radio-card-enabled);
		color: var(--color-radio-card-text-primary);
		cursor: pointer;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease;
	}

	.choice-card:hover:not(.disabled) {
		border-color: var(--color-radio-card-hover-border);
		background: var(--color-radio-card-hover);
	}

	.choice-card:has(input:focus-visible) {
		border-color: var(--color-radio-card-focus-border);
		outline: 1px solid var(--color-radio-card-focus-border);
		outline-offset: -1px;
	}

	.choice-card.checked {
		border-color: var(--color-radio-card-pressed-border);
		background: var(--color-radio-card-pressed);
	}

	input {
		flex: 0 0 auto;
		width: 1.25rem;
		height: 1.25rem;
		margin: 0.125rem 0 0;
		accent-color: var(--color-radio-card-pressed-border);
		cursor: pointer;
	}

	.choice-card__content {
		flex: 1;
		min-width: 0;
	}

	.disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.disabled input {
		cursor: not-allowed;
	}
</style>