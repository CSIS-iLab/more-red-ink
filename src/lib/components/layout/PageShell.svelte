<!--
  PageShell

  Shared page-level layout wrapper.

  Responsibilities:
  - Provide consistent page structure and width constraints.
  - Provide a common layout container for route content.

  Implementation notes:
  - This component should handle layout, not route-specific application logic.
  - Final markup and styling will follow the approved design.
-->

<script>
	let { children } = $props();
</script>

<main class="page-shell">
	{@render children()}
</main>

<style>
	.page-shell {
		width: 100%;
	}

	@media (max-width: 640px) {
		.page-shell {
			padding: 1rem;
		}
	}
</style>
