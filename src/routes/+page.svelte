<script>
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import Button from '$lib/components/controls/Button.svelte';
	import Credits from '$lib/components/layout/Credits.svelte';
	import { getHomeContent } from '$lib/data/loadHomeContent';

	let homeContent = $state('');
	onMount(async () => {
		const homeDataRes = await getHomeContent();
		homeContent = homeDataRes;
		console.log(homeContent);
	});
</script>

<svelte:head>
	<title>Home | More Red Ink Calculator</title>
</svelte:head>

<div class="home-page">
	{#if homeContent}
		{#each homeContent as content (content.id)}
			<header>
				<div class="text-header-block">
					<h1 class="title">{content.title}</h1>
					<div class="header-footer">
						<p class="byline">
							By
							{#each content.authors as author (author)}
								<span class="byline__author">{author}</span>
							{/each}
						</p>
						<time datetime={content.published_date.iso}>{content.published_date.label}</time>
					</div>
				</div>
				<img class="" src={content.img_url} alt={content.img_alt} />
			</header>
			<div class="home__content">
				{#each content.intro as paragraph, i (i)}
					<p class="text-body-2-regular">{paragraph}</p>
				{/each}

				<!-- TODO: Replace with final More Red Ink report URL when provided. -->
				<Button href={resolve('/')} variant="secondary" target="_blank" rel="noreferrer">
					Read the report
					<img src="/icons/external-link.svg" alt="" />
				</Button>

				<section class="instructions">
					<h2 class="text-body-1-regular">Using the Calculator</h2>
					<p class="text-body-2-regular">
						{content.how_to}
					</p>
				</section>

				<p class="text-body-2-regular">Choose a mode to start.</p>

				<div class="mode-options">
					<a class="mode-option" href={resolve('/fast-track')}>
						<span class="text-heading-3">Fast Track</span>
						<span class="text-body-3-regular">
							Short description about the option and why the user might want to pick this.
						</span>
					</a>

					<a class="mode-option" href={resolve('/user-driven')}>
						<span class="text-heading-3">User Driven</span>
						<span class="text-body-3-regular">
							Short description about the option and why the user might want to pick this.
						</span>
					</a>
				</div>
			</div>
		{/each}
	{/if}
</div>

<style>
	.home-page {
		margin-top: 20px;
		padding: 0 var(--layout-guide-specs-xs-320-margin-5-vw, 16px)
			var(--global-spacing-section-vertical-padding-small, 36px);
	}
	header {
		display: flex;
		/* max-width: 320px; */
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.text-header-block {
		display: flex;
		padding: var(--text-components-report-title-block-top-padding, 36px) 0
			var(--text-components-report-title-block-bottom-padding, 36px) 0;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--text-components-report-title-block-gap, 36px);
	}

	.header-footer p {
		margin: 0;
	}
	.title {
		color: var(--text-page-title, #0c173d);
		font-family: var(--font-hero, 'EB Garamond');
		font-size: var(--text-style-specs-hero-1-size, 45px);
		font-style: normal;
		font-weight: 600;
		line-height: 110%; /* 49.5px */
	}

	.byline__author:not(:last-child)::after {
		content: ', ';
	}

	.instructions {
		margin-top: 3rem;
	}

	.mode-options {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.5rem;
		margin-top: 3rem;
	}

	.mode-option {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		min-height: 9.75rem;
		padding: 1.5rem;
		border-radius: 0.5rem;
		background: var(--color-cta-enabled);
		color: var(--color-cta-text-primary);
		text-decoration: none;
		transition: background-color 0.3s ease;
	}

	.mode-option:hover {
		background: var(--color-cta-hover);
	}

	.mode-option:active {
		background: var(--color-cta-pressed);
	}

	.mode-option:focus-visible {
		outline: 1px solid var(--color-white);
		outline-offset: -2px;
		box-shadow: 0 0 0 1px var(--color-neutral-600);
	}
</style>
