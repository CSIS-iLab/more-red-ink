<script>
	import ChoiceCard from './ChoiceCard.svelte';

	let {
		name,
		label,
		options = [],
		value = '',
		disabled = false,
		onchange = () => {},
		...restProps
	} = $props();

	function handleChange(newValue) {
		onchange(newValue);
	}
</script>

<fieldset class="choice-group" {disabled} {...restProps}>
	{#if label}
		<legend class="choice-group__label text-body-1-regular">
			{label}
		</legend>
	{/if}

	<div class="choice-group__options">
		{#each options as option (option.value)}
			<ChoiceCard
				{name}
				value={option.value}
				checked={value === option.value}
				disabled={disabled || option.disabled}
				onchange={handleChange}
			>
				<div class="choice-group__title text-label-large">
					{option.label}
				</div>

				{#if option.description}
					<div class="choice-group__description text-body-3-regular">
						{option.description}
					</div>
				{/if}
			</ChoiceCard>
		{/each}
	</div>
</fieldset>

<style>
	.choice-group {
		min-width: 0;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.choice-group__label {
		margin-bottom: 1rem;
		padding: 0;
		color: var(--color-radio-card-text-primary);
	}

	.choice-group__options {
		display: grid;
		gap: 1rem;
	}

	.choice-group__title {
		color: var(--color-radio-card-text-primary);
	}

	.choice-group__description {
		margin-top: 0.25rem;
		color: var(--color-radio-card-text-secondary);
	}
</style>