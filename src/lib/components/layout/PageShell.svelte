<script>
	let { children } = $props();
</script>

<main class="page-shell">
	{@render children()}
</main>

<style>
	.page-shell {
		width: 100%;
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	@media (max-width: 640px) {
		.page-shell {
			padding: 1rem;
		}
	}
</style>
