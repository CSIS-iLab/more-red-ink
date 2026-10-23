/**
 * Links used across the application.
 */

import { resolve } from '$app/paths';

// TODO: Replace with the confirmed More Red Ink report URL.
export const REPORT_URL = 'https://www.csis.org/';

export const CSIS_URL = 'https://www.csis.org/';

// Home reads this flag and starts its tab without an estimate.
export const NEW_ESTIMATE_PARAM = 'new-estimate';

/**
 * "Create a new estimate" (opened in a new tab): Home's "Using the
 * Calculator" section, with the flag that clears the estimate in that tab.
 * People coming from an estimate have already read the introduction.
 */
export function getNewEstimateHref() {
	return `${resolve('/')}?${NEW_ESTIMATE_PARAM}#using-the-calculator`;
}
