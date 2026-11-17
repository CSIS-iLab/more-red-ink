<script>
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Home | More Red Ink Calculator</title>
</svelte:head>

<div class="home-page">
	<header class="home-hero">
		<picture class="home-hero__image">
			<source media="(max-width: 639px)" srcset="/images/320-hero.jpg" />
			<source media="(max-width: 959px)" srcset="/images/640-hero.jpg" />
			<img
				src="/images/full-height-hero.jpg"
				alt=""
				width="1920"
				height="640"
				fetchpriority="high"
			/>
		</picture>

		<div class="home-hero__title">
			<h1>Industrial Policy Spending Calculator</h1>
		</div>
	</header>

	<div class="home__content">
		<!-- The Visualizer's "Create a new estimate" link scrolls here. -->
		<section id="using-the-calculator" class="instructions">
			<p>
				The Calculator lets you create industrial policy spending estimates for China and seven
				other economies—Brazil, France, Germany, Japan, South Korea, Taiwan, and the United
				States—for the years 2019-2024 through the building of a “stack” of multiple industrial
				policy spending tools, including fiscal subsidies, tax breaks, below-market credit,
				government investment funds, government procurement, and other measures.
			</p>
			<p>
				Reasonable alternative assumptions can be made about several of the tools in the stack.
				Based on assumptions you select, the calculator will present results through multiple charts
				that let you compare industrial policy spending across the eight economies as well as
				explore each individual economy.
			</p>
			<p>Select a mode to start.</p>
		</section>

		<div class="options">
			<div class="mode-options">
				<a class="mode-option" href={resolve('/fast-track')}>
					<span class="mode-option__title">Fast-Track Mode</span>
					<span class="mode-option__desc">
						Select this mode to see either the lowest or highest estimates.
					</span>
				</a>

				<a class="mode-option" href={resolve('/user-driven')}>
					<span class="mode-option__title">User-Driven Mode</span>
					<span class="mode-option__desc">
						Select this mode to have more granular control over the assumptions about the various
						tools that produce the estimate.
					</span>
				</a>
			</div>
		</div>
	</div>
</div>

<style>
	:root {
		--navbar-height: 64px;
	}

	.home-page {
		min-width: 320px;
		padding-block-end: var(--global-spacing-section-vertical-padding-small, 36px);
	}

	/* -------------------------------------------------------------------------- */
	/*                                HOME HERO                                   */
	/* -------------------------------------------------------------------------- */

	.home-hero {
		position: relative;
		width: 100%;
	}

	.home-hero__image {
		display: block;
		width: 100%;
		height: 240px;
		overflow: hidden;
	}

	.home-hero__image img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}

	.home-hero__title {
		padding: 36px 16px;
		background: var(--color-sky-50);
	}

	.home-hero__title h1 {
		margin: 0;
		color: var(--text-page-title, #0c173d);
		font-family: var(--font-hero);
		font-size: 45px;
		font-weight: 600;
		line-height: 110%;
	}

	/* 640–959px: title below the image */
	@media (width >= 640px) {
		.home-hero__title {
			padding: 36px 0;
		}

		.home-hero__title h1 {
			max-width: 544px;
			margin-inline: auto;
		}
	}

	/* 960px+: title overlaid on the image */
	@media (width >= 960px) {
		.home-hero__image {
			height: auto;
			aspect-ratio: 3 / 1;
		}

		.home-hero__title {
			position: absolute;
			inset: 0;
			display: flex;
			align-items: center;
			padding: 0;
			background: transparent;
		}

		.home-hero__title h1 {
			width: 100%;
			max-width: 480px;
			margin-left: 15%;
			color: #fff;
			font-size: 50px;
		}
	}

	/* -------------------------------------------------------------------------- */
	/*                                HOME CONTENT                                */
	/* -------------------------------------------------------------------------- */

	.home__content {
		margin-block: 0 36px;
		width: 100%;
		box-sizing: border-box;
		padding-inline: 16px;

		@media (width >= 640px) {
			max-width: 544px;
			margin-inline: auto;
			padding-inline: 0;
		}

		@media (width >= 960px) {
			max-width: 576px;
			margin-block-start: 72px;
		}

		@media (width >= 1100px) {
			margin-block-start: 80px;
		}

		@media (width >= 1280px) {
			margin-block-end: 40px;
			width: 564px;
			max-width: none;
		}

		@media (width >= 1440px) {
			width: 636px;
		}

		p {
			margin: 0;
			margin-bottom: var(--text-style-specs-body-long-regular-size, 18px);
			color: var(--text-secondary, #1d293d);
			font-family: var(--font-body, 'IBM Plex Sans');
			font-size: var(--text-style-specs-body-long-regular-size, 18px);
			font-style: normal;
			font-weight: 400;
			line-height: 150%;

			@media (width >= 1280px) {
				font-size: var(--text-style-specs-body-long-regular-size, 20px);
			}

			&:last-of-type {
				margin-block-end: 0;
			}
		}

		.instructions {
			scroll-margin-top: calc(var(--navbar-height) + 2.5rem);
		}

		.options {
			margin-block: var(--global-spacing-section-vertical-padding-small, 36px);
		}

		.mode-options {
			display: grid;
			gap: 24px;

			@media (width >= 1280px) {
				grid-template-columns: repeat(2, minmax(0, 1fr));
			}
		}

		.mode-option {
			display: flex;
			flex-direction: column;
			gap: 16px;
			padding: 24px;
			border-radius: 8px;
			background: var(--CTA-button-enabled, #1d293d);
			color: var(--color-cta-text-primary);
			text-decoration: none;
			transition: background-color 0.3s ease-in-out;

			.mode-option__title {
				color: var(--CTA-button-text-primary, #fff);
				font-family: var(--font-label, 'IBM Plex Sans');
				font-size: var(--text-style-specs-label-large-size, 18px);
				font-style: normal;
				font-weight: 500;
				line-height: 120%;

				@media (width >= 1280px) {
					font-size: var(--text-style-specs-label-large-size, 20px);
				}
			}

			.mode-option__desc {
				color: var(--CTA-button-text-secondary, #f8fafc);
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

		.mode-option:hover {
			background: var(--color-cta-hover);
		}

		.mode-option:active {
			background: var(--color-cta-pressed);
		}

		.mode-option:focus-visible {
			outline: 2px solid var(--color-white);
			outline-offset: -4px;
			box-shadow: 0 0 0 1px var(--color-neutral-600);
		}
	}
</style>
