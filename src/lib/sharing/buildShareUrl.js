/**
 * Serializes a calculator configuration into a shareable URL.
 *
 * Responsibilities:
 * - Convert the shareable parts of calculator state into URL parameters.
 * - Produce a URL that can reconstruct the same estimate and chart settings.
 *
 * Implementation notes:
 * - Serialize user choices and display settings, not calculated data.
 * - Keep URL parameter naming and encoding logic centralized here.
 * - Do not calculate estimates or format receipt content here.
 * - The caller provides the share payload; this never reads calculatorState.
 */

import { resolve } from '$app/paths';
import { SHARE_CHART_SETTINGS } from './sharePayload.js';
import {
	CHART,
	DISPLAY_SETTINGS,
	FAST_TRACK_CHOICE,
	MODE,
	USER_DRIVEN_CHOICES
} from './shareUrlFormat.js';

/**
 * Build the /share URL for a share payload:
 * { mode, assumptions, chartType, displaySettings }.
 *
 * Only the selected chart's settings are included. Values that can't be
 * encoded are left out, so the Share page reports the link as invalid
 * rather than showing a different chart.
 */
export function buildShareUrl(payload) {
	const params = new URLSearchParams();

	const add = (field, value) => {
		const code = field.encode(value);

		if (code !== undefined) {
			params.set(field.param, code);
		}
	};

	add(MODE, payload.mode);

	if (payload.mode === 'fastTrack') {
		add(FAST_TRACK_CHOICE, payload.assumptions);
	} else {
		for (const [key, field] of Object.entries(USER_DRIVEN_CHOICES)) {
			add(field, payload.assumptions?.[key]);
		}
	}

	add(CHART, payload.chartType);

	for (const key of SHARE_CHART_SETTINGS[payload.chartType] ?? []) {
		add(DISPLAY_SETTINGS[key], payload.displaySettings?.[key]);
	}

	return `${resolve('/share')}?${params}`;
}
