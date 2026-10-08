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
	});
</script>

<svelte:head>
	<title>Home | More Red Ink Calculator</title>
</svelte:head>

<div class="home-page">
	<div class="home">
		{#if homeContent}
			{#each homeContent as content (content.id)}
				<h1 class="title">{content.title}</h1>
				<p>By Author one, Author Two</p>
				<time datetime="2026-11-16">November 16, 2026</time>
				<img class="" src={content.img_url} alt={content.img_alt} />

				<div class="home__content">
					<p class="text-body-2-regular">
						Short summary of the More Red Ink report and its relationship to this tool. Explain that
						this tool will help the user calculate an intellectually defensible industrial policy
						spending estimate, why the estimate is valuable and what the estimate can help the user
						achieve...
					</p>

					<!-- TODO: Replace with final More Red Ink report URL when provided. -->
					<Button href={resolve('/')} variant="secondary" target="_blank" rel="noreferrer">
						Read the report
						<img src="/icons/external-link.svg" alt="" />
					</Button>

					<section class="instructions">
						<h2 class="text-body-1-regular">Using the Calculator</h2>
						<p class="text-body-2-regular">
							Instructions for use and mention expected outcomes, e.g. “Use this tool to calculate
							an industrial policy spending estimate for China and 7 other economies – Brazil,
							France, Germany, Japan, South Korea, Taiwan, and the United States. You can make
							choices about the assumptions that will go into the estimate and generate charts for
							comparison.”
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
</div>

<style>
	.title {
		color: var(--text-page-title, #0c173d);

		/* iLab template/hero/1 */
		font-family: var(--font-hero, 'EB Garamond');
		font-size: var(--text-style-specs-hero-1-size, 45px);
		font-style: normal;
		font-weight: 600;
		line-height: 110%; /* 49.5px */
	}
	.home-page {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.home {
		flex: 1;
		width: min(100% - 2rem, 40rem);
		margin: 0 auto;
		padding: 3rem 0 4rem;
	}

	.home h1 {
		margin: 0 0 3rem;
		text-align: center;
	}

	.home__content {
		width: 100%;
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
