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
				<p class="text-label-small-emphasized">Authors</p>
				<div class="credits-bios">
					<p class="text-body-2-regular">
						<CreditsLink href="https://www.csis.org/people/scott-kennedy">Scott Kennedy</CreditsLink
						> is senior adviser and trustee chair in Chinese Business and Economics at the Center for
						Strategic and International Studies (CSIS). A leading authority on Chinese economic policy
						and U.S.-China commercial relations, Kennedy has been traveling to China for 38 years. His
						ongoing areas of focus include China’s innovation drive, Chinese industrial policy, U.S.-China
						relations, and global economic governance. His articles have appeared in a wide array of policy,
						popular, and academic venues, including the New York Times, the Wall Street Journal, Foreign
						Affairs, Foreign Policy, and China Quarterly. His recent major publications include The Power
						of Innovation: The Strategic Value of China’s High-Tech Drive (CSIS, March 2026); Managing
						U.S.-China Tensions over the Global Economic Order: Tentative Proposals (CSIS, November 2024);
						(with Wang Jisi) Breaking the Ice: The Role of Scholarly Exchange in Stabilizing U.S.-China
						Relations (CSIS, 2023); and China’s Uneven High-Tech Drive: Implications for the United States
						(CSIS, 2020). Kennedy hosts the China Field Notes podcast, which features voices from on the
						ground in China. From 2000 to 2014, Kennedy was a professor at Indiana University (IU), where
						he established the Research Center for Chinese Politics and Business and was the founding
						academic director of IU’s China Office. Kennedy received a PhD in political science from George
						Washington University, an MA from Johns Hopkins School of Advanced International Studies,
						and a BA from the University of Virginia.
					</p>
					<p class="text-body-2-regular">
						<CreditsLink href="https://www.csis.org/people/ryan-featherston">
							Ryan Featherston
						</CreditsLink> is an associate fellow with the Trustee Chair in Chinese Business and Economics
						at the Center for Strategic and International Studies (CSIS). His research interests include
						industrial policy, China’s global trade, and the impact of the Chinese domestic economy on
						the rest of the world. His recent publications include The Global EV Shift: The Role of China
						and Industrial Policy in Emerging Economies, Wins and Losses: Chinese Industrial Policy’s
						Uneven Success, and Is Your Refrigerator Running? China’s Trade-In Programs and Plans to Boost
						Consumption. Prior to joining CSIS, he was a research analyst at Rhodium Group, a private
						research firm, where he researched China’s macroeconomy, industrial subsidies, and green tech
						trade. Featherston received an MA in China studies with an emphasis in economics and management
						from the Yenching Academy at Peking University. He holds a BA in economics and Chinese language
						from Arizona State University.
					</p>
				</div>
			</div>

			<!-- Acknowledgments -->
			<div class="acknowledgments">
				<h2 class="text-heading-3">Special Thanks</h2>

				<p class="text-body-2-regular">
					We are grateful to Trustee Chair Deputy Director Ilaria Mazzocco and former CSIS colleagues Gerard DiPippo and Matthew P. Goodman, as well as a cohort of research interns, for the pathbreaking work they did for the 2022 report which contributed to the calculator. The research behind the calculator was supported by three research interns – Andy Yang, Antonio Tintoré Vicent, and Eleanor Randoph – who helped find and assemble data about industrial policy spending from a diverse array of sources. Finally, the calculator would not have been possible without the support of the Dracopoulos iDeas Lab. Special thanks goes to iDeas Lab staff -  Shannon Yeung, Mariel de la Garza, Emma Cantlay, and Lindsay Allison – for their attention to detail, professionalism, and patience. 
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

	.credits-bios {
		display: flex;
		flex-direction: column;
		gap: 24px;
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
		color: var(--color-blue-800);
	}

	.credits a:focus-visible {
		outline: 2px solid var(--color-blue-800);
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
