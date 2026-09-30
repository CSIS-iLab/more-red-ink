<!--
  Fast Track

  Predefined estimation workflow.

  Responsibilities:
  - Establish Fast Track as the active calculator mode.
  - Render FastTrackForm.
  - Allow the user to choose a predefined estimation approach.
  - Continue to the visualizer once the required selection is valid.

  Implementation notes:
  - Store user choices in calculator state.
  - Do not calculate the estimate on this page.
-->

<script>
	import { get } from 'svelte/store';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import FastTrackForm from '$lib/components/assumptions/FastTrackForm.svelte';
	import { calculatorState } from '$lib/stores/calculatorState.js';
	import { assumptionOptions } from '$lib/utils/assumptionOptions.js';

	calculatorState.initialize();

	// Entering Fast Track from another mode (or no mode) starts a new
	// Fast Track estimate. Chart display settings are left untouched.
	const { mode } = get(calculatorState);

	if (mode !== 'fastTrack') {
		if (mode === 'userDriven') {
			calculatorState.updateUserDrivenChoices(
				Object.fromEntries(Object.keys(assumptionOptions).map((key) => [key, null]))
			);
		}

		calculatorState.updateValue('fastTrackChoice', null);
		calculatorState.updateValue('mode', 'fastTrack');
	}

	let showIncompleteMessage = $derived(page.url.searchParams.get('incomplete') === 'true');
</script>

<svelte:head>
	<title>Fast Track | More Red Ink Calculator</title>
</svelte:head>

<div class="fast-track">
	<a class="back-link text-body-2-regular" href={resolve('/')}>&lt; Back</a>

	<FastTrackForm {showIncompleteMessage} />
</div>

<style>
	.fast-track {
		width: min(100% - 2rem, 40rem);
		margin: 0 auto;
		padding: 7.5rem 0;
	}

	.back-link {
		display: inline-block;
		margin-bottom: 2.25rem;
		color: var(--color-neutral-500);
		line-height: 1.5;
	}

	.back-link:hover {
		color: var(--color-text-primary);
	}

	@media (max-width: 640px) {
		.fast-track {
			width: 100%;
			padding: 2rem 0 4rem;
		}
	}
</style>
