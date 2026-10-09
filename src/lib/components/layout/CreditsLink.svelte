<script>
	let { href, newTab = true, children } = $props();
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<a
	{href}
	target={newTab ? '_blank' : undefined}
	rel={newTab ? 'noopener noreferrer' : undefined}
	class="credits-link text-body-2-regular"
>
	{@render children?.()}
</a>

<style>
	.credits-link {
		color: var(--color-text-secondary);
		text-decoration: none;
		border-bottom: 1px solid currentColor;
		transition:
			color 0.3s ease,
			border-color 0.3s ease;
	}

	.credits-link:hover,
	.credits-link:focus-visible {
		color: var(--color-blue-800);
		border-bottom-color: var(--color-blue-800);
	}

	.credits-link:focus-visible {
		outline: 2px solid var(--color-blue-800);
		outline-offset: 2px;
	}
</style>