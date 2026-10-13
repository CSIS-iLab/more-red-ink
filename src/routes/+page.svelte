<script>
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	// import Button from '$lib/components/controls/Button.svelte';
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
				<figure class="img-header">
					<img src={content.img_url} alt={content.img_alt} width="1024" height="1024" />
				</figure>
			</header>
			<div class="home__content">
				{#each content.intro as paragraph, i (i)}
					<p>{paragraph}</p>
				{/each}

				<!-- TODO: Replace with final More Red Ink report URL when provided. -->
				<!-- <Button href={resolve('/')} variant="secondary" target="_blank" rel="noreferrer">
					Read the report
					<img src="/icons/external-link.svg" alt="" />
				</Button> -->

				<section class="instructions">
					<h2>Using the Calculator</h2>
					{#each content.how_to as paragraph, i (i)}
						<p>
							{paragraph}
						</p>
					{/each}
				</section>

				<div class="options">
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

	/* -------------------------------------------------------------------------- */
	/*                                   HEADER                                   */
	/* -------------------------------------------------------------------------- */
	header {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-block-end: var(--global-spacing-section-vertical-padding-small, 36px);

		@media (width >= 640px) {
			/* width: 428px; */
			max-width: 480px;
			margin-inline: auto;
		}

		@media (width >= 1280px) {
			width: 480px;
		}

		@media (width >= 1440px) {
			flex-direction: row;
			align-items: center;
			min-width: 1440px;
			/* gap: 64px; */
			padding: var(--global-spacing-section-vertical-padding-medium, 80px) 0;
		}
		.text-header-block {
			display: flex;
			padding: var(--text-components-report-title-block-top-padding, 36px) 0
				var(--text-components-report-title-block-bottom-padding, 36px) 0;
			flex-direction: column;
			align-items: flex-start;
			justify-content: center;
			gap: var(--text-components-report-title-block-gap, 36px);

			@media (width>= 1440px) {
				min-width: 480px;
				align-self: stretch;
				gap: var(--text-components-report-title-block-gap, 40px);
				align-self: stretch;
				padding: 0 80px;

				h1 {
					margin: 0;
				}
			}
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
			line-height: 110%;

			@media (width >= 1280px) {
				font-size: var(--text-style-specs-hero-1-size, 50px);
			}
		}

		.byline {
			color: var(--text-secondary, #1d293d);
			font-family: var(--font-label, 'IBM Plex Sans');
			font-size: var(--text-style-specs-label-medium-size, 16px);
			font-style: normal;
			font-weight: 500;
			line-height: 120%;

			@media (width >= 1280px) {
				font-size: var(--text-style-specs-label-medium-size, 18px);
				line-height: 120%;
			}
		}
		.byline__author:not(:last-child)::after {
			content: ', ';
		}

		.header-footer {
			time {
				color: var(--text-helper, #62748e);
				font-family: var(--font-label, 'IBM Plex Sans');
				font-size: var(--text-style-specs-label-small-size, 15px);
				font-style: normal;
				font-weight: 400;
				line-height: 120%;

				@media (width >= 1280px) {
					font-size: var(--text-style-specs-label-small-size, 16px);
				}
			}
		}

		.img-header {
			margin: 0;

			@media (width >= 1440px) {
				width: 100%;
				padding: var(--global-spacing-section-vertical-padding-medium, 80px) 40px;
			}

			img {
				display: block;
				width: 100%;
				height: auto;
			}
		}
	}

	/* -------------------------------------------------------------------------- */
	/*                                HOME CONTENT                                */
	/* -------------------------------------------------------------------------- */
	.home__content {
		p {
			margin: 0;
			margin-bottom: var(--text-style-specs-body-long-regular-size, 18px);

			color: var(--text-secondary, #1d293d);
			font-family: var(--font-body, 'IBM Plex Sans');
			font-size: var(--text-style-specs-body-long-regular-size, 18px);
			font-style: normal;
			font-weight: 400;
			line-height: 150%;

			&:last-of-type {
				margin-block-end: 0;
			}
		}

		.instructions {
			padding: var(--text-components-heading-2-top-padding, 65px) 0
				var(--heading-2-bottom-padding, 18px) 0;

			h2 {
				margin: 0;
				margin-block-end: var(--heading-2-bottom-padding, 18px);

				color: var(--text-primary, #020618);
				font-family: var(--font-heading, 'EB Garamond');
				font-size: var(--text-style-specs-heading-2-size, 37px);
				font-style: normal;
				font-weight: 500;
				line-height: 110%;
			}

			p {
				color: var(--text-secondary, #1d293d);
				font-family: var(--font-body, 'IBM Plex Sans');
				font-size: var(--text-style-specs-body-long-regular-size, 18px);
				font-style: normal;
				font-weight: 400;
				line-height: 150%;
			}
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
	}
</style>
