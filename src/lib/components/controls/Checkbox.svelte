<script>
	let { label, checked = false, disabled = false, onchange, ...restProps } = $props();
</script>

<label class="checkbox" class:disabled>
	<input type="checkbox" {checked} {disabled} {onchange} {...restProps} />

	<span class="text-body-2-regular">{label}</span>
</label>

<style>
	.checkbox {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		cursor: pointer;
	}

	input {
		appearance: none;
		width: 15px;
		height: 15px;
		margin: 0;
		flex-shrink: 0;
		border: 1px solid var(--color-neutral-500);
		border-radius: 1px;
		background: var(--color-white);
		cursor: pointer;
	}

	input:checked {
		border: 0;
		background: url('/icons/check.svg') center / 15px 15px no-repeat;
	}

	input:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 2px;
	}

	.checkbox.disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.checkbox.disabled input {
		cursor: not-allowed;
	}
</style>
