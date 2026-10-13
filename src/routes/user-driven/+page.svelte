<!--
  User Driven

  Custom estimation workflow.

  Responsibilities:
  - Establish User Driven as the active calculator mode.
  - Render UserDrivenForm.
  - Allow the user to configure the available methodology assumptions.
  - Continue to the visualizer once the required selections are valid.

  Implementation notes:
  - Store user choices in calculator state.
  - Do not translate choices into spreadsheet columns here.
  - Do not calculate the estimate on this page.
-->

<script>
	import { page } from '$app/state';
	import BackLink from '$lib/components/controls/BackLink.svelte';
	import UserDrivenForm from '$lib/components/assumptions/UserDrivenForm.svelte';
	import { calculatorState } from '$lib/stores/calculatorState.js';

	calculatorState.initialize();
	calculatorState.startMode('userDriven');

	let showIncompleteMessage = $derived(page.url.searchParams.get('incomplete') === 'true');
</script>

<svelte:head>
	<title>User Driven | More Red Ink Calculator</title>
</svelte:head>

<div class="user-driven">
	<div class="back-link-wrapper">
		<BackLink href="/" />
	</div>

	<UserDrivenForm {showIncompleteMessage} />
</div>

<style>
	.user-driven {
		width: min(100% - 2rem, 39.75rem);
		margin: 0 auto;
		padding: 5rem 0;
	}

	.back-link-wrapper {
		margin-bottom: 4.5rem; /* 72px */
	}

	@media (max-width: 640px) {
		.user-driven {
			padding: 2rem 0 4rem;
		}
	}
</style>
