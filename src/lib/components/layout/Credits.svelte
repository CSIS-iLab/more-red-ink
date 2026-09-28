<script>
	import CreditsLink from './CreditsLink.svelte';
</script>

<section class="credits">
	<div class="credits-grid">
		<div class="credits-col">
			<p class="text-body-1-regular">Research</p>

			<a
				class="text-body-2-regular"
				href="https://www.csis.org/programs/chinese-business-and-economics"
				target="_blank"
				rel="noopener noreferrer"
			>
				Trustee Chair in Chinese Business and Economics
			</a>

			<p class="text-body-3-regular">
				Written by:
				<CreditsLink href="https://www.csis.org/people/scott-kennedy">
					Scott Kennedy
				</CreditsLink>
				and
				<CreditsLink href="https://www.csis.org/people/ryan-featherston">
					Ryan Featherston
				</CreditsLink>
			</p>
		</div>

		<div class="credits-col">
			<p class="text-body-1-regular">Story Production</p>

			<a
				class="text-body-2-regular"
				href="https://www.csis.org/dracopoulos-ideas-lab"
				target="_blank"
				rel="noopener noreferrer"
			>
				Andreas C. Dracopoulos iDeas Lab
			</a>

			<div class="credits-list">
				<p class="text-body-3-regular">
					Data visualization by:
					<CreditsLink href="https://www.csis.org/people/shannon-yeung">
						Shannon Yeung
					</CreditsLink>
				</p>

				<p class="text-body-3-regular">
					Development by:
					<CreditsLink href="https://www.csis.org/people/mariel-de-la-garza">
						Mariel A. de la Garza
					</CreditsLink>
					and
					<CreditsLink href="https://www.csis.org/people/lindsay-allison">
						Lindsay Allison
					</CreditsLink>
				</p>

				<p class="text-body-3-regular">
					Page design by:
					<CreditsLink href="https://www.csis.org/people/shannon-yeung">
						Shannon Yeung
					</CreditsLink>
				</p>
			</div>
		</div>
	</div>
</section>

<style>
	.credits {
		background: var(--color-sky-800);
		color: var(--color-sky-50);
		padding: 64px 24px;
	}

	.credits-grid {
		max-width: 1280px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 64px;
	}

	.credits-col {
		display: grid;
		gap: 20px;
		align-content: start;
	}

	p {
		margin: 0;
		line-height: 1.2;
	}

	.credits a {
		display: inline-block;
		width: fit-content;
		color: var(--color-sky-50);
		text-decoration: none;
		border-bottom: 1px solid currentColor;
		transition:
			color 0.3s ease,
			border-color 0.3s ease;
	}

	.credits a:hover,
	.credits a:focus-visible {
		color: var(--color-sky-300);
		border-bottom-color: var(--color-sky-300);
	}

	.credits a:focus-visible {
		outline: 2px solid var(--color-sky-300);
		outline-offset: 2px;
	}

	@media (max-width: 760px) {
		.credits {
			padding: 40px 18px;
		}

		.credits-grid {
			grid-template-columns: 1fr;
			gap: 32px;
		}
	}
</style>