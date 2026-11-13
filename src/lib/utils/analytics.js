/**
 * Send a custom event to Google Analytics.
 *
 * Silently skips tracking when GA4 is unavailable,
 * including during server-side rendering.
 */
export const trackEvent = (eventName, parameters = {}) => {
	if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
		return;
	}

	window.gtag('event', eventName, parameters);
};

/**
 * Track the final assumptions used to complete an estimate.
 */
export const trackFinalAssumptions = (mode, choices) => {
	Object.entries(choices).forEach(([assumption, selection]) => {
		if (selection === null || selection === undefined) return;

		trackEvent('estimate_assumption', {
			calculator_mode: mode,
			assumption,
			selection
		});
	});
};
