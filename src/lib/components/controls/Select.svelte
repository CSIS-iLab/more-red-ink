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

<div
	class="select"
	class:disabled
	onkeydown={handleKeydown}
	onfocusout={handleBlur}
>
	{#if label}
		<span class="select__label text-label-large">{label}</span>
	{/if}

	<div class="select__control">
		<button
			type="button"
			class="select__trigger"
			{disabled}
			aria-expanded={isOpen}
			aria-haspopup="listbox"
			onclick={toggleOpen}
			{...restProps}
		>
			<span>{displayValue}</span>

			<span class="select__arrow" class:open={isOpen} aria-hidden="true">
				<svg viewBox="0 0 24 24">
					<path d="M7 10L12 15L17 10" />
				</svg>
			</span>
		</button>

		{#if isOpen}
			<div class="select__options" role="listbox">
				{#each options as option (option.value)}
					<button
						type="button"
						class="select__option"
						class:selected={option.value === value}
						disabled={option.disabled ?? false}
						role="option"
						aria-selected={option.value === value}
						onclick={() => selectOption(option)}
					>
						{option.label}
					</button>
				{/each}
			</div>
		{/if}
	</div>

	{#if helper}
		<span class="select__helper text-body-3-regular">{helper}</span>
	{/if}
</div>

<style>
	.select {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.select__control {
		position: relative;
	}

	.select__trigger {
		width: 100%;
		min-width: 12rem;
		height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0 0.75rem;
		border: 1px solid transparent;
		background: var(--color-white);
		color: inherit;
		font: inherit;
		text-align: left;
		cursor: pointer;
	}

	.select__trigger:hover:not(:disabled) {
		background: var(--color-menu-hover);
	}

	.select__trigger:focus-visible {
		border-color: var(--color-menu-focus-border);
		outline: none;
	}

	.select__trigger[aria-expanded='true'] {
		border-color: var(--color-menu-pressed-border);
		background: var(--color-menu-pressed);
	}

	.select__arrow {
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
		color: var(--color-menu-icon);
		transition: transform 0.2s ease;
	}

	.select__arrow.open {
		transform: rotate(180deg);
	}

	.select__arrow svg {
		display: block;
		width: 100%;
		height: 100%;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.select__options {
		position: absolute;
		top: calc(100% + 0.25rem);
		left: 0;
		z-index: 10;
		width: 100%;
		box-sizing: border-box;
		border: 1px solid var(--color-menu-pressed-border);
		background: var(--color-menu-enabled);
	}

	.select__option {
		display: block;
		width: 100%;
		min-height: 2.5rem;
		padding: 0.5rem 0.75rem;
		border: 0;
		border-bottom: 1px solid var(--color-menu-divider);
		background: var(--color-menu-enabled);
		color: inherit;
		font: inherit;
		text-align: left;
		cursor: pointer;
	}

	.select__option:last-child {
		border-bottom: 0;
	}

	.select__option:hover:not(:disabled),
	.select__option:focus-visible {
		background: var(--color-menu-hover);
	}

	.select__option:focus-visible {
		outline: none;
	}

	.select__option.selected {
		background: var(--color-menu-pressed);
	}

	.select__option:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.select.disabled .select__trigger {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.select__helper {
		margin: 0;
	}
</style>