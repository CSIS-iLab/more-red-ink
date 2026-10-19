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
 * China's SOE Advantage approach uses the SOE-vs-private estimate.
 * China's Industry-Based approach and all non-China economies use
 * the standard below-market credit field.
 */
const getBelowMarketCredit = (row, assumptions) => {
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
 * Resolve an individually selectable China-specific spending component.
 *
 * These components do not apply to non-China economies, so those rows
 * return null. For China, each component is independently included or
 * excluded based on its corresponding User Driven assumption.
 * Excluded components return zero.
 */
const getChinaSpecificComponent = (row, choice, field) => {
	if (!isChina(row)) {
		return null;
	}

	if (choice === 'include') {
		return row[field];
	}

	if (choice === 'exclude') {
		return 0;
	}

	return null;
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
	const soeNetPayables = getChinaSpecificComponent(
		row,
		assumptions.soeNetPayables,
		'soe_net_payables'
	);

	const land = getChinaSpecificComponent(row, assumptions.land, 'land');

	const debtEquitySwaps = getChinaSpecificComponent(
		row,
		assumptions.debtEquitySwaps,
		'debt_equity_swaps'
	);
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
 * Resolve one source row for the Fast Track workflow.
 *
 * Minimum and Maximum use predefined combinations of the
 * User Driven assumptions, based on the approved methodology.
 * Both workflows therefore produce the same canonical components.
 */
const resolveFastTrackRow = (row, choice) => {
  const presets = {
    minimum: {
      chinaEstimationApproach: 'soeAdvantage',
      stateInvestmentFunds: 'tenPercent',
      procurementCoverage: 'excludeAll',
      land: 'exclude',
      debtEquitySwaps: 'exclude',
      soeNetPayables: 'exclude'
    },
    maximum: {
      chinaEstimationApproach: 'industryBased',
      stateInvestmentFunds: 'oneHundredPercent',
      procurementCoverage: 'allItems',
      land: 'include',
      debtEquitySwaps: 'include',
      soeNetPayables: 'include'
    }
  };

  return resolveUserDrivenRow(row, presets[choice]);
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
