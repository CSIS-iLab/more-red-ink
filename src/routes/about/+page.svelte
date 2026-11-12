<script>
	import Credits from '$lib/components/layout/Credits.svelte';
	let { data } = $props();
	let homeContent = $derived(data.homeContent);
</script>

<svelte:head>
	<title>About | More Red Ink Calculator</title>
</svelte:head>

<div class="about-page">
	<div class="about-content">
		<h1 class="text-heading-2">About</h1>

		{#if homeContent}
			{#each homeContent as content (content.id)}
				{#each content.intro as paragraph, i (i)}
					<p>{paragraph}</p>
				{/each}

				{#if content.published_date}
					<p class="published-date">
						<time datetime={content.published_date.iso}>
							{content.published_date.label}
						</time>
					</p>
				{/if}
			{/each}
		{/if}
		<Credits />
	</div>
</div>

<style>
	.about-page {
		min-width: 320px;
		padding-inline: var(--layout-guide-specs-xs-320-margin-5-vw, 16px);
		padding-block: var(--global-spacing-section-vertical-padding-medium, 80px);

		@media (width >= 640px) {
			padding-inline: var(--layout-guide-specs-s-640-margin-5-vw, 32px);
		}

		@media (width >= 960px) {
			padding-inline: var(--layout-guide-specs-m-960-margin-5-vw, 48px);
		}

		@media (width >= 1280px) {
			padding-inline: var(--layout-guide-specs-l-1280-margin-5-vw, 64px);
		}

		@media (width >= 1440px) {
			padding-inline: var(--layout-guide-specs-l-1280-margin-5-vw, 80px);
		}
	}

	.about-content {
		width: 100%;

		@media (width >= 640px) {
			max-width: 480px;
			margin-inline: auto;
		}

		@media (width >= 1280px) {
			width: 564px;
			max-width: none;
		}

		@media (width >= 1440px) {
			width: 636px;
		}
	}

	.about-content p {
		margin: 0;
		margin-bottom: var(--text-style-specs-body-long-regular-size, 18px);
		color: var(--text-secondary, #1d293d);
		font-family: var(--font-body, 'IBM Plex Sans');
		font-size: var(--text-style-specs-body-long-regular-size, 18px);
		font-weight: 400;
		line-height: 150%;

		@media (width >= 1280px) {
			font-size: var(--text-style-specs-body-long-regular-size, 20px);
		}
	}

	h1 {
		margin: 0;
		padding-block-start: var(--text-components-heading-2-top-padding, 72px);
		padding-block-end: var(--heading-2-bottom-padding, 18px);
		color: var(--text-primary, #020618);
		line-height: 110%;
	}

	.published-date {
		margin-top: 24px;
	}
</style>
