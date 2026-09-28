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
</svelte:head>

<AppHeader {pageName} />

<PageShell>
	{@render children()}
</PageShell>