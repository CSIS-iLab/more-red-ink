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
		unit: 'pct_gdp'
	},

	cumulative: {
		unit: 'pct_gdp',
		showComponents: false
	},

	yearSpecific: {
		year: 2019,
		unit: 'pct_gdp',
		showComponents: true,
		scaleTo100: false
	},

	economySpecific: {
		economy: 'China',
		unit: 'pct_gdp',
		showComponents: false
	}
};

const getInitialState = () => structuredClone(initialState);

/**
 * Check whether a value is one of the configured options.
 */
const isValidOption = (options, value) => {
	return options.some((option) => option.value === value);
};

/**
 * Check whether a single User Driven choice has a valid value.
 */
const isChoiceValid = (key, value) => {
	const assumption = assumptionOptions[key];

	return Boolean(assumption) && isValidOption(assumption.options, value);
};

/**
 * Determine whether the current state represents a complete estimate.
 */
const isEstimateComplete = (state) => {
	if (state.mode === 'fastTrack') {
		return isValidOption(fastTrackOptions.options, state.fastTrackChoice);
	}

	if (state.mode === 'userDriven') {
		return Object.keys(assumptionOptions).every((key) =>
			isChoiceValid(key, state.userDrivenChoices[key])
		);
	}

	return false;
};

const createCalculatorState = () => {
	const { subscribe, set, update } = writable(getInitialState());

	let initialized = false;

	/**
	 * Persist the current calculator state for this browser session.
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
	 * Restore persisted calculator state and complete initialization.
	 */
	const initialize = () => {
		if (initialized) return;

		if (typeof sessionStorage !== 'undefined') {
			const savedState = sessionStorage.getItem(STORAGE_KEY);

			if (savedState) {
				try {
					const parsedState = JSON.parse(savedState);

					set({
						...getInitialState(),
						...parsedState,
						userDrivenChoices: {
							...getInitialState().userDrivenChoices,
							...parsedState.userDrivenChoices
						},
						historical: {
							...getInitialState().historical,
							...parsedState.historical
						},
						cumulative: {
							...getInitialState().cumulative,
							...parsedState.cumulative
						},
						yearSpecific: {
							...getInitialState().yearSpecific,
							...parsedState.yearSpecific
						},
						economySpecific: {
							...getInitialState().economySpecific,
							...parsedState.economySpecific
						}
					});
				} catch {
					sessionStorage.removeItem(STORAGE_KEY);
				}
			}
		}

		initialized = true;
	};

	/**
	 * Enter a calculator mode ('fastTrack' or 'userDriven').
	 *
	 * Entering the mode that is already active keeps the current estimate.
	 * Entering a different mode, or starting with no active mode, begins a
	 * new estimate with no assumption choices. Chart display settings are
	 * always preserved.
	 */
	const startMode = (mode) => {
		update((state) => {
			if (state.mode === mode) return state;

			return {
				...state,
				mode,
				fastTrackChoice: null,
				userDrivenChoices: getInitialState().userDrivenChoices
			};
		});
	};

	/**
	 * Update a top-level calculator state value.
	 */
	const updateValue = (key, value) => {
		update((state) => ({
			...state,
			[key]: value
		}));
	};

	/**
	 * Update one or more User Driven assumption choices.
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

		if (typeof sessionStorage !== 'undefined') {
			sessionStorage.removeItem(STORAGE_KEY);
		}
	};

	return {
		subscribe,
		initialize,
		startMode,
		updateValue,
		updateUserDrivenChoices,
		updateChartSettings,
		reset,
		isChoiceValid,
		isEstimateComplete,

		get initialized() {
			return initialized;
		}
	};
};

export const calculatorState = createCalculatorState();
