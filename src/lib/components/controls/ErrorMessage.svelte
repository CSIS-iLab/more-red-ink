<script>
	let { children, ...restProps } = $props();
</script>

<p class="error-message text-label-small" role="alert" {...restProps}>
	<span class="error-message__icon" aria-hidden="true"></span>
	<span>{@render children?.()}</span>
</p>

<style>
	.error-message {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0;
		color: var(--color-text-error);
		line-height: 1.2;
	}

	/* The icon is used as a mask so it always matches the text color. */
	.error-message__icon {
		flex-shrink: 0;
		width: 24px;
		height: 24px;
		background-color: currentColor;
		mask: url('/icons/error.svg') center / contain no-repeat;
	}
</style>
