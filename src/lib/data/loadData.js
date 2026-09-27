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

function parseCsvLine(line) {
	const values = [];
	let currentValue = '';
	let insideQuotes = false;

	for (let i = 0; i < line.length; i += 1) {
		const character = line[i];

		if (character === '"') {
			if (insideQuotes && line[i + 1] === '"') {
				currentValue += '"';
				i += 1;
			} else {
				insideQuotes = !insideQuotes;
			}
		} else if (character === ',' && !insideQuotes) {
			values.push(currentValue);
			currentValue = '';
		} else {
			currentValue += character;
		}
	}

	values.push(currentValue);

	return values;
}

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

function parseCsv(csvText) {
  const lines = csvText.trim().split(/\r?\n/);
  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);

    return Object.fromEntries(
      headers.map((header, index) => [
        header,
        normalizeValue(header, values[index] ?? '')
      ])
    );
  });
}