<script>
	import { onMount } from 'svelte';
	import '../app.css';
	import { page } from '$app/state';
	import { loadData } from '$lib/data/loadData.js';
	import favicon from '$lib/assets/favicon.svg';
	import AppHeader from '$lib/components/layout/AppHeader.svelte';
	import Credits from '$lib/components/layout/Credits.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import PageShell from '$lib/components/layout/PageShell.svelte';

	let { children } = $props();

	const pageNames = {
		'/': 'Home',
		'/fast-track': 'Fast Track',
		'/user-driven': 'User Driven',
		'/visualizer': 'Visualizer',
		'/share': 'Share'
	};

	let pageName = $derived(pageNames[page.url.pathname] ?? '');

	onMount(() => {
		loadData().catch((error) => {
			console.error('Unable to preload source data.', error);
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<!--load google fonts-->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&display=swap"
		rel="stylesheet"
	/>
	<!--end load google fonts-->
</svelte:head>

<div class="app">
	<AppHeader {pageName} />

	<PageShell>
		{@render children()}
	</PageShell>

	{#if page.url.pathname === '/'}
		<Credits />
	{/if}
	<Footer />
</div>

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
</style>
