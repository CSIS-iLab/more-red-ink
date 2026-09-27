/**
 * Central state for the user's calculator choices and chart settings.
 *
 * Responsibilities:
 * - Store the active calculator mode.
 * - Store Fast Track and User Driven assumption choices.
 * - Store each chart's independent display settings.
 * - Persist calculator state to sessionStorage.
 * - Restore calculator state when the application initializes.
 *
 * Implementation notes:
 * - Store user/session choices here, not calculated results.
 * - Do not store the source dataset, resolved estimates, chart series,
 *   receipt strings, formatted labels, or spreadsheet column names.
 * - Use an initialization flag so routes can distinguish between
 *   "state has not been restored yet" and "there is no active estimate."
 * - Keep chart display settings independent from one another.
 */

import { writable } from 'svelte/store';
import { assumptionOptions, fastTrackOptions } from '$lib/utils/assumptionOptions.js';

const STORAGE_KEY = 'more-red-ink-calculator-state';

const initialState = {
	mode: null,

	fastTrackChoice: null,

	userDrivenChoices: {
		chinaEstimationApproach: null,
		belowMarketCredit: null,
		stateInvestmentFunds: null,
		procurementCoverage: null,
		chinaOther: null
	},

	historical: {
		unit: null
	},

	cumulative: {
		unit: null,
		showComponents: false
	},

	yearSpecific: {
		year: null,
		unit: null,
		showComponents: false,
		scaleTo100: false
	},

	economySpecific: {
		economy: null,
		unit: null,
		showComponents: false
	}
};

const getInitialState = () => structuredClone(initialState);

/**
 * Check whether a value is one of the configured options.
 *
 * @param {{ value: string }[]} options
 * @param {string | null} value
 * @returns {boolean}
 */
const isValidOption = (options, value) => {
	return options.some((option) => option.value === value);
};

/**
 * Determine whether the current state represents a complete estimate.
 *
 * @param {typeof initialState} state
 * @returns {boolean}
 */
const isEstimateComplete = (state) => {
	if (state.mode === 'fastTrack') {
		return isValidOption(fastTrackOptions.options, state.fastTrackChoice);
	}

	if (state.mode === 'userDriven') {
		return Object.keys(assumptionOptions).every((key) => {
			const typedKey = /** @type {keyof typeof assumptionOptions} */ (key);
			const value = state.userDrivenChoices[typedKey];

			return isValidOption(assumptionOptions[typedKey].options, value);
		});
	}

	return false;
};

const createCalculatorState = () => {
	const { subscribe, set, update } = writable(getInitialState());

	let initialized = false;

	/**
	 * Persist the current calculator state for this browser session.
	 *
	 * @param {typeof initialState} state
	 */
	const persistState = (state) => {
		if (typeof sessionStorage === 'undefined') return;

		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	};

	subscribe((state) => {
		if (initialized) {
			persistState(state);
		}
	});

	/**
	 * Update a top-level calculator state value.
	 *
	 * @param {'mode' | 'fastTrackChoice'} key
	 * @param {string | null} value
	 */
	const updateValue = (key, value) => {
		update((state) => ({
			...state,
			[key]: value
		}));
	};

	/**
	 * Update one or more User Driven assumption choices.
	 *
	 * @param {Partial<typeof initialState.userDrivenChoices>} choices
	 */
	const updateUserDrivenChoices = (choices) => {
		update((state) => ({
			...state,
			userDrivenChoices: {
				...state.userDrivenChoices,
				...choices
			}
		}));
	};

	/**
	 * Update display settings for one chart without affecting the others.
	 *
	 * @param {'historical' | 'cumulative' | 'yearSpecific' | 'economySpecific'} chart
	 * @param {Record<string, string | boolean | null>} settings
	 */
	const updateChartSettings = (chart, settings) => {
		update((state) => {
			const nextSettings = {
				...state[chart],
				...settings
			};

			if (chart === 'yearSpecific') {
				const yearSpecificSettings = {
					...state.yearSpecific,
					...settings
				};

				if (yearSpecificSettings.showComponents === false) {
					yearSpecificSettings.scaleTo100 = false;
				}

				return {
					...state,
					yearSpecific: yearSpecificSettings
				};
			}

			return {
				...state,
				[chart]: nextSettings
			};
		});
	};

	/**
	 * Reset calculator choices and chart settings to their initial values.
	 *
	 * Initialization status remains unchanged during a runtime reset.
	 */
	const reset = () => {
		set(getInitialState());
	};

	return {
		subscribe,
		updateValue,
		updateUserDrivenChoices,
		updateChartSettings,
		reset,
		isEstimateComplete,

		get initialized() {
			return initialized;
		}
	};
};

export const calculatorState = createCalculatorState();
