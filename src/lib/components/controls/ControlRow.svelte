<!--
  ControlRow

  A labeled row of chart controls, such as "Unit" with a dropdown or
  "Options" with checkboxes. The label sits beside the controls on wide
  screens and above them on narrow screens.

  The row is a labeled group, so screen readers announce the label
  with the controls inside it.
-->

<script>
	let { label, children } = $props();

	const labelId = $props.id();
</script>

<div class="control-row" role="group" aria-labelledby={labelId}>
	<span id={labelId} class="control-row__label text-label-medium-short">{label}</span>

	<div class="control-row__controls">
		{@render children()}
	</div>
</div>

<style>
	.control-row {
		display: flex;
		align-items: flex-start;
		gap: 1.5rem;
	}

	.control-row__label {
		flex: 0 0 5rem;
		/* Line the label up with the first line of text in the control. */
		padding-top: 0.875rem;
		color: var(--color-text-secondary);
		line-height: 1;
	}

	.control-row:has(:global(input[type='checkbox'])) .control-row__label {
		padding-top: 0.25rem;
	}

	.control-row__controls {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-width: 0;
		flex: 1;
	}

	@media (max-width: 959px) {
		.control-row {
			flex-direction: column;
			align-items: stretch;
			gap: 0.75rem;
		}

		.control-row__label,
		.control-row:has(:global(input[type='checkbox'])) .control-row__label {
			flex-basis: auto;
			padding-top: 0;
		}
	}
</style>
