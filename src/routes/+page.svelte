<!--
  Home

  Entry point for the calculator.

  Responsibilities:
  - Introduce the tool and its purpose.
  - Allow the user to choose Fast Track or User Driven mode.
  - Provide access to the accompanying report.

  Implementation notes:
  - Visiting this route should not create, change, or reset an estimate.
  - Mode selection/navigation begins the appropriate calculator workflow.
-->
<script>
	import Credits from '$lib/components/layout/Credits.svelte';
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<!-- existing Home content -->

<Credits />
