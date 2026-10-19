<script>
	let { label, checked = false, disabled = false, onchange, ...restProps } = $props();
</script>

<label class="checkbox" class:disabled>
	<input type="checkbox" {checked} {disabled} {onchange} {...restProps} />

	<span class="checkbox__label text-body-3-regular">{label}</span>
</label>

<style>
	.checkbox {
		display: inline-flex;
		align-items: flex-start;
		gap: 0.625rem;
		cursor: pointer;
    min-height: 1.75rem;
	}

	input {
		appearance: none;
		flex-shrink: 0;
		width: 1.5rem;
		height: 1.5rem;
    margin: 0.125rem 0;
		border: 1px solid var(--color-checkbox-enabled-border);
		border-radius: 2px;
		background: var(--color-surface-primary);
		cursor: pointer;
	}

	input:checked {
		border: 0;
		background: url('/icons/checkbox-checked.svg') center / 1.5rem 1.75rem no-repeat;
	}

	input:focus-visible {
		outline: 2px solid var(--color-dropdown-focus-border);
		outline-offset: 2px;
	}

	.checkbox__label {
    padding: 0.125rem 0;
		color: var(--color-text-secondary);
		line-height: 1.2;
	}

	.checkbox.disabled {
		cursor: not-allowed;
	}

	.checkbox.disabled input {
		border-color: var(--color-disabled-text);
		background-color: var(--color-disabled);
		cursor: not-allowed;
	}

	.checkbox.disabled .checkbox__label {
		color: var(--color-disabled-text);
	}
</style>
