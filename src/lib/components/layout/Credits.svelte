<script>
	import CreditsLink from './CreditsLink.svelte';
</script>

<section class="credits">
	<div class="credits-grid">
		<div class="credits-col">
			<p class="text-heading-3">Research</p>

			<a
				class="text-heading-5"
				href="https://www.csis.org/programs/chinese-business-and-economics"
				target="_blank"
				rel="noopener noreferrer"
			>
				Trustee Chair in Chinese Business and Economics
			</a>

			<p class="text-body-2-regular">
				Written by:
				<CreditsLink href="https://www.csis.org/people/scott-kennedy">Scott Kennedy</CreditsLink>
				and
				<CreditsLink href="https://www.csis.org/people/ryan-featherston">
					Ryan Featherston
				</CreditsLink>
			</p>
		</div>

		<div class="credits-col">
			<p class="text-heading-3">Production</p>

			<a
				class="text-heading-5"
				href="https://www.csis.org/dracopoulos-ideas-lab"
				target="_blank"
				rel="noopener noreferrer"
			>
				Andreas C. Dracopoulos iDeas Lab
			</a>

			<div class="credits-list">
				<p class="text-body-2-regular">
					Data visualization by:
					<CreditsLink href="https://www.csis.org/people/shannon-yeung">Shannon Yeung</CreditsLink>
				</p>

				<p class="text-body-2-regular">
					Development by:
					<CreditsLink href="https://www.csis.org/people/mariel-de-la-garza">
						Mariel A. de la Garza
					</CreditsLink>
					and
					<CreditsLink href="https://www.csis.org/people/lindsay-allison">
						Lindsay Allison
					</CreditsLink>
				</p>

				<p class="text-body-2-regular">
					Page design by:
					<CreditsLink href="https://www.csis.org/people/shannon-yeung">Shannon Yeung</CreditsLink>
				</p>
			</div>
		</div>
	</div>
</section>

<style>
	.credits {
		background: var(--color-author-block);
		color: var(--color-text-primary);
		padding: 40px 0;
	}

	.credits-grid {
		width: 100%;
		max-width: 1296px;
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
		color: var(--color-text-primary);
		text-decoration-line: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.15em;
		text-decoration-skip-ink: auto;
		transition: color 0.3s ease;
	}

	.credits a:hover,
	.credits a:focus-visible {
		color: var(--color-slate-500);
	}

	.credits a:focus-visible {
		outline: 2px solid var(--color-sky-300);
		outline-offset: 2px;
	}

	@media screen and (max-width: 1439px) {
		.credits-grid {
			padding-left: 64px;
			padding-right: 64px;
		}
	}

	@media screen and (max-width: 1279px) {
		.credits-grid {
			padding-left: 48px;
			padding-right: 48px;
		}
	}

	@media screen and (max-width: 959px) {
		.credits-grid {
			padding-left: 32px;
			padding-right: 32px;
		}
	}

	@media screen and (max-width: 760px) {
		.credits {
			padding-top: 40px;
			padding-bottom: 40px;
		}

		.credits-grid {
			grid-template-columns: 1fr;
			gap: 32px;
		}
	}

	@media screen and (max-width: 639px) {
		.credits-grid {
			max-width: 320px;
		}
	}

	@media screen and (max-width: 320px) {
		.credits-grid {
			padding-left: 20px;
			padding-right: 20px;
		}
	}
</style>
