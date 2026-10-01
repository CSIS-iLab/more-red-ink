/**
 * Loads and normalizes the source dataset.
 *
 * Responsibilities:
 * - Fetch the published Google Sheet data.
 * - Perform basic normalization needed to create a consistent source dataset.
 * - Return source data for use by the application.
 *
 * Implementation notes:
 * - This module knows about the structure of the source data.
 * - It does not know or care which assumptions the user selected.
 * - It does not calculate an estimate.
 */

import { csv } from 'd3-fetch';

const DATA_URL =
	'https://docs.google.com/spreadsheets/d/e/2PACX-1vRLonylYgcQ2GAFWBxA4ftew_2ugPbOFkAPNeIugaD8a2YcrOr7H9Vf-xWn5gceHmeFwdS8ccTQjkYH/pub?output=csv';

const NUMERIC_FIELDS = new Set([
	'year',
	'direct_subsidies',
	'other_tax_incentives',
	'r_d_tax_incentives',
	'govt_support_for_r_d',
	'below_market_credit',
	'state_investment_funds',
	'land',
	'soe_net_payables',
	'debt_equity_swaps',
	'below_market_credit_flow',
	'below_market_credit_soe_vs_private',
	'direct_subsidies_soe_vs_private',
	'other_tax_incentives_soe_vs_private',
	'total_state_investment_funds',
	'govt_procurement_total',
	'govt_procurement_goods',
	'govt_procurement_central_goods'
]);

function normalizeValue(field, value) {
	const trimmedValue = value.trim();

	if (trimmedValue === '') {
		return null;
	}

	if (NUMERIC_FIELDS.has(field)) {
		return Number(trimmedValue);
	}

	return trimmedValue;
}

function normalizeRow(row) {
	return Object.fromEntries(
		Object.entries(row).map(([field, value]) => [field, normalizeValue(field, value)])
	);
}

let dataPromise;

export function loadData() {
	if (!dataPromise) {
		dataPromise = csv(DATA_URL, normalizeRow).catch((error) => {
			dataPromise = undefined;
			throw error;
		});
	}

	return dataPromise;
}
