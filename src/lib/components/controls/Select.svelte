<script>
	let {
		label,
		options = [],
		value = '',
		disabled = false,
		helper,
		onchange,
		...restProps
	} = $props();
</script>

<label class="select">
	{#if label}
		<span class="text-label-large">{label}</span>
	{/if}

	<select {value} {disabled} {onchange} {...restProps}>
		{#each options as option (option.value)}
			<option value={option.value} disabled={option.disabled ?? false}>
				{option.label}
			</option>
		{/each}
	</select>

	{#if helper}
		<span class="helper text-body-3-regular">{helper}</span>
	{/if}
</label>

<style>
	.select {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	select {
		min-width: 10rem;
		height: 2.5rem;
		padding: 0 2.5rem 0 0.75rem;
		border: 1px solid var(--color-neutral-500);
		border-radius: 0;
		background-color: var(--color-white);
		color: inherit;
		font: inherit;
		cursor: pointer;
	}

	select:hover:not(:disabled) {
		border-color: var(--color-neutral-600);
	}

	select:focus-visible {
		outline: 2px solid var(--color-neutral-600);
		outline-offset: 1px;
	}

	select:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.helper {
		margin: 0;
	}
</style>