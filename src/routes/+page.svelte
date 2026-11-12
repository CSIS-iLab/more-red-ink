<script>
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Home | More Red Ink Calculator</title>
</svelte:head>

<div class="home-page">
	<header class="home-hero">
		<img src="/images/hero.jpg" alt="" width="1440" height="480" fetchpriority="high" />
	</header>
	<div class="home__content">
		<!-- The Visualizer's "Create a new estimate" link scrolls here. -->
		<section id="using-the-calculator" class="instructions">
			<p>
				The Industrial Policy Spending Calculator lets you create industrial policy spending
				estimates for China and seven other economies —Brazil, France, Germany, Japan, South Korea,
				Taiwan, and the United States— for the years 2019-2024 through the building of a "stack"
				based on the cumulative total of multiple industrial policy spending tools, including fiscal
				subsidies, tax breaks, below-market credit, government investment funds, government
				procurement, and other measures.
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
					<span class="mode-option__title">Fast Track</span>
					<span class="mode-option__desc">
						Select this mode to see either the lowest or highest estimates.
					</span>
				</a>

				<a class="mode-option" href={resolve('/user-driven')}>
					<span class="mode-option__title">User Driven</span>
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
	/*                                   HERO                                     */
	/* -------------------------------------------------------------------------- */

	.home-hero {
		width: 100%;
		margin: 0;
	}

	.home-hero img {
		display: block;
		width: 100%;
		height: auto;
	}

	/* -------------------------------------------------------------------------- */
	/*                                HOME CONTENT                                */
	/* -------------------------------------------------------------------------- */
	.home__content {
		margin-block: var(--global-spacing-section-vertical-padding-small, 36px);
		padding-inline: 16px;

		@media (width >= 640px) {
			max-width: 544px;
			padding-inline: 32px;
			margin-inline: auto;
		}

		@media (width >= 960px) {
			max-width: 576px;
			padding-inline: 48px;
		}

		@media (width >= 1280px) {
			margin-block: 40px;
			width: 564px;
			max-width: none;
			padding-inline: 0;
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
