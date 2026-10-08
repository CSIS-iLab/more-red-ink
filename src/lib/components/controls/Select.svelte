<script>
	let {
		label,
		options = [],
		value = '',
		disabled = false,
		helper,
		onchange = () => {},
		...restProps
	} = $props();

	let isOpen = $state(false);

	let selectedOption = $derived(options.find((option) => option.value === value));
	let displayValue = $derived(selectedOption?.label ?? '');

	function toggleOpen() {
		if (disabled) return;

		isOpen = !isOpen;
	}

	function selectOption(option) {
		if (disabled || option.disabled) return;

		onchange(option.value);
		isOpen = false;
	}

	function handleKeydown(event) {
		if (event.key === 'Escape') {
			isOpen = false;
		}
	}

	function handleBlur(event) {
		if (!event.currentTarget.contains(event.relatedTarget)) {
			isOpen = false;
		}
	}
</script>

<div class="select" class:disabled onfocusout={handleBlur}>
	{#if label}
		<span class="select__label text-label-medium-short">{label}</span>
	{/if}

	<div class="select__control">
		<button
			type="button"
			class="select__trigger text-body-3-regular"
			{disabled}
			aria-expanded={isOpen}
			aria-haspopup="listbox"
			onclick={toggleOpen}
			onkeydown={handleKeydown}
			{...restProps}
		>
			<span>{displayValue}</span>

			<img
				class="select__arrow"
				class:open={isOpen}
				src="/icons/keyboard-arrow-down.svg"
				alt=""
				width="48"
				height="48"
			/>
		</button>

		{#if isOpen}
			<div class="select__options" role="listbox">
				{#each options as option (option.value)}
					<button
						type="button"
						class="select__option text-body-3-regular"
						class:selected={option.value === value}
						disabled={option.disabled ?? false}
						role="option"
						aria-selected={option.value === value}
						onclick={() => selectOption(option)}
						onkeydown={handleKeydown}
					>
						{option.label}
					</button>
				{/each}
			</div>
		{/if}
	</div>

	{#if helper}
		<span class="select__helper text-label-x-small">{helper}</span>
	{/if}
</div>

<style>
	.select {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		width: 100%;
		min-width: 0;
	}

	.select__label {
		flex: 0 0 5rem;
		color: var(--color-text-secondary);
	}

	.select__control {
		position: relative;
		flex: 0 1 18.625rem;
		min-width: 0;
	}

	.select__trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 3rem;
		padding: 0 0 0 1rem;
		border: 1px solid var(--color-dropdown-enabled-border);
		border-radius: 2px;
		background: var(--color-dropdown-enabled);
		color: var(--color-text-primary);
		line-height: 1.2;
		text-align: left;
		cursor: pointer;
	}

	.select__trigger > span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.select__trigger:hover:not(:disabled) {
		background: var(--color-dropdown-hover);
	}

	/* Focus and open: a 2px border, drawn inside so the size doesn't change. */
	.select__trigger:focus-visible {
		border-color: var(--color-dropdown-focus-border);
		outline: none;
		box-shadow: inset 0 0 0 1px var(--color-dropdown-focus-border);
	}

	.select__trigger[aria-expanded='true'] {
		border-color: var(--color-dropdown-pressed-border);
		background: var(--color-dropdown-enabled);
		box-shadow: inset 0 0 0 1px var(--color-dropdown-pressed-border);
	}

	.select__arrow {
		flex-shrink: 0;
		width: 3rem;
		height: 3rem;
		transition: transform 0.2s ease;
	}

	.select__arrow.open {
		transform: rotate(180deg);
	}

	.select__options {
		position: absolute;
		top: 100%;
		left: 0;
		z-index: 10;
		width: 100%;
		max-height: 20rem;
		overflow-y: auto;
		background: var(--color-menu-enabled);
		box-shadow: 0 4px 12px rgb(0 0 0 / 0.12);
	}

	.select__option {
		display: flex;
		align-items: center;
		width: 100%;
		min-height: 2.75rem;
		padding: 0.5rem 1rem;
		border: 0;
		border-bottom: 1px solid var(--color-menu-divider);
		background: var(--color-menu-enabled);
		color: var(--color-text-primary);
		line-height: 1.2;
		text-align: left;
		cursor: pointer;
	}

	.select__option:last-child {
		border-bottom: 0;
	}

	.select__option:hover:not(:disabled),
	.select__option:focus-visible {
		background: var(--color-menu-hover);
		outline: none;
	}

	.select__option.selected {
		background: var(--color-menu-pressed);
		box-shadow: inset 0 0 0 1px var(--color-menu-pressed-border);
	}

	.select__option:disabled {
		color: var(--color-disabled-text);
		cursor: not-allowed;
	}

	.select.disabled .select__trigger {
		border-color: var(--color-disabled-text);
		background: var(--color-disabled);
		color: var(--color-disabled-text);
		cursor: not-allowed;
	}

	.select__helper {
		margin: 0;
		color: var(--color-text-primary);
	}

	@media (max-width: 959px) {
		.select {
			flex-direction: column;
			align-items: stretch;
			gap: 0.75rem;
		}

		.select__label,
		.select__control {
			flex: none;
		}

		.select__control {
			width: 100%;
			max-width: 18.625rem;
		}
	}
</style>
