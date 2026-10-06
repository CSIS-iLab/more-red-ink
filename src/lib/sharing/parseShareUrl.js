/**
 * Reconstructs calculator configuration from a shared URL.
 *
 * Responsibilities:
 * - Read supported URL parameters.
 * - Validate and normalize shared values.
 * - Return the calculator configuration needed to recreate the shared view.
 *
 * Implementation notes:
 * - Treat URL input as untrusted and validate values before using them.
 * - Reconstruct user choices and display settings, not calculated data.
 * - Do not calculate the estimate here.
 * - Never fill in defaults: anything missing or unrecognized makes the
 *   whole URL invalid.
 * - Parameters that aren't part of the share format (for example tracking
 *   parameters added by social sites) are ignored.
 */

import { getSharePayloadError, SHARE_CHART_SETTINGS } from './sharePayload.js';
import {
	CHART,
	DISPLAY_SETTINGS,
	FAST_TRACK_CHOICE,
	MODE,
	USER_DRIVEN_CHOICES
} from './shareUrlFormat.js';

const ALL_SHARE_PARAMS = [
	MODE,
	CHART,
	FAST_TRACK_CHOICE,
	...Object.values(USER_DRIVEN_CHOICES),
	...Object.values(DISPLAY_SETTINGS)
].map((field) => field.param);

const invalid = (error) => ({ payload: null, error });

/**
 * Parse share URL query parameters into a share payload:
 * { mode, assumptions, chartType, displaySettings }.
 *
 * Returns { payload, error: null } for a valid URL, or
 * { payload: null, error } describing the first problem found. Economy
 * values are checked against the source data by the Share page.
 */
export function parseShareUrl(searchParams) {
	for (const param of ALL_SHARE_PARAMS) {
		if (searchParams.getAll(param).length > 1) {
			return invalid('The share link contains a repeated setting.');
		}
	}

	const read = (field) => {
		const code = searchParams.get(field.param);

		return code === null ? undefined : field.decode(code);
	};

	const mode = read(MODE);
	const chartType = read(CHART);

	// Only the parameters for this mode and chart may appear.
	const allowedParams = new Set([MODE.param, CHART.param]);

	let assumptions;

	if (mode === 'fastTrack') {
		allowedParams.add(FAST_TRACK_CHOICE.param);
		assumptions = read(FAST_TRACK_CHOICE);
	} else if (mode === 'userDriven') {
		assumptions = {};

		for (const [key, field] of Object.entries(USER_DRIVEN_CHOICES)) {
			allowedParams.add(field.param);
			assumptions[key] = read(field);
		}
	}

	const displaySettings = {};

	for (const key of SHARE_CHART_SETTINGS[chartType] ?? []) {
		allowedParams.add(DISPLAY_SETTINGS[key].param);
		displaySettings[key] = read(DISPLAY_SETTINGS[key]);
	}

	const payload = { mode, assumptions, chartType, displaySettings };

	const error = getSharePayloadError(payload);

	if (error) {
		return invalid(error);
	}

	const unexpected = ALL_SHARE_PARAMS.filter(
		(param) => searchParams.has(param) && !allowedParams.has(param)
	);

	if (unexpected.length > 0) {
		return invalid("The share link includes settings that don't apply to this chart.");
	}

	return { payload, error: null };
}
