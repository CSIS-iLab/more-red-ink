<!--
  TextLink

  A small underlined text link, used for page-level navigation such as
  Back and "Create a new estimate".

  Props:
  - href: the destination, already resolved (e.g. resolve('/')).
  - onclick: optional click handler.
  - newTab: open the link in a new tab (announced to screen readers).
-->

<script>
	let { href, onclick, newTab = false, children } = $props();
</script>

<!-- Callers pass a resolved href. -->
<!-- eslint-disable svelte/no-navigation-without-resolve -->
<a
	class="text-link text-label-small-emphasized"
	{href}
	{onclick}
	target={newTab ? '_blank' : undefined}
	rel={newTab ? 'noopener' : undefined}
>
	{@render children()}
	{#if newTab}
		<span class="visually-hidden">(opens in a new tab)</span>
	{/if}
</a>

<!-- eslint-enable svelte/no-navigation-without-resolve -->

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

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.text-link:focus-visible {
		outline: 2px solid var(--color-card-button-focus-border);
		outline-offset: 4px;
		border-radius: 2px;
	}
</style>
