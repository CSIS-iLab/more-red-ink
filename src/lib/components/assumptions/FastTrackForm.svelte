<!--
  FastTrackForm

  Form for the predefined Fast Track estimation approaches.

  Responsibilities:
  - Present the available Fast Track choices.
  - Update calculator state with the user's selection.
  - Allow the user to continue once a valid choice has been made.

  Implementation notes:
  - Reuse option metadata from assumptionOptions.js.
  - Store user choices in calculatorState.js.
  - Do not calculate the estimate here.
-->

<script>
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import ChoiceGroup from '$lib/components/assumptions/ChoiceGroup.svelte';
	import Button from '$lib/components/controls/Button.svelte';
	import ErrorMessage from '$lib/components/controls/ErrorMessage.svelte';
	import { calculatorState } from '$lib/stores/calculatorState.js';
	import { assumptionsIntro, fastTrackOptions } from '$lib/utils/assumptionOptions.js';

	let { showIncompleteMessage = false } = $props();

	let attemptedNext = $state(false);

	let isComplete = $derived(calculatorState.isEstimateComplete($calculatorState));

	let showError = $derived((showIncompleteMessage || attemptedNext) && !isComplete);

	function handleChoiceChange(value) {
		calculatorState.updateValue('fastTrackChoice', value);
	}

	function handleNext() {
		if (!isComplete) {
			attemptedNext = true;
			return;
		}

		goto(resolve('/visualizer'));
	}
</script>

<div class="fast-track-form">
	<div class="fast-track-form__intro">
		<h1 class="text-heading-1">{assumptionsIntro.label}</h1>

		{#each assumptionsIntro.descriptions.fastTrack as paragraph (paragraph)}
			<p class="text-body-2-regular">{paragraph}</p>
		{/each}
	</div>

	<!-- Fast Track has a single question, so it is invalid exactly when the estimate is incomplete. -->
	<ChoiceGroup
		name="fastTrackChoice"
		label={fastTrackOptions.label}
		description={fastTrackOptions.description}
		options={fastTrackOptions.options}
		value={$calculatorState.fastTrackChoice}
		invalid={showError}
		onchange={handleChoiceChange}
	/>

	<div class="fast-track-form__actions">
		<!-- aria-disabled (not disabled) keeps the button clickable so it can explain what's missing. -->
		<Button aria-disabled={!isComplete || undefined} onclick={handleNext}>Next: Visualizer</Button>

		{#if showError}
			<ErrorMessage>Complete your assumptions to view the Visualizer.</ErrorMessage>
		{/if}
	</div>
</div>

<style>
	.fast-track-form {
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
	}

	.fast-track-form__intro {
		display: flex;
		flex-direction: column;
		gap: 2.25rem;
	}

	.fast-track-form__intro h1,
	.fast-track-form__intro p {
		margin: 0;
	}

	.fast-track-form__intro h1 {
		line-height: 1.1;
	}

	.fast-track-form__intro p {
		line-height: 1.5;
	}

	.fast-track-form__actions {
    padding: 2.5rem 0 2.5rem 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}
</style>
