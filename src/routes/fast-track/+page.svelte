<script>
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
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
	<a class="back-link text-body-2-regular" href={resolve('/')}>&lt; Back</a>

	<FastTrackForm {showIncompleteMessage} />
</div>

<style>
	.fast-track {
		width: min(100% - 2rem, 39.75rem);
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
