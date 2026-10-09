<!--
  UserDrivenForm

  Form for building a custom set of estimation assumptions.

  Responsibilities:
  - Present the configurable methodology choices.
  - Update calculator state as the user makes selections.
  - Allow the user to continue once the required choices are valid.

  Implementation notes:
  - Reuse option metadata from assumptionOptions.js.
  - Store user choices in calculatorState.js.
  - Do not translate choices into spreadsheet columns here.
  - Do not calculate the estimate here; methodology resolution belongs
    in calculateEstimate.js.
-->

<script>
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import ChoiceGroup from '$lib/components/assumptions/ChoiceGroup.svelte';
	import Button from '$lib/components/controls/Button.svelte';
	import ErrorMessage from '$lib/components/controls/ErrorMessage.svelte';
	import { calculatorState } from '$lib/stores/calculatorState.js';
	import {
		alwaysIncluded,
		assumptionOptions,
		assumptionSections,
		assumptionsIntro
	} from '$lib/utils/assumptionOptions.js';

	let { showIncompleteMessage = false } = $props();

	let attemptedNext = $state(false);

	// Group each assumption under the section that matches its chinaOnly flag.
	const sections = assumptionSections.map((section) => ({
		...section,
		assumptions: Object.entries(assumptionOptions)
			.filter(([, assumption]) => assumption.chinaOnly === section.chinaOnly)
			.map(([key, assumption]) => ({ key, ...assumption }))
	}));

	let isComplete = $derived(calculatorState.isEstimateComplete($calculatorState));

	let showErrors = $derived((showIncompleteMessage || attemptedNext) && !isComplete);

	function isMissing(key) {
		return !calculatorState.isChoiceValid(key, $calculatorState.userDrivenChoices[key]);
	}

	function handleChoiceChange(key, value) {
		calculatorState.updateUserDrivenChoices({ [key]: value });
	}

	function handleNext() {
		if (!isComplete) {
			attemptedNext = true;
			return;
		}

		goto(resolve('/visualizer'));
	}
</script>

<div class="user-driven-form">
	<div class="user-driven-form__intro">
		<h1 class="text-heading-2">{assumptionsIntro.label}</h1>

		<div class="user-driven-form__paragraphs">
			{#each assumptionsIntro.descriptions.userDriven as paragraph (paragraph)}
				<p class="text-body-2-regular">{paragraph}</p>
			{/each}
		</div>
	</div>

	{#each sections as section (section.key)}
		<section class="user-driven-form__section" aria-labelledby="{section.key}-heading">
			<div class="user-driven-form__section-heading">
				<h2 id="{section.key}-heading" class="text-heading-3">{section.label}</h2>

				{#if section.description}
					<p class="text-body-2-regular">{section.description}</p>
				{/if}
			</div>

			{#each section.assumptions as assumption (assumption.key)}
				<ChoiceGroup
					name={assumption.key}
					label={assumption.label}
					description={assumption.description}
					options={assumption.options}
					value={$calculatorState.userDrivenChoices[assumption.key]}
					invalid={showErrors && isMissing(assumption.key)}
					onchange={(value) => handleChoiceChange(assumption.key, value)}
				/>
			{/each}
		</section>
	{/each}

	<div class="user-driven-form__always-included">
		<h2 class="text-heading-4">{alwaysIncluded.label}</h2>
		<p class="text-body-2-regular">{alwaysIncluded.description}</p>
	</div>

	<div class="user-driven-form__actions">
		<!-- aria-disabled (not disabled) keeps the button clickable so it can explain what's missing. -->
		<Button aria-disabled={!isComplete || undefined} onclick={handleNext}>Next: Visualizer</Button>

		{#if showErrors}
			<ErrorMessage>Complete your assumptions to view the Visualizer.</ErrorMessage>
		{/if}
	</div>
</div>

<style>
	.user-driven-form {
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}

	.user-driven-form h1,
	.user-driven-form h2,
	.user-driven-form p {
		margin: 0;
	}

	.user-driven-form h1,
	.user-driven-form__section-heading h2 {
		line-height: 1.1;
	}

	.user-driven-form p {
		line-height: 1.5;
	}

	.user-driven-form__intro {
		display: flex;
		flex-direction: column;
		gap: 2.25rem;
	}

	.user-driven-form__paragraphs {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.user-driven-form__section {
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
	}

	.user-driven-form__section-heading {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
    margin-top: 3rem;
	}

	.user-driven-form__always-included {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.user-driven-form__always-included h2 {
		line-height: 1.2;
	}

	.user-driven-form__actions {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

  #chinaOnly-heading {
    margin-bottom: 18px;
  }
</style>
