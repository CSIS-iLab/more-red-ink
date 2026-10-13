<script>
	import { resolve } from '$app/paths';
	let { href, label = 'Back' } = $props();
</script>

<a class="back-link text-body-2-regular" href={resolve(href)}>
	<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
		<path
			d="M1.08 5.8651L4.395 2.5501L5.325 3.4801L4.2 4.6051L3.48 5.2051L3.495 5.2651L4.845 5.1751H11.73V6.5551H4.845L3.495 6.4651L3.48 6.5251L4.2 7.1251L5.325 8.2501L4.395 9.1801L1.08 5.8651Z"
			fill="currentColor"
		/>
	</svg>

	<span class="text-label-small-emphasized">{label}</span>
</a>

<style>
	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		color: var(--color-link-text);
		text-decoration: none;
		border-bottom: 1px solid currentColor;
		line-height: 1;
    transition: color 0.3s ease;
	}

	.back-link:hover {
		color: var(--color-link-hover);
	}

	.back-link:focus-visible {
		outline: 2px solid var(--color-card-button-focus-border);
		outline-offset: 4px;
		border-radius: 2px;
	}
</style>
