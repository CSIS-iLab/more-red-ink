<script>
	import { page } from '$app/state';
	import BackLink from '$lib/components/controls/BackLink.svelte';
	import FastTrackForm from '$lib/components/assumptions/FastTrackForm.svelte';
	import { calculatorState } from '$lib/stores/calculatorState.js';

	calculatorState.initialize();
	calculatorState.startMode('fastTrack');

	let showIncompleteMessage = $derived(page.url.searchParams.get('incomplete') === 'true');
</script>

<svelte:head>
	<title>Fast Track | More Red Ink Calculator</title>
</svelte:head>

<div class="fast-track">
	<div class="back-link-wrapper">
		<BackLink href="/" />
	</div>

	<FastTrackForm {showIncompleteMessage} />
</div>

<style>
	.fast-track {
		width: min(100% - 2rem, 39.75rem);
		margin: 0 auto;
		padding: 5rem 0;
	}

	.back-link-wrapper {
		margin-bottom: 4.5rem; /* 72px */
	}

	@media (max-width: 640px) {
		.fast-track {
			padding: 2rem 0 4rem;
		}
	}
</style>
