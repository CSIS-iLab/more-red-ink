/**
 * Resolves source data into an estimate using the user's assumptions.
 *
 * Responsibilities:
 * - Apply MRI methodology and business rules.
 * - Map user assumptions to the appropriate source-data columns.
 * - Resolve methodology-specific source fields into the canonical
 *   spending components.
 * - Calculate totals where appropriate.
 * - Return the resolved long-form estimate used by the visualizer.
 *
 * Implementation notes:
 * - This is the primary boundary between raw spreadsheet structure
 *   and the rest of the application.
 * - Charts should not need to know methodology-specific spreadsheet
 *   column names.
 * - Do not mutate calculator state or source data here.
 */

const isChina = (row) => row.country === 'China';

const getDirectSubsidies = (row, assumptions) => {
	if (isChina(row) && assumptions.chinaEstimationApproach === 'soeAdvantage') {
		return row.direct_subsidies_soe_vs_private;
	}

	return row.direct_subsidies;
};

const getOtherTaxIncentives = (row, assumptions) => {
	if (isChina(row) && assumptions.chinaEstimationApproach === 'soeAdvantage') {
		return row.other_tax_incentives_soe_vs_private;
	}

	return row.other_tax_incentives;
};

const getBelowMarketCredit = (row, assumptions) => {
	if (assumptions.belowMarketCredit === 'flow') {
		return row.below_market_credit_flow;
	}

	if (isChina(row) && assumptions.chinaEstimationApproach === 'soeAdvantage') {
		return row.below_market_credit_soe_vs_private;
	}

	return row.below_market_credit;
};

const getStateInvestmentFunds = (row, assumptions) => {
	if (assumptions.stateInvestmentFunds === 'oneHundredPercent') {
		return row.total_state_investment_funds;
	}

	return row.state_investment_funds;
};

const getGovernmentProcurement = (row, assumptions) => {
	switch (assumptions.procurementCoverage) {
		case 'allItems':
			return row.govt_procurement_total;
		case 'totalGoods':
			return row.govt_procurement_goods;
		case 'centralGoods':
			return row.govt_procurement_central_goods;
		case 'excludeAll':
			return 0;
		default:
			return null;
	}
};

const getChinaOther = (row, assumptions, field) => {
	if (!isChina(row) || assumptions.chinaOther === 'excludeAll') {
		return 0;
	}

	return row[field];
};

const resolveUserDrivenRow = (row, assumptions) => {
	const directSubsidies = getDirectSubsidies(row, assumptions);
	const otherTaxIncentives = getOtherTaxIncentives(row, assumptions);
	const rdTaxIncentives = row.r_d_tax_incentives;
	const rdSupport = row.govt_support_for_r_d;
	const belowMarketCredit = getBelowMarketCredit(row, assumptions);
	const stateInvestmentFunds = getStateInvestmentFunds(row, assumptions);
	const governmentProcurement = getGovernmentProcurement(row, assumptions);
	const soeNetPayables = getChinaOther(row, assumptions, 'soe_net_payables');
	const land = getChinaOther(row, assumptions, 'land');
	const debtEquitySwaps = getChinaOther(row, assumptions, 'debt_equity_swaps');

	const components = [
		directSubsidies,
		otherTaxIncentives,
		rdTaxIncentives,
		rdSupport,
		belowMarketCredit,
		stateInvestmentFunds,
		governmentProcurement,
		soeNetPayables,
		land,
		debtEquitySwaps
	];

	const total = components.reduce((sum, value) => sum + (value ?? 0), 0);

	return {
		country: row.country,
		year: row.year,
		unit: row.unit,
		directSubsidies,
		otherTaxIncentives,
		rdTaxIncentives,
		rdSupport,
		belowMarketCredit,
		stateInvestmentFunds,
		governmentProcurement,
		soeNetPayables,
		land,
		debtEquitySwaps,
		total
	};
};

const getMinOrMax = (values, choice) => {
	const availableValues = values.filter((value) => value != null);

	if (availableValues.length === 0) {
		return null;
	}

	return choice === 'maximum'
		? Math.max(...availableValues)
		: Math.min(...availableValues);
};

const resolveFastTrackRow = (row, choice) => {
	const directSubsidies = isChina(row)
		? getMinOrMax(
				[row.direct_subsidies, row.direct_subsidies_soe_vs_private],
				choice
			)
		: row.direct_subsidies;

	const otherTaxIncentives = isChina(row)
		? getMinOrMax(
				[row.other_tax_incentives, row.other_tax_incentives_soe_vs_private],
				choice
			)
		: row.other_tax_incentives;

	const rdTaxIncentives = row.r_d_tax_incentives;
	const rdSupport = row.govt_support_for_r_d;

	const belowMarketCredit = getMinOrMax(
		isChina(row)
			? [
					row.below_market_credit,
					row.below_market_credit_soe_vs_private,
					row.below_market_credit_flow
				]
			: [row.below_market_credit, row.below_market_credit_flow],
		choice
	);

	const stateInvestmentFunds = getMinOrMax(
		[row.state_investment_funds, row.total_state_investment_funds],
		choice
	);

	const governmentProcurement =
		choice === 'maximum'
			? getMinOrMax(
					[
						row.govt_procurement_total,
						row.govt_procurement_goods,
						row.govt_procurement_central_goods
					],
					'maximum'
				)
			: 0;

	const soeNetPayables = isChina(row)
		? choice === 'maximum'
			? row.soe_net_payables
			: 0
		: null;

	const land = isChina(row)
		? choice === 'maximum'
			? row.land
			: 0
		: null;

	const debtEquitySwaps = isChina(row)
		? choice === 'maximum'
			? row.debt_equity_swaps
			: 0
		: null;

	const components = [
		directSubsidies,
		otherTaxIncentives,
		rdTaxIncentives,
		rdSupport,
		belowMarketCredit,
		stateInvestmentFunds,
		governmentProcurement,
		soeNetPayables,
		land,
		debtEquitySwaps
	];

	const total = components.reduce((sum, value) => sum + (value ?? 0), 0);

	return {
		country: row.country,
		year: row.year,
		unit: row.unit,
		directSubsidies,
		otherTaxIncentives,
		rdTaxIncentives,
		rdSupport,
		belowMarketCredit,
		stateInvestmentFunds,
		governmentProcurement,
		soeNetPayables,
		land,
		debtEquitySwaps,
		total
	};
};

export function calculateEstimate(data, assumptions) {
	if (!Array.isArray(data)) {
		return [];
	}

	if (assumptions.mode === 'fastTrack') {
		return data.map((row) => resolveFastTrackRow(row, assumptions.fastTrackChoice));
	}

	if (assumptions.mode === 'userDriven') {
		return data.map((row) => resolveUserDrivenRow(row, assumptions.userDrivenChoices));
	}

	return [];
}