<!--
  TextLink

  A small underlined text link, used for page-level navigation such as
  Back and "Create a new estimate".

  Props:
  - href: the destination, already resolved (e.g. resolve('/')).
  - onclick: optional click handler.
-->

<script>
	let { href, onclick, children } = $props();
</script>

<!-- Callers pass a resolved href. -->
<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a class="text-link text-label-small-emphasized" {href} {onclick}>
	{@render children()}
</a>

<style>
	.text-link {
		display: inline-flex;
		/* Keep the underline to the link's width inside flex columns. */
		align-self: flex-start;
		align-items: center;
		gap: 0.375rem;
		color: var(--color-link-text);
		text-decoration: none;
		border-bottom: 1px solid currentColor;
		line-height: 1;
		transition: color 0.3s ease;
	}

	.text-link:hover {
		color: var(--color-link-hover);
	}

	.text-link:focus-visible {
		outline: 2px solid var(--color-card-button-focus-border);
		outline-offset: 4px;
		border-radius: 2px;
	}
</style>
