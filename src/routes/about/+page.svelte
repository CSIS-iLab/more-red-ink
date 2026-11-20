<script>
	import Credits from '$lib/components/layout/Credits.svelte';
  import CreditsLink from '$lib/components/layout/CreditsLink.svelte';
</script>

<svelte:head>
	<title>About | More Red Ink Calculator</title>
</svelte:head>

<div class="about-page">
	<div class="about-content">
		<h1 class="text-heading-2">About the Industrial Policy Spending Calculator</h1>
		<p>
			Everyone has an opinion about industrial policy—government spending and regulations meant to
			strengthen the competitiveness of a country’s firms and industries to advance both economic
			and security objectives—but few have a firm grasp of the actual scope of industrial policy in
			different countries or its trends over time. As a result, arguments about the breadth,
			fairness, legality, and value of industrial policy tend to be frustrating and inconclusive.
		</p>
		<p>
			The Industrial Policy Spending Calculator, developed by CSIS's <CreditsLink href="https://www.csis.org/programs/chinese-business-and-economics">Trustee Chair in Chinese Business and Economics</CreditsLink> and the <CreditsLink href="https://www.csis.org/dracopoulos-ideas-lab">Andreas C. Dracopoulos iDeas Lab</CreditsLink>, seeks to break this impasse by providing extensive
			data on industrial policy spending by China and seven other economies—Brazil, France, Germany,
			Japan, South Korea, Taiwan, and the United States—for the years 2019–2024. The calculator’s
			underlying data is composed of multiple industrial policy spending tools from each economy,
			including fiscal subsidies, below-market credit, and government procurement. Because there are
			reasonable alternative ways to estimate the value of the different spending tools, the
			calculator gives you the power to make industrial policy spending estimates based on
			assumptions you select.
		</p>
		<p>
			Learn more about the data, methodology, and broader implications in the companion CSIS report, <i
				>More Red Ink: The Industrial Policy Spending Arms Race by China and Others</i
			>. <i>More Red Ink</i> itself is a follow-up study to the CSIS report
			<i>Red Ink: Estimating Chinese Industrial Policy in Comparative Perspective</i> (2022).
		</p>
    <p>Most recent update: December 7, 2026</p>

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
		padding-block-start: 0;
		padding-block-end: var(--heading-2-bottom-padding, 18px);
		color: var(--text-primary, #020618);
		line-height: 110%;

		@media (width >= 960px) {
			padding-block-start: var(--text-components-heading-2-top-padding, 72px);
		}
	}
</style>
