<!--
  BackLink

  The "< Back" link at the top of the assumption forms and the Visualizer.
  Pass an href built with resolve().
-->

<script>
	let { href } = $props();
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a class="back-link text-body-2-regular" {href}>&lt; Back</a>

<style>
	.back-link {
		display: inline-block;
		color: var(--color-link-text);
		line-height: 1.5;
	}

	.back-link:hover {
		color: var(--color-link-hover);
	}
</style>
