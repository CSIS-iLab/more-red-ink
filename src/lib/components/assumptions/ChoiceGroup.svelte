<script>
	import ChoiceCard from './ChoiceCard.svelte';
	import ErrorMessage from '$lib/components/controls/ErrorMessage.svelte';

	let {
		name,
		label,
		description,
		options = [],
		value = '',
		disabled = false,
		invalid = false,
		errorMessage = 'Input is required.',
		onchange = () => {},
		...restProps
	} = $props();

	const descriptionId = $derived(`${name}-description`);
	const errorId = $derived(`${name}-error`);

	let describedBy = $derived(
		[description && descriptionId, invalid && errorId].filter(Boolean).join(' ') || undefined
	);

	function handleChange(newValue) {
		onchange(newValue);
	}
</script>

<fieldset class="choice-group" {disabled} aria-describedby={describedBy} {...restProps}>
	{#if label}
		<legend class="choice-group__label text-heading-4" class:has-description={description}>
			{label}
		</legend>
	{/if}

	{#if description}
		<div id={descriptionId} class="choice-group__intro">
			{#each Array.isArray(description) ? description : [description] as paragraph, index (index)}
				<p class="text-body-2-regular">{paragraph}</p>
			{/each}
		</div>
	{/if}

	<div class="choice-group__options">
		{#each options as option (option.value)}
			<ChoiceCard
				{name}
				value={option.value}
				checked={value === option.value}
				disabled={disabled || option.disabled}
				{invalid}
				onchange={handleChange}
			>
				<div class="choice-group__title text-label-large">
					{option.label}
				</div>

				{#if option.description}
					<div class="choice-group__description text-label-small">
						{option.description}
					</div>
				{/if}
			</ChoiceCard>
		{/each}
	</div>

	{#if invalid}
		<div class="choice-group__error">
			<ErrorMessage id={errorId} live={false}>{errorMessage}</ErrorMessage>
		</div>
	{/if}
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
		color: var(--color-card-button-text-primary);
		line-height: 1.1;
	}

	.choice-group__label.has-description {
		margin-bottom: 0.75rem;
	}

	.choice-group__intro {
		margin: 0 0 2.5rem;
		color: var(--color-text-primary);
		line-height: 1.5;
	}

	.choice-group__intro p {
		margin: 0;
	}

	.choice-group__options {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 0.75rem;
	}

	.choice-group__error {
		margin-top: 0.75rem;
	}

	.choice-group__title {
		color: var(--color-card-button-text-primary);
	}

	.choice-group__description {
		min-width: 0;
		margin-top: 0.25rem;
		color: var(--color-card-button-text-secondary);
		overflow-wrap: break-word;
	}
</style>
