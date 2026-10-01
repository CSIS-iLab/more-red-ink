<script>
	import { onMount } from 'svelte';
	import '../app.css';
	import { page } from '$app/state';
  import { loadData } from '$lib/data/loadData';
	import favicon from '$lib/assets/favicon.svg';
	import AppHeader from '$lib/components/layout/AppHeader.svelte';
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
		href="https://fonts.googleapis.com/css2?family=Google+Sans+Code:ital,wght,MONO@0,300..800,1;1,300..800,1&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
		rel="stylesheet"
	/>
	<!--end load google fonts-->
</svelte:head>

<div class="app">
	<AppHeader {pageName} />

	<PageShell>
		{@render children()}
	</PageShell>

	<Footer />
</div>

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
</style>
