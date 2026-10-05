/**
 * Share payload validation.
 *
 * Responsibilities:
 * - Define which display settings each shareable chart needs.
 * - Validate a share payload before the Share page uses it.
 *
 * Implementation notes:
 * - Payload shape (created by the Visualizer's handleShare):
 *   {
 *     mode: 'fastTrack' | 'userDriven',
 *     assumptions: 'minimum' | 'maximum'        // Fast Track
 *                | { ...all five choices },     // User Driven
 *     chartType: 'historical' | 'cumulative' | 'yearSpecific' | 'economySpecific',
 *     displaySettings: { ...settings for that chart }
 *   }
 * - The payload holds user choices and display settings only, never
 *   calculated data or receipt strings.
 * - URL encoding and parsing belong in buildShareUrl.js / parseShareUrl.js;
 *   #19 can reuse this validation for parsed URL values.
 */

import { calculatorState } from '$lib/stores/calculatorState.js';
import { CHART_YEARS, getUnitOption } from '$lib/utils/chartOptions.js';

/**
 * Display settings each shareable chart needs. Chart keys match the chart
 * setting keys in calculatorState.
 */
export const SHARE_CHART_SETTINGS = {
	historical: ['unit'],
	cumulative: ['unit', 'showComponents'],
	yearSpecific: ['year', 'unit', 'showComponents', 'scaleTo100'],
	economySpecific: ['economy', 'unit', 'showComponents']
};

const SETTING_VALIDATORS = {
	unit: (value) => Boolean(getUnitOption(value)),
	year: (value) => CHART_YEARS.includes(value),
	economy: (value) => typeof value === 'string' && value.length > 0,
	showComponents: (value) => typeof value === 'boolean',
	scaleTo100: (value) => typeof value === 'boolean'
};

/**
 * Convert a share payload's assumptions into the calculator-state shape
 * used by calculateEstimate() and isEstimateComplete().
 */
export function getEstimateState(payload) {
	return payload.mode === 'fastTrack'
		? { mode: payload.mode, fastTrackChoice: payload.assumptions }
		: { mode: payload.mode, userDrivenChoices: payload.assumptions ?? {} };
}

/**
 * Check a share payload before it is used.
 *
 * Returns null when the payload is valid, or a short description of the
 * first problem found. Economy values are checked against the source data
 * by the Share page once the data has loaded.
 */
export function getSharePayloadError(payload) {
	if (!payload || typeof payload !== 'object') {
		return 'No shared chart was provided.';
	}

	if (payload.mode !== 'fastTrack' && payload.mode !== 'userDriven') {
		return 'The shared estimate mode is missing or not supported.';
	}

	if (!calculatorState.isEstimateComplete(getEstimateState(payload))) {
		return 'The shared assumptions are incomplete or invalid.';
	}

	const settingKeys = SHARE_CHART_SETTINGS[payload.chartType];

	if (!settingKeys) {
		return 'The shared chart type is missing or not supported.';
	}

	const settings = payload.displaySettings ?? {};

	for (const key of settingKeys) {
		if (!SETTING_VALIDATORS[key](settings[key])) {
			return `The shared chart setting "${key}" is missing or invalid.`;
		}
	}

	if (payload.chartType === 'yearSpecific' && settings.scaleTo100 && !settings.showComponents) {
		return 'Scale to 100% can only be used when spending components are shown.';
	}

	return null;
}
