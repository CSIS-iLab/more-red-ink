/**
 * Shared metadata for the canonical spending components.
 *
 * Responsibilities:
 * - Define the canonical component keys used by the application.
 * - Define human-readable labels and other presentation metadata.
 * - Provide a single source of truth for charts, receipts, and other UI.
 *
 * Implementation notes:
 * - Keep presentation metadata here.
 * - Do not map methodology-specific spreadsheet columns here.
 * - Spreadsheet column resolution belongs in calculateEstimate.js.
 * - Order matters: it's the chart stacking order (bottom up), the Receipt's
 *   row order, and the order of under-chart legends. Legends beside the
 *   chart and tooltips list the stack top down (the reverse).
 * - chinaOnly: estimated for China only (other economies show "Not
 *   included" in tooltips).
 */

export const spendingComponents = {
	directSubsidies: {
		label: 'Direct Subsidies'
	},
	otherTaxIncentives: {
		label: 'Other Tax Incentives'
	},
	rdTaxIncentives: {
		label: 'R&D Tax Incentives'
	},
	rdSupport: {
		label: 'R&D Support'
	},
	belowMarketCredit: {
		label: 'Below-Market Credit'
	},
	stateInvestmentFunds: {
		label: 'State Investment Funds'
	},
	governmentProcurement: {
		label: 'Government Procurement'
	},
	// China-specific tools, at the top of the stack in reverse assumption
	// order, so the legend and tooltips (which read top down) list them in
	// assumption order: Below-Market Land, Debt-Equity Swaps, SOE Net Payables.
	soeNetPayables: {
		label: 'SOE Net Payables',
		chinaOnly: true
	},
	debtEquitySwaps: {
		label: 'Debt-Equity Swaps',
		chinaOnly: true
	},
	land: {
		label: 'Below-Market Land',
		chinaOnly: true
	}
};
