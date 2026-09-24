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
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
