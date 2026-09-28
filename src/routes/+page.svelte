<!--
  Home

  Entry point for the calculator.

  Responsibilities:
  - Introduce the tool and its purpose.
  - Allow the user to choose Fast Track or User Driven mode.
  - Provide access to the accompanying report.

  Implementation notes:
  - Visiting this route should not create, change, or reset an estimate.
  - Mode selection/navigation begins the appropriate calculator workflow.
-->

<script>
	import Credits from '$lib/components/layout/Credits.svelte';
</script>

<svelte:head>
	<title>Home | More Red Ink Calculator</title>
</svelte:head>

<div class="home-page">
	<div class="home">
		<h1 class="text-heading-1">More Red Ink<br />Calculator</h1>

		<div class="home__content">
			<p class="text-body-2-regular">
				Short summary of the More Red Ink report and its relationship to this tool. Explain that
				this tool will help the user calculate an intellectually defensible industrial policy
				spending estimate, why the estimate is valuable and what the estimate can help the user
				achieve...
			</p>

			<a class="report-link text-label-large" href="/" target="_blank" rel="noreferrer">
				Read the report
				<img src="/icons/external-link.svg" alt="" />
			</a>

			<section class="instructions">
				<h2 class="text-body-1-regular">How to use this tool</h2>
				<p class="text-body-2-regular">
					Instructions for use and mention expected outcomes, e.g. “Use this tool to calculate an
					industrial policy spending estimate for China and 7 other economies – Brazil, France,
					Germany, Japan, South Korea, Taiwan, and the United States. You can make choices about the
					assumptions that will go into the estimate and generate charts for comparison.”
				</p>
			</section>

			<p class="text-body-2-regular">Choose a mode to start.</p>

			<div class="mode-options">
				<a class="mode-option" href="/fast-track">
					<span class="text-heading-3">Fast Track</span>
					<span class="text-body-3-regular">
						Short description about the option and why the user might want to pick this.
					</span>
				</a>

				<a class="mode-option" href="/user-driven">
					<span class="text-heading-3">User Driven</span>
					<span class="text-body-3-regular">
						Short description about the option and why the user might want to pick this.
					</span>
				</a>
			</div>
		</div>
	</div>

	<Credits />
</div>

<style>
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

	.report-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		min-height: 3rem;
		padding: 0 1rem;
		border: 1px solid currentColor;
		border-radius: 0.25rem;
		color: inherit;
		text-decoration: none;
	}

	.report-link img {
		width: 1.5rem;
		height: 1.5rem;
		flex-shrink: 0;
	}

	.mode-options {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.5rem;
	}

	.mode-option {
		display: flex;
		flex-direction: column;
		gap: 1rem;
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
