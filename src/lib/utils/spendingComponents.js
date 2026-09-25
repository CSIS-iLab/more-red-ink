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
	soeNetPayables: {
		label: 'SOE Net Payables'
	},
	land: {
		label: 'Land'
	},
	debtEquitySwaps: {
		label: 'Debt-Equity Swaps'
	}
};
