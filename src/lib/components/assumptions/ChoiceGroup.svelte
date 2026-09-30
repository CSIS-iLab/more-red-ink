<script>
	import ChoiceCard from './ChoiceCard.svelte';

	let {
		name,
		label,
		description,
		options = [],
		value = '',
		disabled = false,
		onchange = () => {},
		...restProps
	} = $props();

	const descriptionId = $derived(`${name}-description`);

	function handleChange(newValue) {
		onchange(newValue);
	}
</script>

<fieldset
	class="choice-group"
	{disabled}
	aria-describedby={description ? descriptionId : undefined}
	{...restProps}
>
	{#if label}
		<legend class="choice-group__label text-body-1-regular" class:has-description={description}>
			{label}
		</legend>
	{/if}

	{#if description}
		<p id={descriptionId} class="choice-group__intro text-body-2-regular">
			{description}
		</p>
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
		line-height: 1.2;
	}

	.choice-group__label.has-description {
		margin-bottom: 0.5rem;
	}

	.choice-group__intro {
		margin: 0 0 1.5rem;
		color: var(--color-text-primary);
		line-height: 1.5;
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
