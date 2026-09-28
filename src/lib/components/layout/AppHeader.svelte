<!--
  AppHeader

  Site-wide application header.

  Responsibilities:
  - Render the More Red Ink tool header/navigation.
  - Remain consistent across application routes.

  Implementation notes:
  - Keep route-specific content and logic out of this component.
  - Final markup and styling will follow the approved design.
-->

<script>
	let { pageName = '' } = $props();
</script>

<header class="app-header">
	<div class="app-header__inner">
		<div class="app-header__titles">
			<div class="app-header__app-name">
				More Red Ink<br />
				Calculator
			</div>

			{#if pageName}
				<div class="app-header__divider" aria-hidden="true"></div>
				<div class="app-header__page-name">{pageName}</div>
			{/if}
		</div>

		<div class="app-header__brand" aria-label="Center for Strategic and International Studies">
			CSIS
		</div>
	</div>
</header>

<style>
	.app-header {
		width: 100%;
		background: #eef8fd;
		border-bottom: 1px solid #9ca3af;
	}

	.app-header__inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
		padding: 1.5rem 2rem;
	}

	.app-header__titles {
		display: flex;
		align-items: center;
		min-width: 0;
	}

	.app-header__app-name {
		flex: 0 0 auto;
		font-size: 1.25rem;
		font-weight: 700;
		line-height: 1.1;
	}

	.app-header__divider {
		align-self: stretch;
		width: 1px;
		min-height: 3.5rem;
		margin: 0 1.5rem;
		background: currentColor;
		opacity: 0.7;
	}

	.app-header__page-name {
		font-size: clamp(1.75rem, 3vw, 2.5rem);
		font-weight: 700;
		line-height: 1;
	}

	.app-header__brand {
		flex: 0 0 auto;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: 2.5rem;
		line-height: 1;
	}

	@media (max-width: 640px) {
		.app-header__inner {
			align-items: flex-start;
			gap: 1rem;
			padding: 1rem;
		}

		.app-header__app-name {
			font-size: 1rem;
		}

		.app-header__divider {
			min-height: 2.75rem;
			margin: 0 1rem;
		}

		.app-header__page-name {
			font-size: 1.5rem;
		}

		.app-header__brand {
			font-size: 2rem;
		}
	}
</style>