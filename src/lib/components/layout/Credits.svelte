<script>
	import CreditsLink from './CreditsLink.svelte';
</script>

<section class="credits">
	<div class="credits-grid">
		<!-- Research -->
		<div class="credits-col">
			<h2 class="text-heading-3">Research</h2>

			<a
				class="text-heading-5"
				href="https://www.csis.org/programs/chinese-business-and-economics"
				target="_blank"
				rel="noopener noreferrer"
			>
				Trustee Chair in Chinese Business and Economics
			</a>

			<div class="credits-group">
				<p class="text-label-small-emphasized">Written by</p>
				<div class="credits-names">
					<CreditsLink href="https://www.csis.org/people/scott-kennedy">Scott Kennedy</CreditsLink>
					<CreditsLink href="https://www.csis.org/people/ryan-featherston">
						Ryan Featherston
					</CreditsLink>
				</div>
			</div>

			<!-- Acknowledgments -->
			<div class="acknowledgments">
				<h2 class="text-heading-3">Acknowledgments</h2>

				<p class="text-body-2-regular">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua.
				</p>

				<p class="text-body-2-regular">
					Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
					commodo consequat.
				</p>
			</div>
		</div>

		<!-- Production -->
		<div class="credits-col">
			<h2 class="text-heading-3">Production</h2>

			<a
				class="text-heading-5"
				href="https://www.csis.org/dracopoulos-ideas-lab"
				target="_blank"
				rel="noopener noreferrer"
			>
				Andreas C. Dracopoulos iDeas Lab
			</a>

			<div class="credits-list">
				<div class="credits-group">
					<p class="text-label-small-emphasized">UI/UX, information design & management</p>
					<p class="text-body-2-regular">
						<CreditsLink href="https://www.csis.org/people/shannon-yeung">
							Shannon Yeung
						</CreditsLink>
					</p>
				</div>

				<div class="credits-group">
					<p class="text-label-small-emphasized">Development</p>
					<div class="credits-names">
						<CreditsLink href="https://www.csis.org/people/mariel-de-la-garza">
							Mariel A. de la Garza
						</CreditsLink>
						<CreditsLink href="https://www.csis.org/people/lindsay-allison">
							Lindsay Allison
						</CreditsLink>
					</div>
				</div>

				<div class="credits-group">
					<p class="text-label-small-emphasized">Copyediting</p>
					<p class="text-body-2-regular">
						<CreditsLink href="https://www.csis.org/people/shannon-yeung">
							Shannon Yeung
						</CreditsLink>
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.credits {
		background: var(--color-author-block);
		color: var(--color-text-secondary);
		padding: 48px 0;
	}

	.credits-grid {
		width: 100%;
		max-width: 1296px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 64px;
	}

	.credits-col {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 24px;
		min-width: 0;
	}

	.credits-names {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 4px;
	}

	.credits-col > h2,
	.acknowledgments h2 {
		color: var(--color-text-primary);
		text-align: center;
		margin: 0;
	}

	.credits-col > h2 {
		align-self: center;
	}

	.credits-col > a {
		color: var(--color-text-secondary);
	}

	.credits-list {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.credits-group {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.acknowledgments {
		display: flex;
		flex-direction: column;
		gap: 24px;
		width: 100%;
		margin-top: 32px;
	}

	.acknowledgments h2 {
		margin-bottom: 4px;
	}

	p {
		margin: 0;
		line-height: 1.2;
	}

	.credits a {
		color: var(--color-text-secondary);
		text-decoration-line: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.15em;
		text-decoration-skip-ink: auto;
		transition: color 0.3s ease;
	}

	.credits a:hover,
	.credits a:focus-visible {
		color: var(--color-text-primary);
	}

	.credits a:focus-visible {
		outline: 2px solid var(--color-text-primary);
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
