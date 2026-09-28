<section class="credits">
	<div class="container">
		<div class="credits__main">
			<div class="credits__col">
				<h2>Research</h2>

				<p>
					<a href="https://www.csis.org/programs/chinese-business-and-economics">
						Trustee Chair in Chinese Business and Economics
					</a>
				</p>

				<p>
					<strong>Written by:</strong>
					<a href="https://www.csis.org/people/scott-kennedy">Scott Kennedy</a>
					and
					<a href="https://www.csis.org/people/ryan-featherston">Ryan Featherston</a>
				</p>
			</div>

			<div class="credits__col">
				<h2>Story Production</h2>

				<p>
					<a href="https://www.csis.org/dracopoulos-ideas-lab">
						Andreas C. Dracopoulos iDeas Lab
					</a>
				</p>

				<p>
					<strong>Data visualization by:</strong>
					<a href="https://www.csis.org/people/shannon-yeung">Shannon Yeung</a>
					<br />

					<strong>Development by:</strong>
					<a href="https://www.csis.org/people/mariel-de-la-garza">Mariel A. de la Garza</a>
					and
					<a href="https://www.csis.org/people/lindsay-allison">Lindsay Allison</a>
					<br />

					<strong>Page design by:</strong>
					<a href="https://www.csis.org/people/shannon-yeung">Shannon Yeung</a>
				</p>
			</div>
		</div>
	</div>
</section>

<style>
	.credits {
		width: 100%;
		padding-top: 3rem;
		padding-bottom: 3rem;
	}

	.container {
		max-width: 1290px;
		margin: auto;
	}

	/* two columns on desktop */
	.credits__main {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem 4rem;
	}

	.credits__col {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1rem;
	}

	.credits__col h2 {
		margin: 0;
	}

	.credits__col p {
		margin: 0;
	}

	.credits__col a {
		color: inherit;
		text-decoration: underline;
		text-underline-offset: 0.1em;
	}

	/*-- --------------------------------------------------- --*/
	/*--                    Media Queries                    --*/
	/*-- --------------------------------------------------- --*/
	@media screen and (max-width: 1280px) {
		.container {
			max-width: 1152px;
			padding-left: 40px;
			padding-right: 40px;
		}
	}

	@media screen and (max-width: 1024px) {
		.container {
			max-width: 506px;
		}
	}

	@media screen and (max-width: 640px) {
		.credits {
			padding-top: 2rem;
			padding-bottom: 2rem;
		}

		.credits__main {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.container {
			max-width: 320px;
		}
	}
</style>