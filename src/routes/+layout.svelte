<!--
	Root application layout.

	Responsibilities:
	- Wrap all application routes in the shared site structure.
	- Render shared application-level UI such as the header, credits,
	  and footer.
	- Provide the child route content.

	Implementation notes:
	- Keep route-specific application logic in the individual route pages.
-->

<script>
	import '../app.css';
	import { page } from '$app/state';
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

<AppHeader {pageName} />

<PageShell>
	{@render children()}
</PageShell>

<Footer />