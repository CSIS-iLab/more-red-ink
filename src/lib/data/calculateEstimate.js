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

/**
 * Resolve Direct Subsidies.
 *
 * China's SOE Advantage approach uses the SOE-vs-private estimate.
 * China's Industry-Based approach and all non-China economies use the
 * standard direct-subsidies field.
 */
const getDirectSubsidies = (row, assumptions) => {
	if (isChina(row) && assumptions.chinaEstimationApproach === 'soeAdvantage') {
		return row.direct_subsidies_soe_vs_private;
	}

	return row.direct_subsidies;
};

/**
 * Resolve Other Tax Incentives.
 *
 * China's SOE Advantage approach uses the SOE-vs-private estimate.
 * China's Industry-Based approach and all non-China economies use the
 * standard other-tax-incentives field.
 */
const getOtherTaxIncentives = (row, assumptions) => {
	if (isChina(row) && assumptions.chinaEstimationApproach === 'soeAdvantage') {
		return row.other_tax_incentives_soe_vs_private;
	}

	return row.other_tax_incentives;
};

/**
 * Resolve Below-Market Credit.
 *
 * Flow uses the same flow-based source field for all economies.
 * For Stock, China's SOE Advantage approach uses the SOE-vs-private
 * estimate; China's Industry-Based approach and all non-China economies
 * use the standard stock-based field.
 */
const getBelowMarketCredit = (row, assumptions) => {
	if (assumptions.belowMarketCredit === 'flow') {
		return row.below_market_credit_flow;
	}

	if (isChina(row) && assumptions.chinaEstimationApproach === 'soeAdvantage') {
		return row.below_market_credit_soe_vs_private;
	}

	return row.below_market_credit;
};

/**
 * Resolve State Investment Funds.
 *
 * The user's choice applies to all economies: either count 10 percent
 * of funding or the full value of state investment fund investments.
 */
const getStateInvestmentFunds = (row, assumptions) => {
	if (assumptions.stateInvestmentFunds === 'oneHundredPercent') {
		return row.total_state_investment_funds;
	}

	return row.state_investment_funds;
};

/**
 * Resolve Government Procurement.
 *
 * The user's coverage choice applies to all economies and selects the
 * corresponding procurement source field. Excluding procurement returns
 * zero because the component applies but is intentionally omitted from
 * the estimate.
 */
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

/**
 * Resolve China's three "Other" components: SOE Net Payables, Land,
 * and Debt-Equity Swaps.
 *
 * These components do not apply to non-China economies, so those rows
 * return null. For China, excluding the components returns zero because
 * they apply but are intentionally omitted from the estimate.
 */
const getChinaOther = (row, assumptions, field) => {
	if (!isChina(row)) {
		return null;
	}

	if (assumptions.chinaOther === 'excludeAll') {
		return 0;
	}

	return row[field];
};

/**
 * Resolve one source row using the user's individual methodology choices.
 *
 * The methodology helpers above select the appropriate source value for
 * each configurable component. R&D Tax Incentives and R&D Support are
 * always included directly from the source data.
 *
 * The returned row replaces spreadsheet-specific field names with the
 * application's 10 canonical spending components while preserving the
 * source country, year, and unit. Null component values contribute zero
 * to the total but remain null in the resolved row.
 */
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

/**
 * Select the smallest or largest available value for a Fast Track component.
 *
 * Fast Track resolves each configurable spending component independently
 * using its lowest or highest available methodology value. Null values are
 * ignored so missing or non-applicable source values do not affect the
 * comparison. If no candidate values are available, the component remains null.
 */
const getMinOrMax = (values, choice) => {
	const availableValues = values.filter((value) => value != null);

	if (availableValues.length === 0) {
		return null;
	}

	return choice === 'maximum' ? Math.max(...availableValues) : Math.min(...availableValues);
};

/**
 * Resolve one source row for the Fast Track workflow.
 *
 * Fast Track does not represent a fixed set of User-Driven choices.
 * Instead, Minimum selects the smallest available value for each
 * configurable spending component and Maximum selects the largest.
 *
 * China has additional methodology-specific candidates for Direct
 * Subsidies, Other Tax Incentives, and Below-Market Credit. R&D Tax
 * Incentives and R&D Support remain constant in both estimates.
 *
 * Minimum excludes Government Procurement and China's three "Other"
 * components. Maximum includes the largest available procurement value
 * and includes the China-only components. Those components remain null
 * for non-China economies because they do not apply.
 *
 * The returned row uses the same canonical component structure as a
 * User-Driven row so downstream charts do not need to know which
 * calculator workflow produced the estimate.
 */
const resolveFastTrackRow = (row, choice) => {
	const directSubsidies = isChina(row)
		? getMinOrMax([row.direct_subsidies, row.direct_subsidies_soe_vs_private], choice)
		: row.direct_subsidies;

	const otherTaxIncentives = isChina(row)
		? getMinOrMax([row.other_tax_incentives, row.other_tax_incentives_soe_vs_private], choice)
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

	const soeNetPayables = isChina(row) ? (choice === 'maximum' ? row.soe_net_payables : 0) : null;

	const land = isChina(row) ? (choice === 'maximum' ? row.land : 0) : null;

	const debtEquitySwaps = isChina(row) ? (choice === 'maximum' ? row.debt_equity_swaps : 0) : null;

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

/**
 * Resolve the normalized source dataset into the estimate used by the Visualizer.
 *
 * This is the public entry point for the calculation layer. It accepts the
 * normalized source data and current calculator state, routes each row through
 * the appropriate Fast Track or User-Driven methodology, and returns one
 * consistent resolved dataset across all countries, years, and units.
 *
 * The function does not mutate the source data or calculator state. Invalid
 * source data or a state without an active calculator mode returns an empty
 * dataset.
 */
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
